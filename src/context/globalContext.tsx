import { createContext, useReducer } from "react";
import { CART_ACTION_TYPES } from "../config/constant";
import { type state, type GlobalProviderProps } from "../types/state";
import { InitialState } from "../store/state/initialState";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { menuReducer } from "../store/reducers/menuReducer";
import { MenuItem } from "../types/menus";
import { Category } from "../types/categories";

type globalContextState = Pick<
  state,
  | "showHeader"
  | "isLoading"
  | "token"
  | "menuItems"
  | "currentPage"
  | "hasMore"
  | "categories"
  | "selectedMenu"
  | "currentOrder"
  | "setShowHeader"
  | "setIsLoading"
  | "setToken"
  | "setMenus"
  | "setCategories"
  | "setHasMore"
  | "loadMoreShorts"
  | "setSelectedMenu"
  | "setCurrenPage"
  | "signOut"
>;

export const GlobalContext = createContext<globalContextState>({
  showHeader: false,
  setShowHeader: () => {},
  setIsLoading: () => {},
  isLoading: false,
  token: null,
  setToken: () => {},
  menuItems: [],
  currentPage: 1,
  hasMore: false,
  categories: [],
  selectedMenu: null,
  setMenus: () => {},
  setCategories: () => {},
  setHasMore: () => {},
  loadMoreShorts: () => {},
  setSelectedMenu: () => {},
  setCurrenPage: () => {},
  signOut: () => {},
  currentOrder: null,
});

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(menuReducer, InitialState);

  const {
    showHeader,
    isLoading,
    menuItems,
    currentPage,
    hasMore,
    categories,
    // selectedMenu
    currentOrder,
  } = state;

  const { getValue: getToken, setValue: setTokenOnLocalStorage } =
    useLocalStorage("");

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
  };

  const setToken = (token: string | null) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_TOKEN,
      payload: { token },
    });

    if (token) {
      setTokenOnLocalStorage("token", token);
    }
  };

  const storedToken = (): string | null => {
    if (getToken("token")) {
      return getToken("token");
    }

    return null;
  };

  const loadMoreShorts = () => {
    dispatch({
      type: CART_ACTION_TYPES.SET_CURRENT_PAGE,
      payload: { currentPage: currentPage + 1 },
    });
  };

  const setCurrenPage = (page: number) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_CURRENT_PAGE,
      payload: { currentPage: page },
    });
  };

  const setHasMore = (currentPage: number, lastPage: number) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_HAS_MORE,
      payload: { hasMore: currentPage < lastPage },
    });
  };

  const setMenus = (menuItems: MenuItem[]) => {
    dispatch({ type: CART_ACTION_TYPES.SET_MENUS, payload: { menuItems } });
  };

  const setCategories = (categories: Category[]) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_CATEGORIES,
      payload: { categories },
    });
  };

  const setSelectedMenu = (selectedMenu: MenuItem | null) => {
    localStorage.setItem("selectedMenu", JSON.stringify(selectedMenu));
    dispatch({
      type: CART_ACTION_TYPES.SET_SELECTED_MENU,
      payload: { selectedMenu },
    });
  };

  const getSelectedMenu = () => {
    let selectedMenu = null;

    if (localStorage.getItem("selectedMenu")) {
      selectedMenu = JSON.parse(localStorage.getItem("selectedMenu")!);
    }

    return selectedMenu;
  };

  const signOut = () => {
    dispatch({
      type: CART_ACTION_TYPES.SIGN_OUT,
      payload: {
        token: null,
        menuItems: [],
        categories: [],
        currentPage: 1,
        hasMore: false,
        selectedMenu: null,
      },
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        showHeader,
        setShowHeader,
        setIsLoading,
        isLoading,
        token: storedToken(),
        setToken,
        menuItems,
        currentPage,
        hasMore,
        categories,
        loadMoreShorts,
        setHasMore,
        setMenus,
        setCategories,
        setSelectedMenu,
        selectedMenu: getSelectedMenu(),
        setCurrenPage,
        signOut,
        currentOrder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
