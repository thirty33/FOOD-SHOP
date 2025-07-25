import { TestRouter } from '../../tests/utils/testWrappers'
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import React from 'react'
import { CategoriesProducts } from './index'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { server } from '../../mocks/server'
import { infiniteScrollHandlers } from '../../mocks/infiniteScrollHandlers'
import { categoryService } from '../../services/category'
import { ROUTES } from '../../config/routes'
import { SnackbarProvider } from 'notistack'
import { truncateString } from '../../helpers/texts'
import { TRUNCATE_LENGTHS } from '../../config/constant'

// Get the base API URL
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock all dependencies except useCategories
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'individual',
      agreement_type: 'individual'
    }
  })
}))

vi.mock('../../hooks/useCurrentOrder', () => ({
  useOrder: () => ({
    addProductToCart: vi.fn(),
    showSideCart: false,
    setShowSideCart: vi.fn(),
    updateOrderLineItem: vi.fn(),
    currentOrder: {
      order_lines: []
    },
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'individual',
      permission: 'Individual'
    },
    showPrices: true
  })
}))

vi.mock('../../hooks/useScrollToClose', () => ({
  useScrollToClose: vi.fn()
}))

vi.mock('../../hooks/useScrollToTop', () => ({
  useScrollToTop: () => ({
    isVisible: false,
    scrollToTop: vi.fn()
  })
}))

// Mock react-router-dom params - use unique menuId for infinite scroll testing
const mockParams = { menuId: '777' }
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockParams
  }
})

// Wrapper component for providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestRouter initialEntries={[`/${ROUTES.GET_CATEGORY_ROUTE('777')}`]}>
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

