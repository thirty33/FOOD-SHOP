import { TestRouter } from '../../tests/utils/testWrappers'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import React from 'react'
import { Menus } from './index'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { menuService } from '../../services/menu'
import { ROUTES } from '../../config/routes'
import { CategoriesProducts } from '../CategoriesProducts'
import { textMessages } from '../../config/textMessages'

// Get the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock react-router-dom for navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Wrapper component for providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestRouter>
      <GlobalProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </GlobalProvider>
    </TestRouter>
  )
}

// Mock data for first page
const firstPageMenus = [
  {
    id: 368,
    active: true,
    title: "Menú Viernes 009 - 25/07",
    description: "Selección gourmet con ingredientes premium y presentaciones elegantes.",
    publication_date: "2025-07-25"
  },
  {
    id: 374,
    active: true,
    title: "Menú Lunes 015 - 04/08",
    description: "Opciones vegetarianas y veganas para una alimentación consciente.",
    publication_date: "2025-08-04"
  }
]

// Mock data for second page
const secondPageMenus = [
  {
    id: 380,
    active: true,
    title: "Menú Martes 021 - 12/08",
    description: "Menú tradicional con opciones clásicas de la gastronomía chilena.",
    publication_date: "2025-08-12"
  },
  {
    id: 385,
    active: true,
    title: "Menú Miércoles 022 - 13/08",
    description: "Fusión de sabores internacionales con toques locales.",
    publication_date: "2025-08-13"
  }
]

// Helper function to simulate scroll
const simulateScroll = (scrollTop: number, clientHeight: number = 800, scrollHeight: number = 1600) => {
  Object.defineProperty(window, 'pageYOffset', {
    writable: true,
    value: scrollTop,
  })
  Object.defineProperty(document.documentElement, 'scrollTop', {
    writable: true,
    value: scrollTop,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    value: clientHeight,
  })
  Object.defineProperty(document.documentElement, 'clientHeight', {
    writable: true,
    value: clientHeight,
  })
  Object.defineProperty(document.body, 'scrollHeight', {
    writable: true,
    value: scrollHeight,
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    writable: true,
    value: scrollHeight,
  })
}

