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