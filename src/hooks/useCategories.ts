import { useEffect } from "react";
import { categoryService } from "../services/category";
import { CategoryItemPagination } from "../types/categories";
import { useInifiniteScroll } from "./useInifiniteScroll";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

export function useCategories() {

    const { 
        currentPage, 
        isLoading, 
        categories,
        setIsLoading,
        setHasMore,
        setCategories,
        setMenus,
        setCurrenPage
     } = useInifiniteScroll();

    const { enqueueSnackbar } = useSnackbar();

    const { menuId } = useParams<{ menuId: string }>();
    
    const fetchCategories = async () => {
        try {

            setIsLoading(true);

            const { last_page, current_page, data } = await categoryService.list(menuId!, { page: currentPage }) as CategoryItemPagination;

            setHasMore(current_page < last_page);

            setCategories([...categories, ...data]);

            setIsLoading(false);
            
        } catch (error) {
            setIsLoading(false);
            enqueueSnackbar((error as Error).message, { variant: 'error' });
        }
    }

    useEffect(() => {
        setMenus([]);
        setCategories([]);
        setCurrenPage(1);
        setHasMore(2 < 1);
    }, [menuId])
    
    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    return {
        categories,
        isLoading
    }
}