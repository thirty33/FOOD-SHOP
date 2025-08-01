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
    <div className="flex items-center rounded-md content-center justify-center border h-7 w-20 md:w-28">
      <button
        onClick={() => restOneItem()}
				disabled={quantity === 1}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center text-green-100 font-cera-bold hover:bg-yellow-active hover:rounded-md"
      >
        <ToggleIcon size="8"/>
      </button>

      <input
        type="number"
        className="bg-blue-500 w-6 md:w-9 text-center text-lg md:text-3xl text-green-100 font-cera-bold bg-transparent border-gray-300 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-none"
        value={quantity}
        onChange={handleQuantityChange}
        min="0"
      />

      <button
        onClick={() => addOneItem()}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center text-green-100 hover:bg-yellow-active hover:rounded-md"
      >
        <PlusIcon size="12"/>
      </button>
    </div>
  );
};
