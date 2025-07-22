import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './index'
import { TestRouter } from '../../tests/utils/testWrappers'
import { ROUTES } from '../../config/routes'
import { textMessages } from '../../config/textMessages'

// Mock all dependencies except navigation
const mockLogOut = vi.fn().mockResolvedValue(undefined)
const mockSetToken = vi.fn()
const mockSignOut = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    logOut: mockLogOut,
    setToken: mockSetToken,
    signOut: mockSignOut
  })
}))

vi.mock('../../hooks/useNotification', () => ({
  useNotification: () => ({
    enqueueSnackbar: vi.fn()
  })
}))

vi.mock('../../hooks/useCurrentOrder', () => ({
  useOrder: () => ({
    setShowSideCart: vi.fn(),
    showSideCart: false,
    cartItemsCount: 0,
    isAtCategoriesRoute: () => false
  })
}))

vi.mock('../../config/config', () => ({
  configuration: {
    company: {
      logo: '/mock-logo.png',
      name: 'Mock Company'
    }
  }
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Header Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogOut.mockClear()
    mockSetToken.mockClear()
    mockSignOut.mockClear()
    mockNavigate.mockClear()
  })

  it('should navigate to Menus route when clicking on Menus menu item', () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Find and click on the Menus menu item (desktop version - first one)
    const menusMenuItems = screen.getAllByRole('link', { name: textMessages.HEADER.MENUS })
    const desktopMenusMenuItem = menusMenuItems[0] // First one is desktop version
    expect(desktopMenusMenuItem).toBeInTheDocument()
    
    fireEvent.click(desktopMenusMenuItem)

    // Verify navigation to menus route
    expect(desktopMenusMenuItem.getAttribute('href')).toBe(ROUTES.MENUS)
  })

  it('should navigate to Orders route when clicking on Orders menu item', () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Find and click on the Orders menu item (desktop version - first one)
    const ordersMenuItems = screen.getAllByRole('link', { name: textMessages.HEADER.ORDERS })
    const desktopOrdersMenuItem = ordersMenuItems[0] // First one is desktop version
    expect(desktopOrdersMenuItem).toBeInTheDocument()
    
    fireEvent.click(desktopOrdersMenuItem)

    // Verify navigation to orders route
    expect(desktopOrdersMenuItem.getAttribute('href')).toBe(`/${ROUTES.GET_ORDERS_ROUTE}`)
  })

  it('should navigate to Menus route when clicking on Menus in mobile menu', () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Open mobile menu first
    const mobileMenuButton = screen.getByRole('button', { name: textMessages.HEADER.OPEN_MAIN_MENU_SR })
    fireEvent.click(mobileMenuButton)

    // Find all Menus links (desktop and mobile)
    const menusMenuItems = screen.getAllByRole('link', { name: textMessages.HEADER.MENUS })
    
    // The mobile menu item should be the second one (index 1)
    const mobilemenusMenuItem = menusMenuItems[1]
    expect(mobilemenusMenuItem).toBeInTheDocument()
    
    fireEvent.click(mobilemenusMenuItem)

    // Verify navigation to menus route
    expect(mobilemenusMenuItem.getAttribute('href')).toBe(ROUTES.MENUS)
  })

  it('should navigate to Orders route when clicking on Orders in mobile menu', () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Open mobile menu first
    const mobileMenuButton = screen.getByRole('button', { name: textMessages.HEADER.OPEN_MAIN_MENU_SR })
    fireEvent.click(mobileMenuButton)

    // Find all Orders links (desktop and mobile)
    const ordersMenuItems = screen.getAllByRole('link', { name: textMessages.HEADER.ORDERS })
    
    // The mobile menu item should be the second one (index 1)
    const mobileOrdersMenuItem = ordersMenuItems[1]
    expect(mobileOrdersMenuItem).toBeInTheDocument()
    
    fireEvent.click(mobileOrdersMenuItem)

    // Verify navigation to orders route
    expect(mobileOrdersMenuItem.getAttribute('href')).toBe(`/${ROUTES.GET_ORDERS_ROUTE}`)
  })

  it('should call navigate to login route when clicking Sign Out', async () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Find and click on the Sign Out menu item (desktop version - first one)
    const signOutMenuItems = screen.getAllByText(textMessages.HEADER.SIGN_OUT)
    const desktopSignOutMenuItem = signOutMenuItems[0] // First one is desktop version
    expect(desktopSignOutMenuItem).toBeInTheDocument()
    
    // Click and wait for async operations
    fireEvent.click(desktopSignOutMenuItem)
    
    // Wait for the async SignOut function to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify that auth functions were called
    expect(mockLogOut).toHaveBeenCalledTimes(1)
    expect(mockSetToken).toHaveBeenCalledWith(null)
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    
    // Verify navigation to login route was called
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN)
  })

  it('should call navigate to login route when clicking Sign Out in mobile menu', async () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Open mobile menu first
    const mobileMenuButton = screen.getByRole('button', { name: textMessages.HEADER.OPEN_MAIN_MENU_SR })
    fireEvent.click(mobileMenuButton)

    // Find all Sign Out elements (desktop and mobile)
    const signOutMenuItems = screen.getAllByText(textMessages.HEADER.SIGN_OUT)
    
    // The mobile menu item should be the second one (index 1)
    const mobileSignOutMenuItem = signOutMenuItems[1]
    expect(mobileSignOutMenuItem).toBeInTheDocument()
    
    // Click and wait for async operations
    fireEvent.click(mobileSignOutMenuItem)
    
    // Wait for the async SignOut function to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify that auth functions were called
    expect(mockLogOut).toHaveBeenCalledTimes(1)
    expect(mockSetToken).toHaveBeenCalledWith(null)
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    
    // Verify navigation to login route was called
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN)
  })

  it('should navigate to Menus route when clicking on the logo', () => {
    render(
      <TestRouter>
        <Header />
      </TestRouter>
    )

    // Find and click on the logo link
    const logoLink = screen.getByRole('link', { name: 'Mock Company' })
    expect(logoLink).toBeInTheDocument()
    
    fireEvent.click(logoLink)

    // Verify navigation to menus route
    expect(logoLink.getAttribute('href')).toBe(ROUTES.MENUS)
  })
})