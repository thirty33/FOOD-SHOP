

import { CART_ACTION_TYPES } from "../config/constant";
import { MenuItem } from "./menus";
import { Category } from "./categories";
import { Product } from "./products";
import { OrderData } from "./order";
import { Permission, Role } from "./user";

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
    addProductToCart: (orderLines: Array<{id: string | number, quantity: number | string}>) => void;
    deleteItemFromCart: (id: string | number, quantity: number) => void;
    showSideCart: boolean;
    setShowSideCart: (value: boolean) => void;
    cartItemsCount: number;
    user: {
        role: Role;
        permission: Permission;
        master_user: boolean;
        nickname: string;
        name: string;
        branch_fantasy_name: string | null;
    };
    setUser: (role: Role, permission: Permission, master_user: boolean, nickname: string, name: string, branch_fantasy_name: string | null) => void;
    updateCurrentOrder: (orderLines: Array<{id: string | number, quantity: number | string, partiallyScheduled?: boolean }>) => void;
    updateOrderStatus: (status: string) => void;
    partiallyScheduleOrder: (status: string) => void;
    setCurrentOrder: (order: OrderData | null) => void;
    getOrders: () => void;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
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
    showSideCart: boolean;
    user: {
        role: Role;
        permission: Permission;
        master_user: boolean;
        nickname: string;
        name: string;
        branch_fantasy_name: string | null;
    }
    orders: OrderData[] | null;
    showModal: boolean;
    isPendingReload: boolean;
    recentOperation: boolean;
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
    | { type: typeof CART_ACTION_TYPES.SET_SHOW_CART, payload: Pick<globalState, 'showSideCart'> }
    | { type: typeof CART_ACTION_TYPES.SET_USER_INFO, payload: Pick<globalState, 'user'> }
    | { type: typeof CART_ACTION_TYPES.SET_ORDERS, payload: Pick<globalState, 'orders'> }
    | { type: typeof CART_ACTION_TYPES.SET_SHOW_MODAL, payload: Pick<globalState, 'showModal'> }
    | { type: typeof CART_ACTION_TYPES.SET_PENDING_RELOAD, payload: Pick<globalState, 'isPendingReload'> }
    | { type: typeof CART_ACTION_TYPES.SET_RECENT_OPERATION, payload: Pick<globalState, 'recentOperation'> }
    | { type: typeof CART_ACTION_TYPES.START_OPERATION, payload: Pick<globalState, 'isLoading' | 'isPendingReload' | 'recentOperation'> }
    | { type: typeof CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS, payload: Pick<globalState, 'isLoading' | 'isPendingReload' | 'recentOperation'> }