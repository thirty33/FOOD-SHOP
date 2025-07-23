import { http, HttpResponse } from 'msw'
import { Category } from '../types/categories'

// Get the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock data for first page of categories
const firstPageCategories: Category[] = [
  {
    id: 301,
    order: 10,
    show_all_products: true,
    category_id: 21,
    menu_id: 999, // Will be replaced dynamically
    category: {
      id: 21,
      name: "NUEVOS",
      description: "Primera categoría de la primera página",
      products: [
        {
          id: 101,
          name: "Producto 1 Página 1",
          description: "Descripción del producto 1",
          price: "$15.99",
          image: null,
          category_id: 21,
          code: "PROD101",
          active: 1,
          measure_unit: "UND",
          price_list: "1599.00",
          stock: 50,
          weight: "2.5",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 101,
              unit_price: "$15.99",
              unit_price_with_tax: "$19.03",
              unit_price_raw: 15.99,
              unit_price_with_tax_raw: 19.03
            }
          ],
          ingredients: [
            { descriptive_text: "Ingrediente A" },
            { descriptive_text: "Ingrediente B" }
          ]
        }
      ],
      category_lines: [
        {
          id: 201,
          category_id: 21,
          weekday: "Lunes",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el viernes a las 15:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 999, // Will be replaced dynamically
      active: true,
      title: "Menú Test Infinite Scroll",
      description: "Menú para probar scroll infinito",
      publication_date: "2025-07-25"
    },
    products: []
  },
  {
    id: 302,
    order: 20,
    show_all_products: true,
    category_id: 22,
    menu_id: 999, // Will be replaced dynamically
    category: {
      id: 22,
      name: "OFERTAS DE LA SEMANA",
      description: "Segunda categoría de la primera página",
      products: [
        {
          id: 102,
          name: "Producto 2 Página 1",
          description: "Descripción del producto 2",
          price: "$12.50",
          image: null,
          category_id: 22,
          code: "PROD102",
          active: 1,
          measure_unit: "KG",
          price_list: "1250.00",
          stock: 30,
          weight: "1.8",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 102,
              unit_price: "$12.50",
              unit_price_with_tax: "$14.88",
              unit_price_raw: 12.50,
              unit_price_with_tax_raw: 14.88
            }
          ],
          ingredients: [
            { descriptive_text: "Ingrediente C" },
            { descriptive_text: "Ingrediente D" }
          ]
        }
      ],
      category_lines: [
        {
          id: 202,
          category_id: 22,
          weekday: "Lunes",
          preparation_days: 1,
          maximum_order_time: "disponible hasta el jueves a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 999, // Will be replaced dynamically
      active: true,
      title: "Menú Test Infinite Scroll",
      description: "Menú para probar scroll infinito",
      publication_date: "2025-07-25"
    },
    products: []
  }
]

// Mock data for second page of categories
const secondPageCategories: Category[] = [
  {
    id: 303,
    order: 30,
    show_all_products: true,
    category_id: 23,
    menu_id: 999, // Will be replaced dynamically
    category: {
      id: 23,
      name: "POSTRES Y BEBIDAS",
      description: "Primera categoría de la segunda página",
      products: [
        {
          id: 103,
          name: "Producto 1 Página 2",
          description: "Descripción del producto 3",
          price: "$18.75",
          image: null,
          category_id: 23,
          code: "PROD103",
          active: 1,
          measure_unit: "GR",
          price_list: "1875.00",
          stock: 25,
          weight: "3.2",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 103,
              unit_price: "$18.75",
              unit_price_with_tax: "$22.31",
              unit_price_raw: 18.75,
              unit_price_with_tax_raw: 22.31
            }
          ],
          ingredients: [
            { descriptive_text: "Ingrediente E" },
            { descriptive_text: "Ingrediente F" }
          ]
        }
      ],
      category_lines: [
        {
          id: 203,
          category_id: 23,
          weekday: "Martes",
          preparation_days: 3,
          maximum_order_time: "disponible hasta el lunes a las 12:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 999, // Will be replaced dynamically
      active: true,
      title: "Menú Test Infinite Scroll",
      description: "Menú para probar scroll infinito",
      publication_date: "2025-07-25"
    },
    products: []
  }
]

