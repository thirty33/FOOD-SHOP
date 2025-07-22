import { describe, it, expect, vi, beforeEach, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BreadCrumbsNavigation } from './index'
import { TestRouter } from '../../tests/utils/testWrappers'
import { ROUTES } from '../../config/routes'
import { textMessages } from '../../config/textMessages'
import { SnackbarProvider } from 'notistack'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { Route, Routes } from 'react-router-dom'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env.VITE_API_URL

// Mock menu API response
const mockMenuResponse = {
  status: 'success',
  message: 'Active menu retrieved successfully',
  data: {
    current_page: 1,
    data: [
      {
        id: 368,
        available_from: '2025-07-25',
        available_until: '2025-07-25',
        created_at: '2025-07-25T12:00:00.000000Z',
        updated_at: '2025-07-25T12:00:00.000000Z',
        categories: [
          {
            id: 15,
            name: 'OFERTAS DE LA SEMANA',
            description: 'Ofertas especiales',
            image: null,
            menu_id: 368,
            created_at: '2025-07-25T12:00:00.000000Z',
            updated_at: '2025-07-25T12:00:00.000000Z'
          }
        ]
      }
    ],
    first_page_url: `${API_URL}/menus?page=1`,
    from: 1,
    last_page: 1,
    last_page_url: `${API_URL}/menus?page=1`,
    links: [
      {
        url: null,
        label: '&laquo; Previous',
        active: false
      },
      {
        url: `${API_URL}/menus?page=1`,
        label: '1',
        active: true
      },
      {
        url: null,
        label: 'Next &raquo;',
        active: false
      }
    ],
    next_page_url: null,
    path: `${API_URL}/menus`,
    per_page: 15,
    prev_page_url: null,
    to: 1,
    total: 1
  }
}

// Mock categories API response
const mockCategoriesResponse = {
  status: 'success',
  message: 'Categories retrieved successfully',
  data: [
    {
      id: 15,
      name: 'OFERTAS DE LA SEMANA',
      description: 'Ofertas especiales de la semana',
      image: null,
      menu_id: 368,
      created_at: '2025-07-25T12:00:00.000000Z',
      updated_at: '2025-07-25T12:00:00.000000Z',
      products: [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 10.99,
          image: 'product1.jpg'
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price: 15.99,
          image: 'product2.jpg'
        }
      ]
    }
  ]
}

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Test wrapper component
const TestWrapper = ({ children, menuId = '368' }: { children: React.ReactNode; menuId?: string }) => {
  return (
    <TestRouter initialEntries={[`/${ROUTES.GET_CATEGORY_ROUTE(menuId)}?date=2025-07-25`]}>
      <SnackbarProvider>
        <GlobalProvider>
          <OrderProvider>
            <Routes>
              <Route path={`/${ROUTES.CATEGORY_ROUTE}`} element={children} />
              <Route path={ROUTES.MENUS} element={<div>Menus Page</div>} />
            </Routes>
          </OrderProvider>
        </GlobalProvider>
      </SnackbarProvider>
    </TestRouter>
  )
}

describe('BreadCrumbsNavigation Component', () => {
  beforeAll(() => {
    // Set up MSW handlers for this test suite
    server.use(
      http.get(`${API_URL}/menus/:menuId`, () => {
        return HttpResponse.json(mockMenuResponse)
      }),
      http.get(`${API_URL}/menus/:menuId/categories`, () => {
        return HttpResponse.json(mockCategoriesResponse)
      }),
      // Add handler for orders requests to prevent MSW warnings
      http.get(`${API_URL}/orders/get-order/:date`, () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Order retrieved successfully',
          data: null
        })
      })
    )
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('should display correct breadcrumb text when on CATEGORY_ROUTE', () => {
    render(
      <TestWrapper>
        <BreadCrumbsNavigation />
      </TestWrapper>
    )

    // Should display "Menús" link using textMessages
    const menusLink = screen.getByRole('link', { name: textMessages.BREADCRUMBS.MENUS })
    expect(menusLink).toBeInTheDocument()

    // Should display formatted date text "Menú viernes, 25 de julio de 2025"
    const dateText = screen.getByText('Menú viernes, 25 de julio de 2025')
    expect(dateText).toBeInTheDocument()
  })

  it('should navigate to Menus component when clicking "Menús" breadcrumb', () => {
    render(
      <TestWrapper>
        <BreadCrumbsNavigation />
      </TestWrapper>
    )

    // Find and click the "Menús" link using textMessages
    const menusLink = screen.getByRole('link', { name: textMessages.BREADCRUMBS.MENUS })
    expect(menusLink).toBeInTheDocument()
    
    fireEvent.click(menusLink)

    // Verify the link has correct href using ROUTES
    expect(menusLink.getAttribute('href')).toBe(ROUTES.MENUS)
  })

  it('should actually navigate to Menus route when clicking "Menús" breadcrumb', () => {
    // Create a test component that renders both BreadCrumbs and a mock Menus component
    const MockMenusComponent = () => <div data-testid="menus-component">Menus Component Rendered</div>
    
    render(
      <TestRouter initialEntries={[`/${ROUTES.GET_CATEGORY_ROUTE('368')}?date=2025-07-25`]}>
        <SnackbarProvider>
          <GlobalProvider>
            <OrderProvider>
              <Routes>
                <Route path={`/${ROUTES.CATEGORY_ROUTE}`} element={<BreadCrumbsNavigation />} />
                <Route path={ROUTES.MENUS} element={<MockMenusComponent />} />
              </Routes>
            </OrderProvider>
          </GlobalProvider>
        </SnackbarProvider>
      </TestRouter>
    )

    // Find the "Menús" link
    const menusLink = screen.getByRole('link', { name: textMessages.BREADCRUMBS.MENUS })
    expect(menusLink).toBeInTheDocument()
    
    // Click the link to trigger navigation
    fireEvent.click(menusLink)

    // Verify that the Menus component is now rendered
    expect(screen.getByTestId('menus-component')).toBeInTheDocument()
    expect(screen.getByText('Menus Component Rendered')).toBeInTheDocument()
  })
})