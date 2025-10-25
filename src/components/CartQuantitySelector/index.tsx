import { useState, useEffect } from "react";
import { QuantitySelector } from "../QuantitySelector";

interface CartQuantitySelectorProps {
  quantity: number | string;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addOneItem: () => void;
  restOneItem: () => void;
}

/**
 * CartQuantitySelector - Wrapper for QuantitySelector with local state management
 *
 * This component maintains local state for the input value to allow users to:
 * - Delete the current value without the product disappearing from cart
 * - Type new values smoothly
 * - Block invalid inputs (pure "0")
 *
 * Only valid values (numbers > 0) are propagated to the parent component.
 */
export const CartQuantitySelector = ({
  quantity,
  handleQuantityChange,
  addOneItem,
  restOneItem
}: CartQuantitySelectorProps): JSX.Element => {
  // Local state for input value (allows temporary empty state)
  const [localValue, setLocalValue] = useState<string | number>(quantity);

  // Sync local value when quantity prop changes from external source (e.g., API response, +/- buttons)
  useEffect(() => {
    if (typeof quantity === 'number' && quantity > 0) {
      setLocalValue(quantity);
    }
  }, [quantity]);

  const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Block pure zero "0"
    if (value === "0") {
      return;
    }

    // Allow empty state temporarily (user is deleting to type new number)
    if (!value) {
      setLocalValue("");
      return;
    }

    const numValue = parseInt(value, 10);

    // Update local value immediately for responsive UI
    setLocalValue(value);

    // Only propagate valid numbers to parent
    if (numValue > 0) {
      handleQuantityChange(event);
    }
  };

  return (
    <QuantitySelector
      quantity={localValue}
      handleQuantityChange={handleLocalChange}
      addOneItem={addOneItem}
      restOneItem={restOneItem}
    />
  );
};
