import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { menuService } from "../services/menu";
import { MenuItemPagination } from "../types/menus";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useOrder } from "./useCurrentOrder";
import { useQueryParams } from "./useQueryParams";
import { ROUTES } from "../config/routes";

export function useMenus() {
    const navigate = useNavigate();

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
    } = useInfiniteScroll();

    const {
        // setCurrentOrder
    } = useOrder();

    const queryParams = useQueryParams(['delegate_user']);

    const fetchMenus = async () => {
        try {
            setIsLoading(true);

            if(currentPage > lastPage) return;

            const { last_page, current_page, data } = await menuService.list({ 
                page: currentPage,
                ...queryParams
            }) as MenuItemPagination;

            setHasMore(current_page < last_page);
            setLastPage(last_page);

            setMenus([...menuItems, ...data]);

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching menus:', error);
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

    const hasFetched = useRef(false);
    useEffect(() => {
        if(!hasFetched.current && menuItems.length === 0 && currentPage === 1) {
            fetchMenus();
            hasFetched.current = true;
        }
    }, [menuItems, currentPage])

    const handleMenuClick = (menuId: string | number, date: string) => {
        const menuSelected = menuItems.find((item) => item.id === menuId);
        if (menuSelected) {
            setSelectedMenu(menuSelected);
        }
        
        // Construir los search params preservando delegate_user si existe
        const searchParams = new URLSearchParams();
        searchParams.set('date', date);
        
        if (queryParams.delegate_user) {
            searchParams.set('delegate_user', queryParams.delegate_user);
        }
        
        navigate({
            pathname: ROUTES.GET_CATEGORY_ROUTE(menuId),
            search: searchParams.toString()
        });
    };

    return {
        menuItems,
        isLoading,
        setSelectedMenu,
        handleMenuClick
    }
}
