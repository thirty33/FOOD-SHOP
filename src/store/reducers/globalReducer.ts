import { CART_ACTION_TYPES } from '../../config/constant';
import { type globalState, type Action } from '../../types/state';

const UPDATE_STATE_BY_ACTION = {

    [CART_ACTION_TYPES.SHOW_HEADER]: (state: globalState, action: Action) => {
        return {
            ...state,
            showHeader: (action.payload as Pick<globalState, 'showHeader'>).showHeader,
        };
    },
    [CART_ACTION_TYPES.APP_IS_LOADING]: (state: globalState, action: Action) => {
        return {
            ...state,
            isLoading: (action.payload as Pick<globalState, 'isLoading'>).isLoading,
        };
    },
    [CART_ACTION_TYPES.SET_TOKEN]: (state: globalState, action: Action) => {
        return {
            ...state,
            token: (action.payload as Pick<globalState, 'token'>).token,
        };
    },

}

export const globalReducer = (state: globalState, action: Action & { type: keyof typeof UPDATE_STATE_BY_ACTION }): globalState => {

  const { type } = action;
  const updateState = UPDATE_STATE_BY_ACTION[type];
  return updateState ? updateState(state, action) : state
  
};
