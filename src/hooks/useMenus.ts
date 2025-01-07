import { useEffect } from "react";
import { menuService } from "../services/menu";
import { MenuItemPagination } from "../types/menus";
import { useInifiniteScroll } from "./useInifiniteScroll";

export function useMenus() {

    const {
        currentPage,
        isLoading,
        menuItems,
        setIsLoading,
        setHasMore,
        setMenus,
        setSelectedMenu,
        setCurrenPage,
        setCategories
    } = useInifiniteScroll();

    const fetchMenus = async () => {
        try {
            setIsLoading(true);

            const { last_page, current_page, data } = await menuService.list({ page: currentPage }) as MenuItemPagination;

            setHasMore(current_page < last_page);

            setMenus([...menuItems, ...data]);

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }

    useEffect(() => {
        setCategories([]);
        setCurrenPage(1);
        setHasMore(2 < 1);
    }, [])

    useEffect(() => {
        fetchMenus();
    }, [currentPage]);

    return {
        menuItems,
        isLoading,
        setSelectedMenu
    }
}
