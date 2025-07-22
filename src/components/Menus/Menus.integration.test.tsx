import { TestRouter } from '../../tests/utils/testWrappers'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { Menus } from './index'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { ROUTES } from '../../config/routes'

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

describe('Menus Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
  })

  it('should render menu cards when menu items are provided', async () => {
    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Verify that it shows the loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Wait for menus to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that formatted weekdays are displayed
    // The API returns dates that the service transforms to Spanish days
    expect(screen.getByText('Viernes')).toBeInTheDocument() // 2025-07-25
    expect(screen.getByText('Lunes')).toBeInTheDocument()   // 2025-08-04
    expect(screen.getByText('Martes')).toBeInTheDocument()  // 2025-08-12

    // Verify that day numbers are displayed
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()

    // Verify that months are displayed
    expect(screen.getByText(/de julio/)).toBeInTheDocument()
    expect(screen.getAllByText(/de agosto/)).toHaveLength(2) // Two menus in August

    // Verify that the "no menus available" message is NOT displayed
    expect(screen.queryByText(/No hay menús disponibles/)).not.toBeInTheDocument()
  })

  it('should navigate to categories when a menu card is clicked', async () => {
    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Wait for menus to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Click on the first menu (Friday 25)
    const firstMenuCard = screen.getByText('25').closest('div[class*="cursor-pointer"]')
    fireEvent.click(firstMenuCard!)

    // Verify that it navigated to the correct route with menuId and date
    expect(mockNavigate).toHaveBeenCalledWith('menu/368/categories?date=2025-07-25')
  })

  it('should display "no menus available" message when no menus are available', async () => {
    // Override the handler to return an empty list
    server.use(
      http.get(`${API_URL}/menus`, () => {
        return HttpResponse.json({
          status: 'success',
          message: 'Active menus retrieved successfully',
          data: {
            current_page: 1,
            data: [],
            first_page_url: `${API_URL}/menus?page=1`,
            from: 1,
            last_page: 1,
            last_page_url: `${API_URL}/menus?page=1`,
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
                url: null,
                label: "Next &raquo;",
                active: false
              }
            ],
            next_page_url: null,
            path: `${API_URL}/menus`,
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
        <Menus />
      </TestWrapper>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the no menus available message is displayed
    expect(screen.getByText(/¡ No hay menús disponibles !/)).toBeInTheDocument()
    expect(screen.getByText(/para el día de hoy/)).toBeInTheDocument()

    // Verify that NO menu cards are displayed
    expect(screen.queryByText('Viernes')).not.toBeInTheDocument()
    expect(screen.queryByText('Lunes')).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Mock to capture errors in the console
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Override the handler to simulate a server error
    server.use(
      http.get(`${API_URL}/menus`, () => {
        return HttpResponse.json(
          { 
            status: 'error', 
            message: 'Internal server error' 
          },
          { status: 500 }
        )
      })
    )

    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // When there's an error, it should display the no menus available message
    expect(screen.getByText(/¡ No hay menús disponibles !/)).toBeInTheDocument()
    expect(screen.getByText(/para el día de hoy/)).toBeInTheDocument()

    // Verify that the error was logged
    expect(consoleSpy).toHaveBeenCalled()

    // Clean up the spy
    consoleSpy.mockRestore()
  })

  it('should display loading spinner while fetching data', () => {
    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Verify that the loading spinner is displayed
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner.querySelector('[class*="animate-spin"]')).toBeInTheDocument()
  })

  it('should format dates correctly in Spanish', async () => {
    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that dates are formatted correctly
    // The service transforms dates using formatDate
    expect(screen.getAllByText('2025')).toHaveLength(3) // 3 menus, all in 2025
    expect(screen.getByText('Viernes')).toBeInTheDocument() // Day of the week
    expect(screen.getByText('25')).toBeInTheDocument() // Day number
    expect(screen.getByText(/de julio/)).toBeInTheDocument() // Mes
  })

  it('should handle menu selection correctly', async () => {
    render(
      <TestWrapper>
        <Menus />
      </TestWrapper>
    )

    // Wait for menus to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Click on the second menu (Monday 4)
    const secondMenuCard = screen.getByText('4').closest('div[class*="cursor-pointer"]')
    fireEvent.click(secondMenuCard!)

    // Verify that it navigated to the correct route
    expect(mockNavigate).toHaveBeenCalledWith('menu/374/categories?date=2025-08-04')
  })

  it('should render Menus component when accessing ROUTES.MENUS path', async () => {
    // Specific wrapper component for testing the route
    const RouteTestWrapper = ({ children }: { children: React.ReactNode }) => {
      return (
        <TestRouter initialEntries={[ROUTES.MENUS]}>
          <GlobalProvider>
            <OrderProvider>
              <Routes>
                <Route path={ROUTES.MENUS} element={children} />
              </Routes>
            </OrderProvider>
          </GlobalProvider>
        </TestRouter>
      )
    }

    render(
      <RouteTestWrapper>
        <Menus />
      </RouteTestWrapper>
    )

    // Verify that it shows the loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Wait for menus to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the Menus component renders correctly on the ROUTES.MENUS route
    // Verifying specific elements of the Menus component
    expect(screen.getByText('Viernes')).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    
    // Verify that day numbers are displayed
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()

    // Verify that menu cards are clickable
    const menuCards = screen.getAllByText(/2025/)
    expect(menuCards).toHaveLength(3) // 3 menus in 2025
    
    // Verify that each card has the pointer cursor
    const firstMenuCard = screen.getByText('25').closest('div[class*="cursor-pointer"]')
    expect(firstMenuCard).toBeInTheDocument()
  })

  it('should navigate to CATEGORY_ROUTE when clicking on a MenuCard', async () => {
    // Component wrapper specific for testing navigation to category route
    const NavigationTestWrapper = ({ children }: { children: React.ReactNode }) => {
      return (
        <TestRouter initialEntries={[ROUTES.MENUS]}>
          <GlobalProvider>
            <OrderProvider>
              <Routes>
                <Route path={ROUTES.MENUS} element={children} />
                <Route path={`/${ROUTES.CATEGORY_ROUTE}`} element={<div data-testid="category-page">Categories Page</div>} />
              </Routes>
            </OrderProvider>
          </GlobalProvider>
        </TestRouter>
      )
    }

    render(
      <NavigationTestWrapper>
        <Menus />
      </NavigationTestWrapper>
    )

    // Wait for menus to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verify that the menu cards are rendered
    expect(screen.getByText('Viernes')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()

    // Find and click on the first menu card (Friday 25)
    const firstMenuCard = screen.getByText('25').closest('div[class*="cursor-pointer"]')
    expect(firstMenuCard).toBeInTheDocument()
    
    fireEvent.click(firstMenuCard!)

    // Verify that navigation occurred to the category route
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.GET_CATEGORY_ROUTE(368)}?date=2025-07-25`)
  })
})