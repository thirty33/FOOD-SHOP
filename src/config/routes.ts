
export const ROUTES = {
    LOGIN: '/login',
    MENUS: '/',
    CATEGORY_ROUTE: `menu/:menuId/categories`,
    GET_CATEGORY_ROUTE: (menuId: number | string) => `menu/${menuId}/categories`,
    PRODUCTS_ROUTE: `menu/:menuId/category/:categoryId/products`,
    GET_PRODUCTS_ROUTE: (menuId: number | string, categoryId: number | string) => `menu/${menuId}/category/${categoryId}/products`,
    PRODUCT_DETAIL_ROUTE: `product/:productId`,
    GET_PRODUCT_DETAIL_ROUTE: (productId: number | string) => `product/${productId}`,
    CART_ROUTE: 'cart',
    CHECKOUT_ROUTE: 'checkout',
    ORDER_SUMMARY_ROUTE: 'order-detail/:orderId',
    GET_ORDER_SUMMARY_ROUTE: (orderId: number | string) => `order-detail/${orderId}`,
    GET_ORDERS_ROUTE: 'orders'
}

export const API_ROUTES = {
    auth: {
        base: 'auth',
        paths:
        {
            login: 'login',
            logout: 'logout',
        }
    },
    menus: {
        base: 'menus',
        paths: {
            list: '',
        }
    },
    categories: {
        base: 'categories',
        paths: {
            list: '',
        }
    },
    products: {
        base: 'products',
        paths: {
            list: '',
        }
    },
    orders: {
        base: 'orders',
        paths: {
            getItem: 'get-order',
            getItemById: 'get-order-by-id',
            createOrUpdateOrder: 'create-or-update-order',
            deleteOrderLine: 'delete-order-items',
            updateOrderStatus: 'update-order-status',
            partiallyScheduleOrder: 'partially-schedule-order',
            getOrders: 'get-orders',
        }
    },
}