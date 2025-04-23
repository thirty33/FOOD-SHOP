export const CART_ACTION_TYPES = {
    SHOW_HEADER: 'SHOW_HEADER',
    APP_IS_LOADING: 'APP_IS_LOADING',
    SET_TOKEN: 'SET_TOKEN',
    SET_MENUS: 'SET_MENUS',
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_PRODUCTS: 'SET_PRODUCTS',
    SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
    SET_HAS_MORE: 'SET_HAS_MORE',
    SET_SELECTED_MENU: 'SET_SELECTED_MENU',
    SIGN_OUT: 'SIGN_OUT',
    SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
    SET_SHOW_CART: 'SET_SHOW_CART',
    SET_USER_INFO: 'SET_USER_INFO',
    SET_ORDERS: 'SET_ORDERS',
} as const

export const ROLES_TYPES = {
    ADMIN: 'Admin',
    CAFE: 'Café',
    CONVENIO: 'Convenio',
    NONE: null
} as const

export const PERMISSION_TYPES = {
    CONSOLIDADO: 'Consolidado',
    INDIVIDUAL: 'Individual',
    NONE: null
} as const

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSED: 'PROCESSED',
    CANCELED: 'CANCELED',
    PARTIALLY_SCHEDULED: 'PARTIALLY_SCHEDULED',
} as const

export const ORDER_STATUS_TEXT = {
    PENDING: 'Pendiente',
    PROCESSED: 'Procesada',
    CANCELED: 'Cancelada',
    PARTIALLY_SCHEDULED: 'Parcialmente agendada',
} as const

export const ORDER_STATUS_COLOR = {
    PENDING: 'bg-yellow-500',
    PROCESSED: 'bg-green-500',
    CANCELED: 'bg-red-500',
    PARTIALLY_SCHEDULED: 'bg-blue-500',
} as const

export const ORDER_FILTERS_DATES_VALUES = {
    THIS_WEEK: 'this_week',
    THIS_MONTH: 'this_month',
    LAST_3_MONTHS: 'last_3_months',
    LAST_6_MONTHS: 'last_6_months',
    THIS_YEAR: 'this_year',
} as const

export const ORDER_FILTER_DATES_TEXT = {
    THIS_WEEK: 'Esta semana',
    THIS_MONTH: 'Este mes',
    LAST_3_MONTHS: 'Últimos 3 meses',
    LAST_6_MONTHS: 'Últimos 6 meses',
    THIS_YEAR: 'Este año',
} as const

export const ORDERS_QUERY_PARAMS = {
    ORDER_STATUS: 'order_status',
    TIME_PERIOD: 'time_period',
}