import { useParams } from "react-router-dom";
import { categoryService } from "../services/category";
import { Category } from "../types/categories";
import { groupCategoriesBySubcategory, ExtendedCategory } from "../helpers/categoryGrouping";
import { useQueryParams } from "./useQueryParams";
import { useManualPagination } from "./useManualPagination";
import { useCategoryFilter } from "../context/CategoryFilterContext";
import { useMemo } from "react";

export function useCategories() {
    const { menuId } = useParams<{ menuId: string }>();
    const queryParams = useQueryParams(['delegate_user']);
    const { activeFilter } = useCategoryFilter();

    // Create fetch function for useManualPagination
    const fetchCategories = async (page: number) => {
        const params: any = { 
            page,
            ...queryParams
        };
        
        // Add priority_group if a filter is active
        if (activeFilter) {
            params.priority_group = activeFilter;
        }
        
        const response = await categoryService.list(menuId!, params);
        return response;
    };

    // Create reset trigger that includes both menuId and activeFilter
    const resetTrigger = useMemo(() => {
        return `${menuId}-${activeFilter || 'none'}`;
    }, [menuId, activeFilter]);

    // Use the generic manual pagination hook
    const {
        items: categories,
        isLoading,
        hasMore,
        loadMore: loadMoreCategories
    } = useManualPagination<Category>({
        fetchFunction: fetchCategories,
        resetTrigger: resetTrigger,
        fetchArgs: []
    });

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
