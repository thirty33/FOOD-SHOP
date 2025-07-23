import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { CategoriesProducts } from './index'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { textMessages } from '../../config/textMessages'
import { ROUTES } from '../../config/routes'
import { TestRouter } from '../../tests/utils/testWrappers'
import { truncateString } from '../../helpers/texts'
import { TRUNCATE_LENGTHS } from '../../config/constant'

// Get the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock heavy components that we don't need for this test
vi.mock('../Products', () => ({
  ProductItem: ({ title, price }: { title: string; price: string }) => (
    <div data-testid="product-item">
      <h3>{title}</h3>
      <span>{price}</span>
    </div>
  )
}))

vi.mock('../Icons/ArrowUpIcon', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="arrow-up" onClick={onClick}>
      Arrow Up
    </button>
  )
}))

// Mock hooks that we don't want to test directly
vi.mock('../../hooks/useScrollToClose', () => ({
  useScrollToClose: () => {}
}))

vi.mock('../../hooks/useScrollToTop', () => ({
  useScrollToTop: () => ({
    isVisible: false,
    scrollToTop: vi.fn()
  })
}))

// Mock authentication context
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: 'test@test.com',
      role: 'individual',
      permissions: []
    }
  })
}))

// Wrapper component for providers
const TestWrapper = ({ children, menuId = '15' }: { children: React.ReactNode; menuId?: string }) => {
  return (
    <TestRouter initialEntries={[`/${ROUTES.GET_CATEGORY_ROUTE(menuId)}`]}>
      <SnackbarProvider>
        <GlobalProvider>
          <OrderProvider>
            <Routes>
              <Route path={`/${ROUTES.CATEGORY_ROUTE}`} element={children} />
            </Routes>
          </OrderProvider>
        </GlobalProvider>
      </SnackbarProvider>
    </TestRouter>
  )
}

describe('CategoriesProducts Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
    // Reset MSW handlers to default state
    server.resetHandlers()
  })

  afterEach(() => {
    // Clean up rendered components
    cleanup()
    // Clean up mocks and timers if they exist
    vi.clearAllMocks()
    // Only clear timers if they are mocked
    if (vi.isMockFunction(setTimeout)) {
      vi.clearAllTimers()
      vi.runOnlyPendingTimers()
    }
    // Reset MSW handlers after each test
    server.resetHandlers()
  })

  it('should render categories and products successfully', async () => {
    render(
      <TestWrapper>
        <CategoriesProducts />
      </TestWrapper>
    )

    // Verify that it shows the loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    })

    // Verify that categories are displayed
    expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    // Look specifically for the h2 with truncated category text (level 2)
    expect(screen.getByRole('heading', { level: 2, name: new RegExp(truncateString('OFERTAS DE LA SEMANA', TRUNCATE_LENGTHS.CATEGORY_NAME)) })).toBeInTheDocument()

    // Verify that schedules are displayed (actual text from API) - there are 2 categories with the same schedule
    expect(screen.getAllByText('disponible hasta el viernes 18 de julio de 2025 a las 15:00')).toHaveLength(2)

    // Verify that products are rendered
    expect(screen.getByText('NUEVOS Item 1')).toBeInTheDocument()
    expect(screen.getByText('NUEVOS Item 2')).toBeInTheDocument()
    expect(screen.getByText('OFERTAS DE LA SEMANA Item 2')).toBeInTheDocument()

    // Verify that the "no categories" message is NOT displayed
    expect(screen.queryByText(textMessages.NO_CATEGORIES_MESSAGE)).not.toBeInTheDocument()

    // Verify that the spinner is NO longer displayed
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should display "no categories" message when no categories are available', async () => {
    render(
      <TestWrapper menuId="999">
        <CategoriesProducts />
      </TestWrapper>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the no categories available message is displayed
    expect(screen.getByText(textMessages.NO_CATEGORIES_MESSAGE)).toBeInTheDocument()

    // Verify that NO categories are displayed
    expect(screen.queryByText('NUEVOS')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: new RegExp(truncateString('OFERTAS DE LA SEMANA', TRUNCATE_LENGTHS.CATEGORY_NAME)) })).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Mock to capture errors in the snackbar
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <TestWrapper menuId="500">
        <CategoriesProducts />
      </TestWrapper>
    )

    // Wait for loading to finish (should fail)
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the no categories message is displayed when there's an error (may appear multiple times due to error handling)
    expect(screen.getAllByText(textMessages.NO_CATEGORIES_MESSAGE)).toHaveLength(1)

    // Clean up the spy
    consoleSpy.mockRestore()
  })

  it('should display loading spinner while fetching data', () => {
    // Override the handler to make the response slower
    server.use(
      http.get(`${API_URL}/categories/:menuId`, async () => {
        // Artificial delay to test loading state
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.json({
          status: 'success',
          message: 'Categories retrieved successfully',
          data: {
            current_page: 1,
            data: [],
            first_page_url: '',
            from: 1,
            last_page: 1,
            last_page_url: '',
            links: [],
            next_page_url: null,
            path: '',
            per_page: 15,
            prev_page_url: null,
            to: 0,
            total: 0
          }
        })
      })
    )

    render(
      <TestWrapper>
        <CategoriesProducts />
      </TestWrapper>
    )

    // Verify that the loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should truncate long category names', async () => {
    // Override with a very long name
    const longCategoryName = 'Este es un nombre de categoría extremadamente largo que debería ser truncado'
    
    server.use(
      http.get(`${API_URL}/categories/:menuId`, () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Categories retrieved successfully',
          data: {
            current_page: 1,
            data: [{
              id: 1,
              order: 1,
              show_all_products: false,
              category_id: 101,
              menu_id: 1,
              category: {
                id: 101,
                name: longCategoryName,
                description: 'Test category',
                products: [],
                category_lines: [{
                  id: 1,
                  category_id: 101,
                  weekday: 'monday',
                  preparation_days: 1,
                  maximum_order_time: 'Hasta las 14:00 hrs',
                  active: true
                }],
                category_user_lines: [],
                subcategories: []
              },
              menu: {
                id: 1,
                active: true,
                title: 'Test menu',
                description: 'Test menu description',
                publication_date: '2024-01-15'
              },
              products: []
            }],
            first_page_url: '',
            from: 1,
            last_page: 1,
            last_page_url: '',
            links: [],
            next_page_url: null,
            path: '',
            per_page: 15,
            prev_page_url: null,
            to: 1,
            total: 1
          }
        })
      })
    )

    render(
      <TestWrapper>
        <CategoriesProducts />
      </TestWrapper>
    )

    await waitFor(() => {
      // The text should be truncated (should not show the full name)
      expect(screen.queryByText(longCategoryName)).not.toBeInTheDocument()
      // But it should show a truncated version (TRUNCATE_LENGTHS.CATEGORY_NAME characters + "...")
      expect(screen.getByText(truncateString(longCategoryName, TRUNCATE_LENGTHS.CATEGORY_NAME))).toBeInTheDocument()
    })
  })
})