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
    currentOrder: null,
    showSideCart: false,
    user: {
        role: null,
        permission: null,
        master_user: false
    },
    orders: null,
    showModal: false,
    isPendingReload: false,
    recentOperation: false
};