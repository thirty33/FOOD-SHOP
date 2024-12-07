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
    }

}

export const menuReducer = (state: globalState, action: Action & { type: keyof typeof UPDATE_STATE_BY_ACTION }): globalState => {

    const { type } = action;
    const updateState = UPDATE_STATE_BY_ACTION[type];
    return updateState ? updateState(state, action) : state

};