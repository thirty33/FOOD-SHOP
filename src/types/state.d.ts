

import { CART_ACTION_TYPES } from "../config/constant";
import { MenuItem } from "./menus";
import { Category } from "./categories";
import { Product } from "./products";

export interface state {
    showHeader: boolean;
    setShowHeader: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void,
    token: string | null;
    setToken: (token: string | null) => void,
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
}

export type Action = 
    | { type: typeof CART_ACTION_TYPES.SHOW_HEADER, payload: Pick<globalState, 'showHeader'> }
    | { type: typeof CART_ACTION_TYPES.APP_IS_LOADING, payload: Pick<globalState, 'isLoading'> }
    | { type: typeof CART_ACTION_TYPES.SET_TOKEN, payload: Pick<globalState, 'token'> }
    | { type: typeof CART_ACTION_TYPES.SET_MENUS, payload: Pick<globalState, 'menuItems'> }
    | { type: typeof CART_ACTION_TYPES.SET_CATEGORIES, payload: Pick<globalState, 'categories'> }
    | { type: typeof CART_ACTION_TYPES.SET_PRODUCTS, payload: Pick<globalState, 'products'> }