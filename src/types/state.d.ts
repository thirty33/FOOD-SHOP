

import { CART_ACTION_TYPES } from "../config/constant";
import { MenuItem } from "./menus";
import { Category } from "./categories";
import { Product } from "./products";
import { OrderData } from "./order";

export interface state {
    showHeader: boolean;
    setShowHeader: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    menuItems: MenuItem[];
    currentPage: number;
    hasMore: boolean;
    categories: Category[];
    selectedMenu: MenuItem | null;
    setMenus: (menuItems: MenuItem[]) => void;
    setCategories: (categories: Category[]) => void;
    setHasMore: (currentPage: number, lastPage: number) => void;
    loadMoreShorts: () => void;
    setSelectedMenu: (selectedMenu: MenuItem | null) => void;
    setCurrenPage: (page: number) => void;
    signOut: () => void;
    currentOrder: OrderData | null;
    addProductToCart: (id: string | number, quantity: number) => void;
    deleteItemFromCart: (id: string | number, quantity: number) => void;
}   

export interface GlobalProviderProps {
    children: React.ReactNode;
}

export interface globalState {
    showHeader: boolean;
    isLoading: boolean;
    token: string | null;
    menuItems: MenuItem[];
    categories: Category[];
    products: Product[];
    currentPage: number;
    hasMore: boolean;
    selectedMenu: MenuItem | null;
    currentOrder: OrderData | null;
}

export type signOutState = Pick<globalState, 
    'token' | 'menuItems' | 'categories' | 'currentPage' | 'hasMore' | 'selectedMenu'
>

export type Action = 
    | { type: typeof CART_ACTION_TYPES.SHOW_HEADER, payload: Pick<globalState, 'showHeader'> }
    | { type: typeof CART_ACTION_TYPES.APP_IS_LOADING, payload: Pick<globalState, 'isLoading'> }
    | { type: typeof CART_ACTION_TYPES.SET_TOKEN, payload: Pick<globalState, 'token'> }
    | { type: typeof CART_ACTION_TYPES.SET_MENUS, payload: Pick<globalState, 'menuItems'> }
    | { type: typeof CART_ACTION_TYPES.SET_CATEGORIES, payload: Pick<globalState, 'categories'> }
    | { type: typeof CART_ACTION_TYPES.SET_PRODUCTS, payload: Pick<globalState, 'products'> }
    | { type: typeof CART_ACTION_TYPES.SET_CURRENT_PAGE, payload: Pick<globalState, 'currentPage'> }
    | { type: typeof CART_ACTION_TYPES.SET_HAS_MORE, payload: Pick<globalState, 'hasMore'>}
    | { type: typeof CART_ACTION_TYPES.SET_SELECTED_MENU, payload: Pick<globalState, 'selectedMenu'>}
    | { type: typeof CART_ACTION_TYPES.SIGN_OUT, payload: signOutState }
    | { type: typeof CART_ACTION_TYPES.SET_CURRENT_ORDER, payload: Pick<globalState, 'currentOrder'> }