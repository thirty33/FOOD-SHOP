import { useCallback, useEffect } from "react";
import { CategoryHttpService } from "../services/category";
import { CategoryItemPagination } from "../types/categories";
import { useInifiniteScroll } from "./useInifiniteScroll";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { CART_ACTION_TYPES } from "../config/constant";

const categoryService = new CategoryHttpService();

export function useCategories() {

    const { currentPage, isLoading, categories, dispatch } = useInifiniteScroll();

    const { enqueueSnackbar } = useSnackbar();

    const { menuId } = useParams<{ menuId: string }>();
    
    const fetchCategories = useCallback(async () => {
        try {
            dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: true } });

            const { last_page, current_page, data } = await categoryService.list(menuId!, { page: currentPage }) as CategoryItemPagination;

            dispatch({ type: CART_ACTION_TYPES.SET_HAS_MORE, payload: { hasMore: current_page < last_page}})

            dispatch({ type: CART_ACTION_TYPES.SET_CATEGORIES, payload: { categories: [...categories, ...data] } });

            dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: false } });
            
        } catch (error) {
            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: false } });
            enqueueSnackbar((error as Error).message, { variant: 'error' });
            throw error;
        }
    }, [categories, currentPage, menuId, enqueueSnackbar]);

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    return {
        categories,
        isLoading
    }
}