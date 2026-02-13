import { Ingredients } from "../types/categories";

const INVALID_INGREDIENT_VALUES = ["-", "–", "—", ""];
const INVALID_DESCRIPTION_VALUES = ["No description", "no description", "-", "--", ""];

/**
 * Checks if a single ingredient has valid descriptive text
 *
 * @param ingredient - The ingredient to validate
 * @returns true if the ingredient has valid descriptive text
 *
 * @example
 * isValidIngredient({ descriptive_text: "LECHUGA FRESCA" }) => true
 * isValidIngredient({ descriptive_text: "-" }) => false
 * isValidIngredient({ descriptive_text: "" }) => false
 */
export function isValidIngredient(ingredient: Ingredients): boolean {
  const text = ingredient.descriptive_text?.trim() ?? "";
  return !INVALID_INGREDIENT_VALUES.includes(text);
}

/**
 * Filters an array of ingredients, returning only valid ones
 *
 * @param ingredients - Array of ingredients to filter
 * @returns Array containing only ingredients with valid descriptive text
 *
 * @example
 * getValidIngredients([{ descriptive_text: "TOMATE" }, { descriptive_text: "-" }])
 * => [{ descriptive_text: "TOMATE" }]
 */
export function getValidIngredients(ingredients: Ingredients[]): Ingredients[] {
  return ingredients.filter(isValidIngredient);
}

/**
 * Checks if a product description is valid (not a placeholder)
 *
 * @param description - The product description to validate
 * @returns true if the description contains real content
 *
 * @example
 * isValidDescription("Sandwich de pollo con lechuga") => true
 * isValidDescription("No description") => false
 * isValidDescription("") => false
 * isValidDescription(null) => false
 */
export function isValidDescription(description: string | null | undefined): boolean {
  const text = description?.trim() ?? "";
  return text.length > 0 && !INVALID_DESCRIPTION_VALUES.includes(text);
}

/**
 * Formats an array of ingredients into a comma-separated string with period at end.
 * Each ingredient is capitalized (first letter upper, rest lower).
 *
 * @param ingredients - Array of valid ingredients
 * @returns Formatted string like "Tomate, Lechuga fresca, Cebolla."
 */
export function formatIngredientsText(ingredients: Ingredients[]): string {
  return ingredients
    .map((ingredient, index, row) => {
      const text = ingredient.descriptive_text;
      const formatted = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return `${formatted}${index + 1 === row.length ? "." : ","}`;
    })
    .join(" ");
}