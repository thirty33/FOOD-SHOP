import { type globalState, type Action } from '../../types/state';
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
    }

}

export const menuReducer = (state: globalState, action: Action & { type: keyof typeof UPDATE_STATE_BY_ACTION }): globalState => {

    const { type } = action;
    const updateState = UPDATE_STATE_BY_ACTION[type];
    return updateState ? updateState(state, action) : state

};