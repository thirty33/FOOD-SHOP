import { useEffect, useRef, useState } from "react";
import { categoryService } from "../services/category";
import { CategoryItemPagination } from "../types/categories";
// import { useInfiniteScroll } from "./useInfiniteScroll";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { Category } from "../types/categories";
import { configuration } from "../config/config";
import { groupCategoriesBySubcategory, ExtendedCategory } from "../helpers/categoryGrouping";

export function useCategories() {

    // ❌ COMMENTED OUT - Original useInfiniteScroll hook usage
    // const {
    //     currentPage,
    //     isLoading,
    //     categories,
    //     setIsLoading,
    //     setHasMore,
    //     setCategories,
    //     lastPage,
    //     setLastPage,
    //     setCurrenPage
    // } = useInfiniteScroll();

    // ✅ NEW - Replace useInfiniteScroll with local states for manual loading
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [lastPage, setLastPage] = useState(1);

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
            enqueueSnackbar((error as Error).message, { variant: 'error', autoHideDuration: configuration.toast.duration });
        }
    }

    useEffect(() => {
        // setCategories([]);
        setCurrentPage(1);
        setLastPage(1);
        setHasMore(false);
    }, [menuId]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchCategories();
        }
    }, [currentPage, menuId]);

    const hasFetched = useRef(false);
    
    // Initial fetch - only trigger when categories are empty and we're on page 1
    useEffect(() => {
        if (!hasFetched.current && categories.length === 0 && currentPage === 1) {
            fetchCategories();
            hasFetched.current = true;
        }
    }, [categories, currentPage]);

    const loadMoreCategories = () => {
        setCurrentPage(prev => prev + 1);
    };

    // Group categories by specific subcategories
    const groupedCategories: ExtendedCategory[] = groupCategoriesBySubcategory(categories);

    return {
        categories,
        groupedCategories,
        isLoading,
        hasMore,
        loadMoreCategories
    }
}
