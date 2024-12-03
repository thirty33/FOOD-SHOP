import { createContext, useReducer } from "react";
import { CART_ACTION_TYPES } from "../config/constant";
import { type state, type GlobalProviderProps } from "../types/state";
import { globalReducer } from "../store/reducers/globalReducer";
import { InitialState } from "../store/state/initialState";
import { useLocalStorage } from '../hooks/useLocalStorage';

export const GlobalContext = createContext<state>({
  showHeader: false,
  setShowHeader: () => {},
  setIsLoading: () => {},
  isLoading: false,
  token: null,
  setToken: () => {}
});

export function GlobalProvider({ children }: GlobalProviderProps) {

  const [state, dispatch] = useReducer(globalReducer, InitialState);

  const { showHeader, isLoading } = state;

  const { getValue: getToken, setValue: setTokenOnLocalStorage } = useLocalStorage('');

  const setShowHeader = (showHeader: boolean) => {

    dispatch({
      type: CART_ACTION_TYPES.SHOW_HEADER,
      payload: { showHeader },
    });

  };

  const setIsLoading = (isLoading: boolean) => {
    dispatch({
      type: CART_ACTION_TYPES.APP_IS_LOADING,
      payload: { isLoading },
    });
  }

  const setToken = (token: string | null) => {

    dispatch({
      type: CART_ACTION_TYPES.SET_TOKEN,
      payload: { token },
    });

    if(token) {
      setTokenOnLocalStorage('token', token);
    }

  }

  const storedToken = (): string | null => {

    if(getToken('token')) {
      return getToken('token');
    }

    return null;

  };

  return (
    <GlobalContext.Provider
      value={{
        showHeader,
        setShowHeader,
        setIsLoading,
        isLoading,
        token: storedToken(),
        setToken
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
