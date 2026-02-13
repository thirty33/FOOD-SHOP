import { useMemo } from "react";
import { Product } from "../types/categories";
import {
  getValidIngredients,
  isValidDescription,
  formatIngredientsText,
} from "../helpers/product";

export function useProductDetail(product: Product) {
  const validIngredients = useMemo(
    () => getValidIngredients(product.ingredients),
    [product.ingredients]
  );

  const hasValidIngredients = validIngredients.length > 0;
  const hasValidDescription = isValidDescription(product.description);

  const detailText = useMemo(() => {
    if (hasValidIngredients) {
      return formatIngredientsText(validIngredients);
    }
    if (hasValidDescription) {
      return product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase();
    }
    return null;
  }, [validIngredients, hasValidIngredients, hasValidDescription, product.description]);

  const detailLabel = hasValidIngredients ? "Ingredientes" : "Descripción";

  return {
    detailText,
    detailLabel,
  };
}