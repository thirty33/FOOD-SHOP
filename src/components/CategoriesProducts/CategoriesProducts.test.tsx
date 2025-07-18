import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { CategoriesProducts } from './index'
import { GlobalProvider } from '../../context/globalContext'
import { OrderProvider } from '../../context/orderContext'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { textMessages } from '../../config/textMessages'

// Obtener la URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock de componentes pesados que no necesitamos para este test
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

// Mock de hooks que no queremos probar directamente
vi.mock('../../hooks/useScrollToClose', () => ({
  useScrollToClose: () => {}
}))

vi.mock('../../hooks/useScrollToTop', () => ({
  useScrollToTop: () => ({
    isVisible: false,
    scrollToTop: vi.fn()
  })
}))

// Mock del contexto de autenticación
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

// Componente wrapper para providers
const TestWrapper = ({ children, menuId = '15' }: { children: React.ReactNode; menuId?: string }) => {
  return (
    <MemoryRouter initialEntries={[`/menu/${menuId}/categories`]}>
      <SnackbarProvider>
        <GlobalProvider>
          <OrderProvider>
            <Routes>
              <Route path="/menu/:menuId/categories" element={children} />
            </Routes>
          </OrderProvider>
        </GlobalProvider>
      </SnackbarProvider>
    </MemoryRouter>
  )
}

describe('CategoriesProducts Component', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks()
  })

  it('should render categories and products successfully', async () => {
    render(
      <TestWrapper>
        <CategoriesProducts />
      </TestWrapper>
    )

    // Verificar que muestra el spinner de carga inicialmente
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Esperar a que se carguen las categorías
    await waitFor(() => {
      expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    })

    // Verificar que se muestran las categorías
    expect(screen.getByText('NUEVOS')).toBeInTheDocument()
    // Buscar específicamente el h2 con el texto truncado de la categoría (nivel 2)
    expect(screen.getByRole('heading', { level: 2, name: /OFERTAS DE LA SEMA/ })).toBeInTheDocument()

    // Verificar que se muestran los horarios (texto real de la API) - hay 2 categorías con el mismo horario
    expect(screen.getAllByText('disponible hasta el viernes 18 de julio de 2025 a las 15:00')).toHaveLength(2)

    // Verificar que se renderizan los productos
    expect(screen.getByText('NUEVOS Item 1')).toBeInTheDocument()
    expect(screen.getByText('NUEVOS Item 2')).toBeInTheDocument()
    expect(screen.getByText('OFERTAS DE LA SEMANA Item 2')).toBeInTheDocument()

    // Verificar que NO se muestra el mensaje de "no hay categorías"
    expect(screen.queryByText(textMessages.NO_CATEGORIES_MESSAGE)).not.toBeInTheDocument()

    // Verificar que ya NO se muestra el spinner
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should display "no categories" message when no categories are available', async () => {
    render(
      <TestWrapper menuId="999">
        <CategoriesProducts />
      </TestWrapper>
    )

    // Esperar a que termine la carga
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verificar que se muestra el mensaje de no categorías disponibles
    expect(screen.getByText(textMessages.NO_CATEGORIES_MESSAGE)).toBeInTheDocument()

    // Verificar que NO se muestran categorías
    expect(screen.queryByText('NUEVOS')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /OFERTAS DE LA SEMA/ })).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Mock para capturar errores en el snackbar
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <TestWrapper menuId="500">
        <CategoriesProducts />
      </TestWrapper>
    )

    // Esperar a que termine la carga (debería fallar)
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    // Verificar que se muestra el mensaje de no categorías cuando hay error
    expect(screen.getByText(textMessages.NO_CATEGORIES_MESSAGE)).toBeInTheDocument()

    // Limpiar el spy
    consoleSpy.mockRestore()
  })

  it('should display loading spinner while fetching data', () => {
    // Override el handler para hacer que la respuesta sea más lenta
    server.use(
      http.get(`${API_URL}/categories/:menuId`, async () => {
        // Delay artificial para probar el estado de carga
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

    // Verificar que se muestra el spinner de carga
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should truncate long category names', async () => {
    // Override con un nombre muy largo
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
      // El texto debería estar truncado (no debería mostrar el nombre completo)
      expect(screen.queryByText(longCategoryName)).not.toBeInTheDocument()
      // Pero debería mostrar una versión truncada (18 caracteres + "...")
      expect(screen.getByText('Este es un nombre ...')).toBeInTheDocument()
    })
  })
})