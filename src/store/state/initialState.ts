import { globalState } from "../../types/state";

export const InitialState: globalState = {
    showHeader: false,
    isLoading: false,
    token: null,
    menuItems: [],
    categories: [],
    products: [],
    currentPage: 1,
    hasMore: false,
    selectedMenu: null,
    currentOrder: null
};