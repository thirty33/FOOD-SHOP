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
    SET_SHOW_MODAL: 'SET_SHOW_MODAL',
    SET_PENDING_RELOAD: 'SET_PENDING_RELOAD',
    SET_RECENT_OPERATION: 'SET_RECENT_OPERATION',
    START_OPERATION: 'START_OPERATION',
    CLEAR_OPERATION_FLAGS: 'CLEAR_OPERATION_FLAGS',
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

export const GROUPING_SUBCATEGORIES = {
    MAIN_COURSE: 'PLATO DE FONDO',
    BREAD: 'PAN DE ACOMPAÑAMIENTO',
    APPETIZER: 'ENTRADA'
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
    PROCESSED: 'bg-green-50',
    CANCELED: 'bg-red-500',
    PARTIALLY_SCHEDULED: 'bg-gray-state',
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
    USER_SEARCH: 'user_search',
    BRANCH_SEARCH: 'branch_search',
}

export const CHECKOUT_SIDE_MENU_CLASS = "checkout-side-menu";

// Text truncation constants
export const TRUNCATE_LENGTHS = {
  CATEGORY_NAME: 18,     // For category names in CategoriesProducts
  PRODUCT_NAME: 12,      // For product names in OrderSummary and OrderLines
  INGREDIENTS: 20,       // For ingredients in OrderSummary
  CART_NAME: 17,         // For names in Cart component
  ORDER_STATUS: 12,      // For order status in OrderLines
} as const;