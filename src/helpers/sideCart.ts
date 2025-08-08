import { User } from "../types/user";
import { isAgreementIndividual } from "./permissions";
import { isMobileDevice } from "./device";

/**
 * Determines if the side cart should auto-open when adding the first product
 * 
 * Business rule:
 * - Mobile + Convenio Individual users: Do NOT auto-open
 * - All other cases: Auto-open as normal
 * 
 * @param user - The current user object
 * @returns {boolean} true if the side cart should auto-open
 */
export const shouldAutoOpenSideCart = (user: User): boolean => {
  // If user is on mobile AND is convenio individual, don't auto-open
  if (isMobileDevice() && isAgreementIndividual(user)) {
    return false;
  }
  
  // In all other cases, auto-open the side cart
  return true;
};

/**
 * Handles the logic for auto-opening the side cart when adding the first product to an empty cart
 * 
 * @param filterOrderLines - Array of order lines being added (filtered)
 * @param previousCartCount - Number of items in cart before this operation
 * @param user - The current user object
 * @param setShowSideCart - Function to set the side cart visibility
 */
export const handleAutoOpenSideCart = (
  filterOrderLines: Array<{ id: string | number; quantity: number }>,
  previousCartCount: number,
  user: User,
  setShowSideCart: (value: boolean) => void
): void => {
  // Auto-open CheckoutSideMenu only when adding products to an empty cart
  // Check user-specific rules for auto-opening
  if (filterOrderLines.length > 0 && previousCartCount === 0) {
    if (shouldAutoOpenSideCart(user)) {
      setShowSideCart(true);
    }
  }
};