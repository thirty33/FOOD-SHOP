import { useMemo } from "react";
import { useQuantityChange } from "../../hooks/useQuantityChange";
import { Ingredients } from "../../types/categories";
import { QuantitySelector } from "../QuantitySelector";
import { configuration } from "../../config/config";
import AddToCartIcon from "../Icons/AddToCartIcon";

interface ProductItemProps {
  id: string | number;
  imageLight: string;
  title: string;
  price: string | number;
  ingredients: Ingredients[];
  addProductToCart: (id: string | number, quantity: number) => void;
}

export const ProductItem = ({
  id,
  imageLight,
  title,
  price,
  ingredients,
  addProductToCart,
}: ProductItemProps): JSX.Element => {
  const {
    handleQuantityChange,
    addOneItem,
    restOneItem,
    currentOrder,
    showQuantityInput,
    showPrices,
  } = useQuantityChange();

  const currentQuantity = useMemo(() => {
    return (
      currentOrder?.order_lines.find(
        (line) => line.product && line.product.id === id
      )?.quantity ?? 0
    );
  }, [currentOrder]);

  const partiallyScheduled = useMemo(() => {
    return (
      currentOrder?.order_lines.find(
        (line) => line.product && line.product.id === id
      )?.partially_scheduled ?? false
    );
  }, [currentOrder]);
  
  const IngredientsText = useMemo(() => {
    return ingredients.map((ingredient, index, row) => {
      return `${ingredient.descriptive_text}${index + 1 === row.length ? '.' : ','}`
    }).join(' ')
  }, [ingredients])

  return (
    <div
      key={id}
      className="rounded-lg md:rounded-2xl border-2 border-gray-200 px-6 pt-8 lg:pt-6 shadow-sm mx-6 lg:mx-0 lg:lg:max-w-96"
    >
      <div
        className="mx-auto h-32 w-full max-h-32 max-w-full overflow-hidden rounded-lg md:rounded-2xl"
        onClick={() => addProductToCart(id, 1)}
      >
        <img
          className="w-full h-64 object-contain object-top"
          src={imageLight ?? configuration.product.image}
          alt=""
        />
      </div>
      <div className="pt-4 px-0 pb-5">
        <div className="text-2xl font-semibold font-cera-bold tracking-tighter leading-tight text-green-100 py-0">
          {title}
        </div>

        <div className="flex products-center justify-between gap-4">
          <span className="text-lg font-cera-medium tracking-tighter text-green-100 leading-4">
            Ingredientes
          </span>
        </div>

        <div className="mb-4 space-y-2 flex content-start items-start text-start">
          <section className="text-md text-green-100 space-y-1 font-cera-light text-lg tracking-tighter leading-4">
            <p className="text-wrap">
              {IngredientsText}
            </p>
          </section>
        </div>

        <div className="mt-6 flex flex-col">
          {showPrices && (
            <div className="text-left flex flex-col gap-2 justify-start mb-1">
              <p className="text-lg font-extrabold leading-tight text-green-100 font-cera-bold tracking-tighter">
                Precio neto: {price}
              </p>
            </div>
          )}
          {typeof currentQuantity === "number" && currentQuantity === 0 && (
            <div className="">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-green-50 px-5 py-1 text-md font-medium font-cera-bold text-white hover:bg-green-100 focus:outline-none focus:ring-4"
                onClick={() => addProductToCart(id, 1)}
              >
                <AddToCartIcon                   
                  width="12"
                  height="12"
                  size="14"
                  color="white"
                  className="stroke-white fill-white" 
                />
                <span className="ml-1">Agregar</span>
              </button>
            </div>
          )}
          {showQuantityInput &&
            ((typeof currentQuantity === "number" && currentQuantity >= 1) ||
              currentQuantity === "") && (
              <div className="grid grid-col grid-cols-2 justify-start justify-items-start">
                <QuantitySelector
                  quantity={currentQuantity}
                  handleQuantityChange={(ev) =>
                    handleQuantityChange(ev, id, partiallyScheduled)
                  }
                  addOneItem={() =>
                    addOneItem(id, currentQuantity, partiallyScheduled)
                  }
                  restOneItem={() =>
                    restOneItem(id, currentQuantity, partiallyScheduled)
                  }
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
