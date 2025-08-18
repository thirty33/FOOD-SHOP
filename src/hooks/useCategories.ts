import { useParams } from "react-router-dom";
import { categoryService } from "../services/category";
import { Category } from "../types/categories";
import { groupCategoriesBySubcategory, ExtendedCategory } from "../helpers/categoryGrouping";
import { useQueryParams } from "./useQueryParams";
import { useManualPagination } from "./useManualPagination";

export function useCategories() {
    const { menuId } = useParams<{ menuId: string }>();
    const queryParams = useQueryParams(['delegate_user']);

    // Create fetch function for useManualPagination
    const fetchCategories = async (page: number) => {
        const response = await categoryService.list(menuId!, { 
            page,
            ...queryParams
        });
        return response;
    };

    // Use the generic manual pagination hook
    const {
        items: categories,
        isLoading,
        hasMore,
        loadMore: loadMoreCategories
    } = useManualPagination<Category>({
        fetchFunction: fetchCategories,
        resetTrigger: menuId,
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