// Helper function to update menu_id in categories
const updateMenuId = (categories: Category[], menuId: number): Category[] => {
  return categories.map(category => ({
    ...category,
    menu_id: menuId,
    menu: {
      ...category.menu,
      id: menuId
    }
  }))
}

export const infiniteScrollHandlers = [
  // Handler for infinite scroll categories testing
  http.get(`${API_URL}/categories/:menuId`, ({ request, params }) => {
    const { menuId } = params
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const menuIdNum = parseInt(menuId as string)
    
    // Only handle menuId 777 for infinite scroll testing
    if (menuId !== '777') {
      // Pass through to next handler by returning undefined
      return
    }
    
    if (page === 1) {
      const categoriesWithMenuId = updateMenuId(firstPageCategories, menuIdNum)
      
      return HttpResponse.json({
        status: 'success',
        message: 'Categories retrieved successfully',
        data: {
          current_page: 1,
          data: categoriesWithMenuId,
          first_page_url: `${API_URL}/categories/${menuId}?page=1`,
          from: 1,
          last_page: 2,
          last_page_url: `${API_URL}/categories/${menuId}?page=2`,
          links: [
            {
              url: null,
              label: "&laquo; Previous",
              active: false
            },
            {
              url: `${API_URL}/categories/${menuId}?page=1`,
              label: "1",
              active: true
            },
            {
              url: `${API_URL}/categories/${menuId}?page=2`,
              label: "2",
              active: false
            },
            {
              url: `${API_URL}/categories/${menuId}?page=2`,
              label: "Next &raquo;",
              active: false
            }
          ],
          next_page_url: `${API_URL}/categories/${menuId}?page=2`,
          path: `${API_URL}/categories/${menuId}`,
          per_page: 2,
          prev_page_url: null,
          to: 2,
          total: 3
        }
      })
    } else if (page === 2) {
      const categoriesWithMenuId = updateMenuId(secondPageCategories, menuIdNum)
      
      return HttpResponse.json({
        status: 'success',
        message: 'Categories retrieved successfully',
        data: {
          current_page: 2,
          data: categoriesWithMenuId,
          first_page_url: `${API_URL}/categories/${menuId}?page=1`,
          from: 3,
          last_page: 2,
          last_page_url: `${API_URL}/categories/${menuId}?page=2`,
          links: [
            {
              url: `${API_URL}/categories/${menuId}?page=1`,
              label: "&laquo; Previous",
              active: false
            },
            {
              url: `${API_URL}/categories/${menuId}?page=1`,
              label: "1",
              active: false
            },
            {
              url: `${API_URL}/categories/${menuId}?page=2`,
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
          path: `${API_URL}/categories/${menuId}`,
          per_page: 2,
          prev_page_url: `${API_URL}/categories/${menuId}?page=1`,
          to: 3,
          total: 3
        }
      })
    }
    
    // Default empty response for other pages
    return HttpResponse.json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: {
        current_page: page,
        data: [],
        first_page_url: `${API_URL}/categories/${menuId}?page=1`,
        from: 0,
        last_page: 2,
        last_page_url: `${API_URL}/categories/${menuId}?page=2`,
        links: [],
        next_page_url: null,
        path: `${API_URL}/categories/${menuId}`,
        per_page: 2,
        prev_page_url: null,
        to: 0,
        total: 3
      }
    })
  }),
  
  // Handler for orders to prevent warnings
  http.get(`${API_URL}/orders/get-order/:date`, () => {
    return HttpResponse.json({
      status: 'success',
      message: 'Order retrieved successfully',
      data: null
    })
  })
]