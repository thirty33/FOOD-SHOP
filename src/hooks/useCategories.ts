import { useEffect, useRef } from "react";
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
        lastPage,
        setLastPage,
        setCurrenPage
    } = useInifiniteScroll();

    const { enqueueSnackbar } = useSnackbar();

    const { menuId } = useParams<{ menuId: string }>();

    const fetchCategories = async () => {
        try {
            setIsLoading(true);

            if (currentPage > lastPage) {
                return;
            }

            const { last_page, current_page, data } = await categoryService.list(menuId!, { page: currentPage }) as CategoryItemPagination;

            setHasMore(current_page < last_page);
            setLastPage(last_page);

            setCategories([...categories, ...data]);

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            enqueueSnackbar((error as Error).message, { variant: 'error' });
        }
    }

    useEffect(() => {
        setCategories([]);
        setCurrenPage(1);
        setLastPage(1);
        setHasMore(false);
    }, [menuId]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchCategories();
        }
    }, [currentPage, menuId]);

    const hasFetched = useRef(false);
    // Fetch categories only after categories have been reset
    useEffect(() => {
        if (!hasFetched.current && categories.length === 0 && currentPage === 1) {
            fetchCategories();
            hasFetched.current = true;
        }
    }, [categories, currentPage]);

    return {
        categories,
        isLoading
    }
}
