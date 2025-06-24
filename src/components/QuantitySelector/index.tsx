import { PlusIcon, ToggleIcon } from "../Icons/ButtonIcons";

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
    <div className="flex items-center rounded-md content-center justify-center border h-8 w-24">
      <button
        onClick={() => restOneItem()}
				disabled={quantity === 1}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center text-green-100 font-cera-bold hover:bg-yellow-active hover:rounded-md"
      >
        <ToggleIcon size="10"/>
      </button>

      <input
        type="number"
        className="bg-blue-500 w-8 text-center text-2xl md:text-3xl text-green-100 font-cera-bold bg-transparent border-gray-300 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-none"
        value={quantity}
        onChange={handleQuantityChange}
        min="0"
      />

      <button
        onClick={() => addOneItem()}
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center text-green-100 hover:bg-yellow-active hover:rounded-md"
      >
        <PlusIcon size="14"/>
      </button>
    </div>
  );
};
