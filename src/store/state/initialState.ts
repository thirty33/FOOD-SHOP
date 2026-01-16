import { globalState } from "../../types/state";
import { getInitialUser } from "../../utils/userHelpers";

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
    user: getInitialUser(),
    orders: null,
    showModal: false,
    isPendingReload: false,
    recentOperation: false
};