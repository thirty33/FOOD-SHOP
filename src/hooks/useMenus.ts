import { useEffect, useReducer } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { MenuHttpService } from "../services/menu";
import { CART_ACTION_TYPES } from "../config/constant";
import { MenuItemPagination } from "../types/menus";
import { useInifiniteScroll } from "./useInifiniteScroll";

const menuService = new MenuHttpService();

export function useMenus() {

    const { currentPage, setHasMore } = useInifiniteScroll();

    const [state, dispatch] = useReducer(menuReducer, InitialState);

    const { menuItems, isLoading } = state;

    const fetchMenus = async () => {
        try {
            dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: true } });

            const { last_page, current_page, data } = await menuService.list({ page: currentPage }) as MenuItemPagination;
            
            setHasMore(current_page < last_page);

            dispatch({ type: CART_ACTION_TYPES.SET_MENUS, payload: { menuItems: [...menuItems, ...data] } });

            dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: false } });

        } catch (error) {
            dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: false } });
            throw error;
        }
    }

    useEffect(() => {
        fetchMenus();
    }, [currentPage]);

    return {
        menuItems,
        isLoading
    }
}
