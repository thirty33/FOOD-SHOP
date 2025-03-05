interface QuantitySelectorProps {
  quantity: number | string;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	addOneItem: () => void;
	restOneItem: () => void;
}

export const QuantitySelector = ({
  quantity,
  handleQuantityChange,
	addOneItem,
	restOneItem
}: QuantitySelectorProps): JSX.Element => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => restOneItem()}
				disabled={quantity === 1}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
      >
        <span className="sr-only">Decrease quantity</span>
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      <input
        type="number"
        className="w-12 text-center text-sm text-gray-600 dark:text-gray-400 bg-transparent border border-gray-300 rounded-md p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={quantity}
        onChange={handleQuantityChange}
        min="0"
      />

      <button
        onClick={() => addOneItem()}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
      >
        <span className="sr-only">Increase quantity</span>
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};
