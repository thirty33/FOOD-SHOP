import { useEffect, useReducer } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CategoryHttpService } from "../services/category";
import { CategoryItemPagination, Category } from "../types/categories";
import { useInifiniteScroll } from "./useInifiniteScroll";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

const categoryService = new CategoryHttpService();

export function useCategories() {

    const { currentPage, setHasMore } = useInifiniteScroll();
    const { enqueueSnackbar } = useSnackbar();
    const [state, dispatch] = useReducer(menuReducer, InitialState); 

    const { menuId } = useParams<{ menuId: string }>();

    const { categories, isLoading } = state;

    const fetchCategories = async () => {
        try {
            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: true } });

            const { last_page, current_page, data } = await categoryService.list(menuId!, { page: currentPage }) as CategoryItemPagination;

            setHasMore(current_page < last_page);

            dispatch({ type: 'SET_CATEGORIES', payload: { categories: [...categories, ...data] } });

            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: false } });

        } catch (error) {
            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: false } });
            enqueueSnackbar((error as Error).message, { variant: 'error' });
            throw error;
        }
    }
    
    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    return {
        categories,
        isLoading
    }
}