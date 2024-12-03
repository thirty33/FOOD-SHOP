import { useEffect, useReducer } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CategoryHttpService } from "../services/category";
import { CategoryItemPagination } from "../types/categories";
import { useInifiniteScroll } from "./useInifiniteScroll";

const categoryService = new CategoryHttpService();

export function useCategories() {

    const { currentPage, setHasMore } = useInifiniteScroll();
    const [state, dispatch] = useReducer(menuReducer, InitialState); 

    const { categories, isLoading } = state;

    const fetchCategories = async () => {
        try {
            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: true } });

            const { last_page, current_page, data } = await categoryService.list({ page: currentPage }) as CategoryItemPagination;

            setHasMore(current_page < last_page);

            dispatch({ type: 'SET_CATEGORIES', payload: { categories: [...categories, ...data] } });

            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: false } });

        } catch (error) {
            dispatch({ type: 'APP_IS_LOADING', payload: { isLoading: false } });
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