// Objeto agrupado por subcategorías específicas: PLATO DE FONDO, PAN DE ACOMPAÑAMIENTO, ENTRADA
const groupedCategories = [
  // Grupo ENTRADA
  {
    id: 'entrada-group',
    order: 10,
    show_all_products: false,
    category_id: null,
    menu_id: 443,
    category: {
      id: null,
      name: 'ENTRADA',
      description: 'Grupo de entradas',
      products: [
        // Productos de SOPAS Y CREMAS VARIABLES PARA CALENTAR
        {
          id: 828,
          name: "ACM - CREMA DE VERDURAS CON POLLO 300 GR",
          description: "Sin descripción",
          price: "$0,00",
          image: null,
          category_id: 47,
          code: "ACM00000005",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1655,
              unit_price: "$400,00",
              unit_price_with_tax: "$476,00",
              unit_price_raw: 400,
              unit_price_with_tax_raw: 476
            }
          ],
          ingredients: [
            {
              descriptive_text: "-"
            }
          ]
        },
        // Productos de SOPAS Y CREMAS FIJAS PARA CALENTAR
        {
          id: 820,
          name: "ACM - CREMA DE ZAPALLO 300 GR",
          description: "DELEITATE CON ESTA EXQUISITA CREMA HECHA CON EL MAS RICO ZAPALLO NATURAL CON UNA TEXTURA QUE AMARAS.",
          price: "$0,00",
          image: null,
          category_id: 46,
          code: "ACM00000006",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1646,
              unit_price: "$400,00",
              unit_price_with_tax: "$476,00",
              unit_price_raw: 400,
              unit_price_with_tax_raw: 476
            }
          ],
          ingredients: [
            {
              descriptive_text: "ZAPALLO CAMOTE FRESCO"
            },
            {
              descriptive_text: "PIMENTON"
            },
            {
              descriptive_text: "APIO"
            },
            {
              descriptive_text: "ARROZ"
            },
            {
              descriptive_text: "PAPAS."
            }
          ]
        },
        // Productos de MINI ENSALADAS DE ACOMPAÑAMIENTO
        {
          id: 872,
          name: "ACM - MINI ENSALADA PEPINO ZANAHORIA",
          description: "UN ACOMPANAMIENTO PERFECTO PARA TU PLATO DE FONDO. UNA EXQUISITA MINI ENSALADA.",
          price: "$0,00",
          image: null,
          category_id: 53,
          code: "ACM00000053",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1668,
              unit_price: "$400,00",
              unit_price_with_tax: "$476,00",
              unit_price_raw: 400,
              unit_price_with_tax_raw: 476
            }
          ],
          ingredients: [
            {
              descriptive_text: "LECHUGA FRESCA"
            },
            {
              descriptive_text: "PEPINO"
            },
            {
              descriptive_text: "ZANAHORIA Y DRESSING LIMONETA."
            }
          ]
        },
        {
          id: 878,
          name: "ACM - SIN ENTRADA",
          description: "Sin descripción",
          price: "$0,00",
          image: null,
          category_id: 53,
          code: "ACM00000059",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1688,
              unit_price: "$400,00",
              unit_price_with_tax: "$476,00",
              unit_price_raw: 400,
              unit_price_with_tax_raw: 476
            }
          ],
          ingredients: [
            {
              descriptive_text: "-"
            }
          ]
        }
      ],
      category_lines: [
        {
          id: 321,
          category_id: 47,
          weekday: "Sábado",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el jueves 21 de agosto de 2025 a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: [
        {
          id: 16,
          name: "ENTRADA"
        }
      ]
    },
    menu: {
      id: 443,
      active: true,
      title: "clone 14",
      description: null,
      publication_date: "2025-08-23"
    },
    products: [] // Los productos están en category.products
  },
  
  // Grupo PLATO DE FONDO
  {
    id: 'plato-fondo-group',
    order: 40,
    show_all_products: false,
    category_id: null,
    menu_id: 443,
    category: {
      id: null,
      name: 'PLATO DE FONDO',
      description: 'Grupo de platos de fondo',
      products: [
        // Productos de PLATOS VARIABLES PARA CALENTAR
        {
          id: 196,
          name: "PPC - PECHUGA DE POLLO AL CURRY CON ARROZ ARABE",
          description: "Sin descripción",
          price: "$0,00",
          image: null,
          category_id: 40,
          code: "PPC00000164",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1967,
              unit_price: "$4.700,00",
              unit_price_with_tax: "$5.593,00",
              unit_price_raw: 4700,
              unit_price_with_tax_raw: 5593
            }
          ],
          ingredients: [
            {
              descriptive_text: "-"
            }
          ]
        },
        // Productos de ENSALADAS EXTRA PROTEINA
        {
          id: 309,
          name: "ENX - ENSALADA ATUN PASTA EXTRA PROTEINA",
          description: "DELICIOSA ENSALADA MEDITERRANEA CON PASTA Y ATUN. PERFECTA COMBINACION DE SABORES FRESCOS Y TEXTURAS CRUJIENTES.",
          price: "$0,00",
          image: null,
          category_id: 50,
          code: "ENX00000002",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1732,
              unit_price: "$4.700,00",
              unit_price_with_tax: "$5.593,00",
              unit_price_raw: 4700,
              unit_price_with_tax_raw: 5593
            }
          ],
          ingredients: [
            {
              descriptive_text: "LECHUGA FRESCA"
            },
            {
              descriptive_text: "MEZCLA DE ATUN PASTA"
            },
            {
              descriptive_text: "PASTA CON TOMATE DESHIDRATADO"
            },
            {
              descriptive_text: "HUEVO COCIDO"
            },
            {
              descriptive_text: "TOMATE CHERRY"
            },
            {
              descriptive_text: "PIMENTON JULIANA"
            },
            {
              descriptive_text: "CHOCLO COCIDO"
            },
            {
              descriptive_text: "CIBOULETTE"
            },
            {
              descriptive_text: "MANI TOSTADO"
            },
            {
              descriptive_text: "DRESSING LACTEO."
            }
          ]
        },
        {
          id: 312,
          name: "ENX - ENSALADA CESAR CON POLLO EXTRA PROTEINA",
          description: "UN CLASICO DE CLASICOS PARA DISFRUTAR DE UNA ENSALADA FRESCA Y UNICA CON MAYOR CANTIDAD DE POLLO PARA DISFRUTAR.",
          price: "$0,00",
          image: null,
          category_id: 50,
          code: "ENX00000005",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1726,
              unit_price: "$4.700,00",
              unit_price_with_tax: "$5.593,00",
              unit_price_raw: 4700,
              unit_price_with_tax_raw: 5593
            }
          ],
          ingredients: [
            {
              descriptive_text: "LECHUGA FRESCA"
            },
            {
              descriptive_text: "QUESO PARMESANO"
            },
            {
              descriptive_text: "POLLO ASADO LAMINADO"
            },
            {
              descriptive_text: "TOMATE CHERRY"
            },
            {
              descriptive_text: "CRUTONES EN CUPS Y DRESSING CESAR."
            }
          ]
        },
        {
          id: 324,
          name: "ENX - ENSALADA VEGANA CROQUETAS DE LENTEJAS EXTRA PROTEINA",
          description: "EXQUISITA ENSALADA PENSADA EN EL MUNDO VEGANO DONDE DISFRUTARAS DE UNAS RICAS CROQUETAS DE LENTEJAS CON VERDURAS CLASICAS.",
          price: "$0,00",
          image: null,
          category_id: 50,
          code: "ENX00000017",
          active: 1,
          measure_unit: "UND",
          price_list: null,
          stock: 0,
          weight: "0.00",
          allow_sales_without_stock: 1,
          price_list_lines: [
            {
              id: 1756,
              unit_price: "$4.700,00",
              unit_price_with_tax: "$5.593,00",
              unit_price_raw: 4700,
              unit_price_with_tax_raw: 5593
            }
          ],
          ingredients: [
            {
              descriptive_text: "LECHUGA FRESCA"
            },
            {
              descriptive_text: "TOMATE CHERRY"
            },
            {
              descriptive_text: "CROQUETA DE LENTEJA"
            },
            {
              descriptive_text: "PALTA LAMINADA"
            },
            {
              descriptive_text: "PIMENTON"
            },
            {
              descriptive_text: "ZAPALLO ITALIANO Y DRESSING LIMONETA CIBOULETTE."
            }
          ]
        }
      ],
      category_lines: [
        {
          id: 272,
          category_id: 40,
          weekday: "Sábado",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el jueves 21 de agosto de 2025 a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: [
        {
          id: 15,
          name: "PLATO DE FONDO"
        }
      ]
    },
    menu: {
      id: 443,
      active: true,
      title: "clone 14",
      description: null,
      publication_date: "2025-08-23"
    },
    products: [] // Los productos están en category.products
  },

  // Categorías sin subcategorías específicas permanecen igual
  {
    id: 3958,
    order: 260,
    show_all_products: false,
    category_id: 67,
    menu_id: 443,
    category: {
      id: 67,
      name: "POSTRES",
      description: "-",
      products: [],
      category_lines: [
        {
          id: 461,
          category_id: 67,
          weekday: "Sábado",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el jueves 21 de agosto de 2025 a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 443,
      active: true,
      title: "clone 14",
      description: null,
      publication_date: "2025-08-23"
    },
    products: [
      {
        id: 801,
        name: "PTR - BARRA DE CEREAL",
        description: "Sin descripción",
        price: "$0,00",
        image: null,
        category_id: 67,
        code: "PTR00000001",
        active: 1,
        measure_unit: "UND",
        price_list: null,
        stock: 0,
        weight: "0.00",
        allow_sales_without_stock: 1,
        price_list_lines: [
          {
            id: 1673,
            unit_price: "$250,00",
            unit_price_with_tax: "$297,50",
            unit_price_raw: 250,
            unit_price_with_tax_raw: 297.5
          }
        ],
        ingredients: [
          {
            descriptive_text: "-"
          }
        ]
      },
      // ... resto de productos de postres
    ]
  },

  // Categorías sin subcategorías específicas permanecen igual  
  {
    id: 3959,
    order: 270,
    show_all_products: false,
    category_id: 68,
    menu_id: 443,
    category: {
      id: 68,
      name: "BEBESTIBLES",
      description: "-",
      products: [],
      category_lines: [
        {
          id: 468,
          category_id: 68,
          weekday: "Sábado",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el jueves 21 de agosto de 2025 a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 443,
      active: true,
      title: "clone 14",
      description: null,
      publication_date: "2025-08-23"
    },
    products: [
      // ... productos de bebidas
    ]
  },

  {
    id: 3960,
    order: 280,
    show_all_products: false,
    category_id: 71,
    menu_id: 443,
    category: {
      id: 71,
      name: "EXTRAS",
      description: "-",
      products: [],
      category_lines: [
        {
          id: 489,
          category_id: 71,
          weekday: "Sábado",
          preparation_days: 2,
          maximum_order_time: "disponible hasta el jueves 21 de agosto de 2025 a las 18:00",
          active: true
        }
      ],
      category_user_lines: [],
      subcategories: []
    },
    menu: {
      id: 443,
      active: true,
      title: "clone 14",
      description: null,
      publication_date: "2025-08-23"
    },
    products: [
      // ... productos extras
    ]
  }
];