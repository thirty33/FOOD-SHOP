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
        lastPage,
        setLastPage,
        setCurrenPage,
    } = useInifiniteScroll();

    const fetchMenus = async () => {
        try {
            setIsLoading(true);

            if(currentPage > lastPage) return;

            const { last_page, current_page, data } = await menuService.list({ page: currentPage }) as MenuItemPagination;

            setHasMore(current_page < last_page);
            setLastPage(last_page);

            setMenus([...menuItems, ...data]);

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }

    useEffect(() => {
        setMenus([]);
        setCurrenPage(1); 
        setLastPage(1); 
        setHasMore(false); 
    }, []);
    
    useEffect(() => {
        if(currentPage > 1) {
            fetchMenus();
        }
    }, [currentPage]);

    useEffect(() => {
        if(menuItems.length === 0 && currentPage === 1) {
            fetchMenus();
        }
    }, [menuItems, currentPage])

    return {
        menuItems,
        isLoading,
        setSelectedMenu
    }
}
