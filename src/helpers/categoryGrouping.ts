import { Category, CategoryLine, Subcategory } from "../types/categories";
import { GROUPING_SUBCATEGORIES } from "../config/constant";

// Extended type for CategoryLine with source information
export interface ExtendedCategoryLine extends CategoryLine {
  source_category_id: number;
  source_category_name: string;
}

// Extended type for Subcategory with source information
export interface ExtendedSubcategory extends Subcategory {
  source_category_id: number;
}

// Extended type for CategoryDetail with extended CategoryLines and Subcategories
export interface ExtendedCategoryDetail {
  id: number | null;
  name: string;
  description: string;
  products: any[]; // Keep flexible for grouped products
  category_lines: ExtendedCategoryLine[];
  category_user_lines: CategoryLine[];
  subcategories: ExtendedSubcategory[];
}

// Extended type for Category with extended CategoryDetail
export interface ExtendedCategory extends Omit<Category, 'category' | 'id'> {
  id: string | number;
  category: ExtendedCategoryDetail | null;
}

/**
 * Groups categories by specific subcategories
 * @param categories - Array of categories to group
 * @param targetSubcategories - Array of target subcategory names
 * @returns Array of grouped and ungrouped categories
 */
export const groupCategoriesBySubcategory = (
  categories: Category[], 
  targetSubcategories: string[] = Object.values(GROUPING_SUBCATEGORIES)
): ExtendedCategory[] => {
  const groups: Record<string, ExtendedCategory> = {};
  const ungroupedCategories: ExtendedCategory[] = [];

  categories.forEach((category: Category) => {
    if (!category.category || !category.category.subcategories) {
      ungroupedCategories.push(category as ExtendedCategory);
      return;
    }

    const matchingSubcategory = category.category.subcategories.find((sub: Subcategory) =>
      targetSubcategories.includes(sub.name)
    );

    if (matchingSubcategory) {
      const groupKey = matchingSubcategory.name;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: `${groupKey.toLowerCase().replace(/\s+/g, '-')}-group`,
          order: Math.min(...categories.map((cat: Category) => cat.order || 999)),
          show_all_products: false,
          category_id: null as any,
          menu_id: category.menu_id,
          category: {
            id: null,
            name: groupKey,
            description: `Grupo de ${groupKey.toLowerCase()}`,
            products: [],
            category_lines: [],
            category_user_lines: [],
            subcategories: []
          },
          menu: category.menu,
          products: []
        };
      }

      // Add products to group maintaining show_all_products logic
      const completeCategory = category.show_all_products;
      const productsToAdd = !completeCategory
        ? category.products
        : category?.category?.products;
      
      if (productsToAdd && productsToAdd.length > 0) {
        groups[groupKey].category!.products.push(...productsToAdd);
      }
      
      // Add category_lines with source category identifier
      const categoryLinesWithSource: ExtendedCategoryLine[] = category.category.category_lines.map((line: CategoryLine) => ({
        ...line,
        source_category_id: category.category!.id,
        source_category_name: category.category!.name
      }));
      groups[groupKey].category!.category_lines.push(...categoryLinesWithSource);
      
      // Add ALL subcategories with source category identifier
      const subcategoriesWithSource: ExtendedSubcategory[] = category.category.subcategories.map((sub: Subcategory) => ({
        ...sub,
        source_category_id: category.category!.id
      }));
      groups[groupKey].category!.subcategories.push(...subcategoriesWithSource);
      
    } else {
      ungroupedCategories.push(category as ExtendedCategory);
    }
  });

  // Convert groups to array and combine with ungrouped categories
  const groupedArray = Object.values(groups);
  const result = [...groupedArray, ...ungroupedCategories];
  
  // Sort by order
  return result.sort((a: ExtendedCategory, b: ExtendedCategory) => (a.order || 999) - (b.order || 999));
};