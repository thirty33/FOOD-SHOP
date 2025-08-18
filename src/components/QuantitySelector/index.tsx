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
  // Calcular el ancho dinámico basado en la longitud del número
  const inputWidth = Math.max(2, String(quantity).length + 0.5);
  
  return (
    <div className="flex items-center rounded-md content-center justify-center border h-7 w-fit min-w-20 md:min-w-28 px-1">
      <button
        onClick={() => restOneItem()}
				disabled={quantity === 1}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center text-green-100 font-cera-bold hover:bg-yellow-active hover:rounded-md mx-1"
      >
        <ToggleIcon size="8"/>
      </button>

      <input
        type="number"
        className="bg-blue-500 min-w-[2ch] text-center text-lg md:text-3xl text-green-100 font-cera-bold bg-transparent border-gray-300 p-0 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-none focus:outline-none"
        value={quantity}
        onChange={handleQuantityChange}
        min="0"
        style={{ width: `${inputWidth}ch` }}
      />

      <button
        onClick={() => addOneItem()}
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center text-green-100 hover:bg-yellow-active hover:rounded-md mx-1"
      >
        <PlusIcon size="12"/>
      </button>
    </div>
  );
};
