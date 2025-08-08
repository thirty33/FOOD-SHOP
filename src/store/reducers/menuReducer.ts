import { type globalState, type Action, signOutState } from '../../types/state';
import { CART_ACTION_TYPES } from '../../config/constant';

const UPDATE_STATE_BY_ACTION = {
    [CART_ACTION_TYPES.APP_IS_LOADING]: (state: globalState, action: Action) => {
        return {
            ...state,
            isLoading: (action.payload as Pick<globalState, 'isLoading'>).isLoading,
        };
    },

    [CART_ACTION_TYPES.SET_MENUS]: (state: globalState, action: Action) => {
        return {
            ...state,
            menuItems: (action.payload as Pick<globalState, 'menuItems'>).menuItems,
        };
    },

    [CART_ACTION_TYPES.SET_CATEGORIES]: (state: globalState, action: Action) => {
        return {
            ...state,
            categories: (action.payload as Pick<globalState, 'categories'>).categories,
        };
    },

    [CART_ACTION_TYPES.SET_PRODUCTS]: (state: globalState, action: Action) => {
        return {
            ...state,
            products: (action.payload as Pick<globalState, 'products'>).products,
        };
    },

    [CART_ACTION_TYPES.SET_CURRENT_PAGE]: (state: globalState, action: Action) => {
        return {
            ...state,
            currentPage: (action.payload as Pick<globalState, 'currentPage'>).currentPage,
        };
    },
    
    [CART_ACTION_TYPES.SET_HAS_MORE]: (state: globalState, action: Action) => {
        return {
            ...state,
            hasMore: (action.payload as Pick<globalState, 'hasMore'>).hasMore,
        };
    },
    [CART_ACTION_TYPES.SHOW_HEADER]: (state: globalState, action: Action) => {
        return {
            ...state,
            showHeader: (action.payload as Pick<globalState, 'showHeader'>).showHeader,
        };
    },

    [CART_ACTION_TYPES.SET_TOKEN]: (state: globalState, action: Action) => {
        return {
            ...state,
            token: (action.payload as Pick<globalState, 'token'>).token,
        };
    },
    [CART_ACTION_TYPES.SET_SELECTED_MENU]: (state: globalState, action: Action) => {
        return {
            ...state,
            selectedMenu: (action.payload as Pick<globalState, 'selectedMenu'>).selectedMenu,
        };
    },
    [CART_ACTION_TYPES.SIGN_OUT]: (state: globalState, action: Action) => {

        const payload = (action.payload as signOutState);
        return {
            ...state,
            ...payload,
        };
    },
    [CART_ACTION_TYPES.SET_CURRENT_ORDER]: (state: globalState, action: Action) => {
        return {
            ...state,
            currentOrder: (action.payload as Pick<globalState, 'currentOrder'>).currentOrder,
        };
    },
    [CART_ACTION_TYPES.SET_SHOW_CART]: (state: globalState, action: Action) => {
        return {
            ...state,
            showSideCart: (action.payload as Pick<globalState, 'showSideCart'>).showSideCart,
        };
    },
    [CART_ACTION_TYPES.SET_USER_INFO]: (state: globalState, action: Action) => {
        return {
            ...state,
            user: (action.payload as Pick<globalState, 'user'>).user,
        };
    },
    [CART_ACTION_TYPES.SET_ORDERS]:  (state: globalState, action: Action) => {
        return {
            ...state,
            orders: (action.payload as Pick<globalState, 'orders'>).orders,
        };
    },
    [CART_ACTION_TYPES.SET_SHOW_MODAL]: (state: globalState, action: Action) => {
        return {
            ...state,
            showModal: (action.payload as Pick<globalState, 'showModal'>).showModal,
        };
    },
    [CART_ACTION_TYPES.SET_PENDING_RELOAD]: (state: globalState, action: Action) => {
        return {
            ...state,
            isPendingReload: (action.payload as Pick<globalState, 'isPendingReload'>).isPendingReload,
        };
    },
    [CART_ACTION_TYPES.SET_RECENT_OPERATION]: (state: globalState, action: Action) => {
        return {
            ...state,
            recentOperation: (action.payload as Pick<globalState, 'recentOperation'>).recentOperation,
        };
    },
    [CART_ACTION_TYPES.START_OPERATION]: (state: globalState, action: Action) => {
        const payload = action.payload as Pick<globalState, 'isLoading' | 'isPendingReload' | 'recentOperation'>;
        return {
            ...state,
            isLoading: payload.isLoading,
            isPendingReload: payload.isPendingReload,
            recentOperation: payload.recentOperation,
        };
    },
    [CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS]: (state: globalState, action: Action) => {
        const payload = action.payload as Pick<globalState, 'isLoading' | 'isPendingReload' | 'recentOperation'>;
        return {
            ...state,
            isLoading: payload.isLoading,
            isPendingReload: payload.isPendingReload,
            recentOperation: payload.recentOperation,
        };
    },
}

export const menuReducer = (state: globalState, action: Action & { type: keyof typeof UPDATE_STATE_BY_ACTION }): globalState => {

    const { type } = action;
    const updateState = UPDATE_STATE_BY_ACTION[type];
    return updateState ? updateState(state, action) : state

};