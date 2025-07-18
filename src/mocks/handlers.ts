import { http, HttpResponse } from 'msw'
import { Category, CategoryItemPagination } from '../types/categories'

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Mock data que simula la respuesta real de la API
const mockCategories: Category[] = [
  {
    id: 201,
    order: 10,
    show_all_products: true,
    category_id: 11,
    menu_id: 15,
    category: {
      id: 11,
      name: "NUEVOS",
      description: "-",
      products: [
        {
          id: 31,
          name: "NUEVOS Item 1",
          description: "Delicioso producto de nuevos preparado con ingredientes premium",
          price: "$102,03",
          image: null,
          category_id: 11,
          code: "PROD001",
          active: 1,
          measure_unit: "KG",
          price_list: "11896.00",
          stock: 992,
          weight: "4.12",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 33,
              unit_price: "$2.341,61",
              unit_price_with_tax: "$2.786,52",
              unit_price_raw: 2341.61,
              unit_price_with_tax_raw: 2786.5159
            }
          ],
          ingredients: [
            {
              descriptive_text: "Pescado"
            },
            {
              descriptive_text: "limón"
            },
            {
              descriptive_text: "hierbas"
            }
          ]
        },
        {
          id: 32,
          name: "NUEVOS Item 2",
          description: "Delicioso producto de nuevos preparado con ingredientes premium",
          price: "$105,34",
          image: null,
          category_id: 11,
          code: "PROD002",
          active: 1,
          measure_unit: "GR",
          price_list: "7647.00",
          stock: 15,
          weight: "8.75",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 34,
              unit_price: "$1.355,72",
              unit_price_with_tax: "$1.613,31",
              unit_price_raw: 1355.72,
              unit_price_with_tax_raw: 1613.3067999999998
            }
          ],
          ingredients: [
            {
              descriptive_text: "Pescado"
            },
            {
              descriptive_text: "limón"
            },
            {
              descriptive_text: "hierbas"
            }
          ]
        }
      ],
      category_lines: [
        {
          id: 71,
          category_id: 11,
          weekday: "Lunes",
          preparation_days: 3,
          maximum_order_time: "disponible hasta el viernes 18 de julio de 2025 a las 15:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 15,
      active: true,
      title: "Menú Lunes 005 - 21/07",
      description: "Opciones vegetarianas y veganas para una alimentación consciente.",
      publication_date: "2025-07-21"
    },
    products: []
  },
  {
    id: 202,
    order: 20,
    show_all_products: true,
    category_id: 12,
    menu_id: 15,
    category: {
      id: 12,
      name: "OFERTAS DE LA SEMANA",
      description: "-",
      products: [
        {
          id: 35,
          name: "OFERTAS DE LA SEMANA Item 2",
          description: "Delicioso producto de ofertas de la semana preparado con ingredientes premium",
          price: "$64,18",
          image: null,
          category_id: 12,
          code: "PROD005",
          active: 1,
          measure_unit: "UND",
          price_list: "2575.00",
          stock: 938,
          weight: "9.57",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 31,
              unit_price: "$2.560,57",
              unit_price_with_tax: "$3.047,08",
              unit_price_raw: 2560.57,
              unit_price_with_tax_raw: 3047.0782999999997
            }
          ],
          ingredients: [
            {
              descriptive_text: "Pasta"
            },
            {
              descriptive_text: "salsa"
            },
            {
              descriptive_text: "queso"
            }
          ]
        }
      ],
      category_lines: [
        {
          id: 78,
          category_id: 12,
          weekday: "Lunes",
          preparation_days: 3,
          maximum_order_time: "disponible hasta el viernes 18 de julio de 2025 a las 15:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 15,
      active: true,
      title: "Menú Lunes 005 - 21/07",
      description: "Opciones vegetarianas y veganas para una alimentación consciente.",
      publication_date: "2025-07-21"
    },
    products: []
  }
]

// Mock data para el caso sin categorías
const emptyCategoriesResponse: CategoryItemPagination = {
  current_page: 1,
  data: [],
  first_page_url: `${API_URL}/categories/999?page=1`,
  from: 1,
  last_page: 1,
  last_page_url: `${API_URL}/categories/999?page=1`,
  links: [
    {
      url: null,
      label: "&laquo; Previous",
      active: false
    },
    {
      url: `${API_URL}/categories/999?page=1`,
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
  path: `${API_URL}/categories/999`,
  per_page: 5,
  prev_page_url: null,
  to: 0,
  total: 0
}

// Respuesta exitosa con categorías
const successCategoriesResponse: CategoryItemPagination = {
  current_page: 1,
  data: mockCategories,
  first_page_url: `${API_URL}/categories/15?page=1`,
  from: 1,
  last_page: 1,
  last_page_url: `${API_URL}/categories/15?page=1`,
  links: [
    {
      url: null,
      label: "&laquo; Previous",
      active: false
    },
    {
      url: `${API_URL}/categories/15?page=1`,
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
  path: `${API_URL}/categories/15`,
  per_page: 5,
  prev_page_url: null,
  to: 2,
  total: 2
}

export const handlers = [
  // Handler para obtener categorías - caso exitoso
  http.get(`${API_URL}/categories/:menuId`, ({ params }) => {
    const { menuId } = params
    
    // Simular diferentes respuestas según el menuId
    if (menuId === '999') {
      // Caso sin categorías
      return HttpResponse.json({
        status: 'success',
        message: 'Categories retrieved successfully',
        data: emptyCategoriesResponse
      })
    }
    
    if (menuId === '500') {
      // Caso de error del servidor
      return HttpResponse.json(
        { 
          status: 'error', 
          message: 'Internal server error' 
        },
        { status: 500 }
      )
    }
    
    // Caso exitoso por defecto
    return HttpResponse.json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: successCategoriesResponse
    })
  })
]