describe('CategoriesProducts MSW Data Loading', () => {
  beforeAll(() => {
    // Reset handlers and add only our custom handlers for menuId 777
    server.resetHandlers(...infiniteScrollHandlers)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  afterAll(() => {
    server.close()
  })

  it('should load and display MSW mock data correctly for menuId 777', async () => {
    // Spy on categoryService to verify API calls
    const categoryServiceSpy = vi.spyOn(categoryService, 'list')

    await act(async () => {
      render(
        <TestWrapper>
          <CategoriesProducts />
        </TestWrapper>
      )
    })

    // 1. Wait for initial data to load and verify API was called
    await waitFor(() => {
      expect(categoryServiceSpy).toHaveBeenCalledTimes(1)
    }, { timeout: 5000 })
    
    expect(categoryServiceSpy).toHaveBeenCalledWith('777', { page: 1 })

    // 2. Verify first category from MSW mock data is displayed
    await waitFor(() => {
      expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    })

    // 3. Verify second category from MSW mock data is displayed (using same truncation as component)
    expect(screen.getByText(truncateString('OFERTAS DE LA SEMANA', TRUNCATE_LENGTHS.CATEGORY_NAME))).toBeInTheDocument()

    // 4. Verify products from first category are displayed
    expect(screen.getByText('Producto 1 Página 1')).toBeInTheDocument()

    // 5. Verify products from second category are displayed
    expect(screen.getByText('Producto 2 Página 1')).toBeInTheDocument()

    // 6. Verify category descriptions and details from MSW mock
    expect(screen.getByText('disponible hasta el viernes a las 15:00')).toBeInTheDocument()

    // 7. Verify product ingredients from MSW mock data
    expect(screen.getByText(/Ingrediente A/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente B/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente C/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente D/)).toBeInTheDocument()

    // 8. Verify product prices from MSW mock data (text may be split across elements)
    expect(screen.getByText(/\$15\.99/)).toBeInTheDocument()
    expect(screen.getByText(/\$12\.50/)).toBeInTheDocument()

    // 9. Verify pagination data indicates more pages available (hasMore should be true)
    // This is implicit - if MSW returns last_page: 2 and current_page: 1, hasMore should be true
    // The component should be ready for infinite scroll (though we're not testing the scroll itself)

  })

  it('should load first page, then load second page on scroll to bottom with proper function call counts', async () => {
    // Spy on categoryService to verify API calls
    const categoryServiceSpy = vi.spyOn(categoryService, 'list')
    
    // Mock scroll methods for window
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 })
    Object.defineProperty(document.documentElement, 'scrollTop', { writable: true, configurable: true, value: 0 })
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1600 })
    Object.defineProperty(document.documentElement, 'clientHeight', { writable: true, configurable: true, value: 800 })

    await act(async () => {
      render(
        <TestWrapper>
          <CategoriesProducts />
        </TestWrapper>
      )
    })

    // STEP 1: Verify first page loads correctly
    // 1.1. Wait for first page to load and verify API call
    await waitFor(() => {
      expect(categoryServiceSpy).toHaveBeenCalledTimes(1)
    }, { timeout: 5000 })
    
    expect(categoryServiceSpy).toHaveBeenNthCalledWith(1, '777', { page: 1 })

    // 1.2. Verify first page content is displayed
    await waitFor(() => {
      expect(screen.getByText('NUEVOS')).toBeInTheDocument()
      expect(screen.getByText(truncateString('OFERTAS DE LA SEMANA', TRUNCATE_LENGTHS.CATEGORY_NAME))).toBeInTheDocument()
    })

    // 1.3. Verify first page products are displayed based on our infiniteScrollHandlers mock data
    // From the mock, we should see "Producto 1 Página 1" and "Producto 2 Página 1"
    expect(screen.getByText('Producto 1 Página 1')).toBeInTheDocument()
    expect(screen.getByText('Producto 2 Página 1')).toBeInTheDocument()

    // 1.4. Verify that second page products are NOT yet displayed
    expect(screen.queryByText('Producto 1 Página 2')).not.toBeInTheDocument()

    // 1.5. Verify ingredients from first page (from infiniteScrollHandlers mock)
    expect(screen.getByText(/Ingrediente A/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente B/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente C/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente D/)).toBeInTheDocument()
    
    // 1.6. Verify that second page ingredients are NOT yet displayed
    expect(screen.queryByText(/Ingrediente E/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Ingrediente F/)).not.toBeInTheDocument()

    // STEP 2: Simulate scroll to bottom to trigger second page load
    // 2.1. Set scroll position to near bottom (triggers infinite scroll)
    await act(async () => {
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 750 }) // 750 + 800 = 1550, close to 1600
      
      // 2.2. Dispatch scroll event
      const scrollEvent = new Event('scroll')
      window.dispatchEvent(scrollEvent)

      // 2.3. Wait a bit for debounced scroll handler to execute
      await new Promise(resolve => setTimeout(resolve, 200))
    })

    // 2.4. Verify API was called for second page
    await waitFor(() => {
      expect(categoryServiceSpy).toHaveBeenCalledTimes(2)
    }, { timeout: 3000 })
    
    expect(categoryServiceSpy).toHaveBeenNthCalledWith(2, '777', { page: 2 })

    // STEP 3: Verify both pages content is now displayed
    // 3.1. Verify first page content is still displayed
    expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    expect(screen.getByText(truncateString('OFERTAS DE LA SEMANA', TRUNCATE_LENGTHS.CATEGORY_NAME))).toBeInTheDocument()
    expect(screen.getByText('Producto 1 Página 1')).toBeInTheDocument()
    expect(screen.getByText('Producto 2 Página 1')).toBeInTheDocument()

    // 3.2. Verify second page content is now displayed
    await waitFor(() => {
      expect(screen.getByText('POSTRES Y BEBIDAS')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Producto 1 Página 2')).toBeInTheDocument()

    // 3.3. Verify new ingredients from second page
    expect(screen.getByText(/Ingrediente E/)).toBeInTheDocument()
    expect(screen.getByText(/Ingrediente F/)).toBeInTheDocument()

    // 3.4. Verify new prices from second page
    expect(screen.getByText(/\$18\.75/)).toBeInTheDocument()

    // STEP 4: Final verification of function call counts
    // 4.1. Ensure API was called exactly 2 times (once per page)
    expect(categoryServiceSpy).toHaveBeenCalledTimes(2)
    
    // 4.2. Verify the exact calls made
    expect(categoryServiceSpy).toHaveBeenNthCalledWith(1, '777', { page: 1 })
    expect(categoryServiceSpy).toHaveBeenNthCalledWith(2, '777', { page: 2 })

    // STEP 5: Attempt to scroll again - should NOT trigger more calls since we're at last page
    // 5.1. Simulate another scroll to bottom
    await act(async () => {
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1550 })
      const scrollEvent = new Event('scroll')
      window.dispatchEvent(scrollEvent)
      
      // 5.2. Wait and verify no additional API calls were made
      await new Promise(resolve => setTimeout(resolve, 300))
    })
    expect(categoryServiceSpy).toHaveBeenCalledTimes(2) // Still only 2 calls
  })
})