describe('Menus Infinite Scroll Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
    
    // Reset scroll properties
    simulateScroll(0)
  })

  afterEach(() => {
    // Clear timers after each test
    vi.clearAllTimers()
    // Clear global navigation function
    delete (window as any).testNavigate
  })

  it('should load second page when scrolling to bottom with 2 pages available', async () => {
    // Spy on the list method of menuService
    const menuServiceSpy = vi.spyOn(menuService, 'list')

    // Configure handlers to simulate 2 pages
    server.use(
      http.get(`${API_URL}/menus`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        
        if (page === 1) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 1,
              data: firstPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 1,
              last_page: 2, // Indicate that there are 2 pages
              last_page_url: `${API_URL}/menus?page=2`,
              links: [
                {
                  url: null,
                  label: "&laquo; Previous",
                  active: false
                },
                {
                  url: `${API_URL}/menus?page=1`,
                  label: "1",
                  active: true
                },
                {
                  url: `${API_URL}/menus?page=2`,
                  label: "2",
                  active: false
                },
                {
                  url: `${API_URL}/menus?page=2`,
                  label: "Next &raquo;",
                  active: false
                }
              ],
              next_page_url: `${API_URL}/menus?page=2`,
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: null,
              to: 2,
              total: 4
            }
          })
        } else if (page === 2) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 2,
              data: secondPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 3,
              last_page: 2,
              last_page_url: `${API_URL}/menus?page=2`,
              links: [
                {
                  url: `${API_URL}/menus?page=1`,
                  label: "&laquo; Previous",
                  active: false
                },
                {
                  url: `${API_URL}/menus?page=1`,
                  label: "1",
                  active: false
                },
                {
                  url: `${API_URL}/menus?page=2`,
                  label: "2",
                  active: true
                },
                {
                  url: null,
                  label: "Next &raquo;",
                  active: false
                }
              ],
              next_page_url: null,
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: `${API_URL}/menus?page=1`,
              to: 4,
              total: 4
            }
          })
        }
      })
    )

    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Wait for the first page to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the menus from the first page were loaded
    await waitFor(() => {
      expect(screen.getByText('Viernes')).toBeInTheDocument() // first menu
      expect(screen.getByText('Lunes')).toBeInTheDocument() // second menu
    })

    // Verify that menuService was called once for page 1
    expect(menuServiceSpy).toHaveBeenCalledTimes(1)
    expect(menuServiceSpy).toHaveBeenCalledWith({ page: 1 })

    // Wait a bit to ensure the state was updated
    await new Promise(resolve => setTimeout(resolve, 100))

    // Simulate scrolling down to trigger loading of the second page
    await act(async () => {
      // Simulate that the user scrolled near the end (80% of the document)
      simulateScroll(1200, 800, 1600) // scrollTop: 1200, clientHeight: 800, scrollHeight: 1600
      
      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'))
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 300))
    })

    // Wait for the second page to load
    await waitFor(() => {
      expect(menuServiceSpy).toHaveBeenCalledTimes(2)
    }, { timeout: 5000 })

    // Verify that the service was called for page 2
    expect(menuServiceSpy).toHaveBeenCalledWith({ page: 2 })

    // Verify that all menus are now displayed (first + second page)
    await waitFor(() => {
      expect(screen.getByText('Viernes')).toBeInTheDocument() // page 1
      expect(screen.getByText('Lunes')).toBeInTheDocument() // page 1
      expect(screen.getByText('Martes')).toBeInTheDocument() // page 2
      expect(screen.getByText('Miércoles')).toBeInTheDocument() // page 2
    })
  })

  it('should not request more pages when reaching the last page', async () => {
    // Spy on the list method of menuService
    const menuServiceSpy = vi.spyOn(menuService, 'list')

    // Configure handler to simulate that we're already on the last page (page 2)
    server.use(
      http.get(`${API_URL}/menus`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        
        if (page === 1) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 1,
              data: firstPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 1,
              last_page: 2,
              last_page_url: `${API_URL}/menus?page=2`,
              links: [],
              next_page_url: `${API_URL}/menus?page=2`,
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: null,
              to: 2,
              total: 4
            }
          })
        } else if (page === 2) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 2,
              data: secondPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 3,
              last_page: 2, // This is the last page
              last_page_url: `${API_URL}/menus?page=2`,
              links: [],
              next_page_url: null, // There is no next page
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: `${API_URL}/menus?page=1`,
              to: 4,
              total: 4
            }
          })
        }
      })
    )

    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Wait for the first page to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Simulate scroll to load the second page
    await act(async () => {
      simulateScroll(1200, 800, 1600)
      window.dispatchEvent(new Event('scroll'))
      await new Promise(resolve => setTimeout(resolve, 300))
    })

    // Wait for the second page to load
    await waitFor(() => {
      expect(menuServiceSpy).toHaveBeenCalledTimes(2)
    }, { timeout: 5000 })

    // Verify that all menus were loaded
    await waitFor(() => {
      expect(screen.getByText('Martes')).toBeInTheDocument()
      expect(screen.getByText('Miércoles')).toBeInTheDocument()
    })

    // Reset the spy to count only calls after reaching the last page
    menuServiceSpy.mockClear()

    // Simulate multiple scroll events after reaching the last page
    act(() => {
      simulateScroll(1400, 800, 1600) // Scroll even further down
      window.dispatchEvent(new Event('scroll'))
    })

    // Wait a moment for any possible calls
    await new Promise(resolve => setTimeout(resolve, 300))

    act(() => {
      simulateScroll(1500, 800, 1600) // Scroll to absolute end
      window.dispatchEvent(new Event('scroll'))
    })

    // Wait a moment more
    await new Promise(resolve => setTimeout(resolve, 300))

    // Verify that NO more calls were made to the service
    expect(menuServiceSpy).not.toHaveBeenCalled()
  })

  it('should reset state when navigating away and returning to Menus', async () => {
    // Spy on the list method of menuService
    const menuServiceSpy = vi.spyOn(menuService, 'list')

    // Wrapper component that controls internal navigation
    const NavigationTestWrapper = () => {
      const [currentRoute, setCurrentRoute] = React.useState(ROUTES.MENUS)
      
      // Expose the navigation function globally for the test
      React.useEffect(() => {
        (window as any).testNavigate = (route: string) => {
          setCurrentRoute(route)
        }
      }, [])

      return (
        <TestRouter>
          <GlobalProvider>
            <OrderProvider>
              <Routes>
                <Route path="*" element={
                  currentRoute === ROUTES.MENUS ? <Menus /> : <CategoriesProducts />
                } />
              </Routes>
            </OrderProvider>
          </GlobalProvider>
        </TestRouter>
      )
    }

    // Configure handlers for multiple pages and categories
    server.use(
      http.get(`${API_URL}/menus`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        
        if (page === 1) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 1,
              data: firstPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 1,
              last_page: 2,
              last_page_url: `${API_URL}/menus?page=2`,
              links: [],
              next_page_url: `${API_URL}/menus?page=2`,
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: null,
              to: 2,
              total: 4
            }
          })
        } else if (page === 2) {
          return HttpResponse.json({
            status: 'success',
            message: 'Active menus retrieved successfully',
            data: {
              current_page: 2,
              data: secondPageMenus,
              first_page_url: `${API_URL}/menus?page=1`,
              from: 3,
              last_page: 2,
              last_page_url: `${API_URL}/menus?page=2`,
              links: [],
              next_page_url: null,
              path: `${API_URL}/menus`,
              per_page: 15,
              prev_page_url: `${API_URL}/menus?page=1`,
              to: 4,
              total: 4
            }
          })
        }
      }),
      // Handler for categories - return empty list to show the message
      http.get(`${API_URL}/categories/:menuId`, () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Categories retrieved successfully',
          data: {
            current_page: 1,
            data: [],
            first_page_url: `${API_URL}/categories/15?page=1`,
            from: 1,
            last_page: 1,
            last_page_url: `${API_URL}/categories/15?page=1`,
            links: [],
            next_page_url: null,
            path: `${API_URL}/categories/15`,
            per_page: 5,
            prev_page_url: null,
            to: 0,
            total: 0
          }
        })
      })
    )

    // Step 1: Render the Menus component initially
    render(<NavigationTestWrapper />)

    // Wait for the first page to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the menus from the first page were loaded
    expect(screen.getByText('Viernes')).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()

    // Simulate scroll to load the second page
    await act(async () => {
      simulateScroll(1200, 800, 1600)
      window.dispatchEvent(new Event('scroll'))
      await new Promise(resolve => setTimeout(resolve, 300))
    })

    // Wait for the second page to load
    await waitFor(() => {
      expect(menuServiceSpy).toHaveBeenCalledTimes(2)
    }, { timeout: 5000 })

    // Verify that all menus were loaded (first + second page)
    await waitFor(() => {
      expect(screen.getByText('Martes')).toBeInTheDocument()
      expect(screen.getByText('Miércoles')).toBeInTheDocument()
    })

    // Step 2: Navigate to another page (Categories)
    act(() => {
      (window as any).testNavigate(ROUTES.GET_CATEGORY_ROUTE('15'))
    })

    // Verify that we're on the categories page (CategoriesProducts component shows message when no categories)
    await waitFor(() => {
      expect(screen.getByText(textMessages.NO_CATEGORIES_MESSAGE)).toBeInTheDocument()
    })

    // Reset the spy to count only the calls when we return
    menuServiceSpy.mockClear()

    // Step 3: Return to the Menus page
    act(() => {
      (window as any).testNavigate(ROUTES.MENUS)
    })

    // Verify that we return to the Menus page and it shows the spinner (initial state)
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Esperar a que se complete la nueva carga
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the state was reset correctly:
    // 1. ONE new call was made to the API (page 1 only)
    expect(menuServiceSpy).toHaveBeenCalledTimes(1)
    expect(menuServiceSpy).toHaveBeenCalledWith({ page: 1 })

    // 2. Only the menus from the first page are displayed (not those from the second)
    expect(screen.getByText('Viernes')).toBeInTheDocument() // page 1
    expect(screen.getByText('Lunes')).toBeInTheDocument() // page 1
    expect(screen.queryByText('Martes')).not.toBeInTheDocument() // page 2 - should not be there
    expect(screen.queryByText('Miércoles')).not.toBeInTheDocument() // page 2 - should not be there

    // 3. Verify that the state was reset by testing that infinite scroll works again
    // (esto implica que currentPage=1, lastPage=1, hasMore=false inicialmente)
    menuServiceSpy.mockClear()
    
    // Simulate scroll - should load page 2 again
    await act(async () => {
      simulateScroll(1200, 800, 1600)
      window.dispatchEvent(new Event('scroll'))
      await new Promise(resolve => setTimeout(resolve, 300))
    })

    // Verify that the call is made for page 2 again
    await waitFor(() => {
      expect(menuServiceSpy).toHaveBeenCalledTimes(1)
      expect(menuServiceSpy).toHaveBeenCalledWith({ page: 2 })
    }, { timeout: 5000 })
  })
})