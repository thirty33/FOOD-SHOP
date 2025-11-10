import { useMemo } from "react";
import { useQuantityChange } from "../../hooks/useQuantityChange";
import { Ingredients } from "../../types/categories";
import { QuantitySelector } from "../QuantitySelector";
import { useOrder } from "../../hooks/useCurrentOrder";
import AddToCartIcon from "../Icons/AddToCartIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import { SpinnerLoading } from "../SpinnerLoading";
import { capitalizeAfterHyphen } from "../../helpers/texts";
import { useAuth } from "../../hooks/useAuth";
import { isAgreementIndividual, isAgreementConsolidated } from "../../helpers/permissions";

interface ProductItemProps {
  id: string | number;
  imageLight: string | null;
  title: string;
  price: string | number;
  ingredients: Ingredients[];
  addProductToCart: (id: string | number, quantity: number) => void;
  maximumOrderTime?: string;
  productSubcategories?: any[];
}

export const ProductItem = ({
  id,
  imageLight,
  title,
  price,
  ingredients,
  addProductToCart,
  maximumOrderTime,
  productSubcategories,
}: ProductItemProps): JSX.Element => {
  const {
    handleQuantityChange,
    addOneItem,
    restOneItem,
    currentOrder,
    showQuantityInput,
    showPrices,
  } = useQuantityChange();

  const { setShowProductDetail, deleteItemFromCart, loadingStates } = useOrder();
  const { user } = useAuth();

  // Get loading state for this specific product
  const isLoading = loadingStates[typeof id === 'string' ? parseInt(id) : id] || false;

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
  

  const handleProductClick = () => {
    const product = {
      id: typeof id === 'string' ? parseInt(id) : id,
      name: title,
      description: "",
      price: typeof price === 'string' ? price : price.toString(),
      image: imageLight,
      category_id: 0,
      code: "",
      active: 1,
      measure_unit: "",
      price_list: "",
      stock: 0,
      weight: "",
      allow_sales_without_stock: 0,
      price_list_lines: [{ 
        id: 1, 
        unit_price: typeof price === 'string' ? price : price.toString(),
        unit_price_with_tax: typeof price === 'string' ? price : price.toString()
      }],
      ingredients
    };
    setShowProductDetail(product);
  };

  return (
    <div
      key={id}
      className="rounded-lg md:rounded-2xl border-2 border-gray-200 px-3 md:px-6 pt-3 md:pt-8 lg:pt-6 pb-2 md:pb-0 shadow-sm mx-6 lg:mx-0 lg:lg:max-w-96 flex md:flex-col items-start"
    >
      <div 
        className="relative h-16 w-16 md:h-36 md:w-full md:mx-auto max-h-36 max-w-full overflow-hidden rounded-lg md:rounded-2xl flex-shrink-0 bg-gray-100 self-center md:self-auto"
      >
        {imageLight ? (
          <img
            className={`absolute top-[-1rem] w-full h-24 object-cover object-center ${
              !imageLight
                ? 'md:h-44 md:top-[-0.9rem]' 
                : 'md:top-[-2.9rem] md:h-64'
            }`}
            src={imageLight}
            alt=""
          />
        ) : (
          <div 
            className="absolute inset-0 flex items-center justify-center text-center p-1 md:p-2 bg-gray-200"
          >
            <span 
              className="text-xs md:text-base font-cera-bold leading-tight text-gray-600"
            >
              Imagen no disponible
            </span>
          </div>
        )}
      </div>
      <div 
        className="pt-1 md:pt-4 px-2 md:px-0 pb-1 md:pb-5 flex-1 flex flex-col md:justify-between"
      >
        <div>
          <div 
            className="text-sm md:text-2xl font-semibold font-cera-bold tracking-tighter leading-[1.1] md:leading-tight text-green-100 py-0"
          >
            {(() => {
              const basicCapitalized = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
              return capitalizeAfterHyphen(basicCapitalized);
            })()}
          </div>

          <div 
            className="mb-1 md:mb-4 flex flex-row md:flex-col gap-2 md:gap-0 md:justify-start items-center md:items-start"
          >
            <button
              type="button"
              className="text-green-100 font-cera-medium tracking-tighter text-xs md:text-lg underline hover:text-yellow-active"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick();
              }}
            >
              Detalles
            </button>
            {showPrices && (
              <p className="text-xs md:hidden font-extrabold leading-tight text-green-100 font-cera-bold tracking-tighter">
                Precio neto: {price}
              </p>
            )}
          </div>
        </div>

        <div 
          className="mt-1 md:mt-0 flex flex-col"
        >
          {showPrices && (
            <div className="text-left hidden md:flex flex-col gap-1 md:gap-2 justify-start mb-1">
              <p 
                className="text-xs md:text-lg font-extrabold leading-tight text-green-100 font-cera-bold tracking-tighter"
              >
                Precio neto: {price}
              </p>
            </div>
          )}
          {typeof currentQuantity === "number" && currentQuantity === 0 && (
            <div>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-xs md:text-md font-medium font-cera-bold text-white hover:bg-green-100 focus:outline-none focus:ring-4"
                onClick={(e) => {
                  e.stopPropagation();
                  addProductToCart(id, 1);
                }}
              >
                {isLoading ? (
                  <SpinnerLoading show={true} size={3} />
                ) : (
                  <AddToCartIcon
                    width="12"
                    height="12"
                    size="14"
                    color="white"
                    className="stroke-white fill-white"
                  />
                )}
                <span className="ml-1">Agregar</span>
              </button>
            </div>
          )}
          {((typeof currentQuantity === "number" && currentQuantity >= 1) ||
              currentQuantity === "") && (
              <div 
                className={`grid grid-col ${showQuantityInput ? 'grid-cols-2' : 'grid-cols-1'} justify-start justify-items-start`}
                onClick={(e) => e.stopPropagation()}
              >
                {showQuantityInput && (
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
                )}
                <div 
                  className={`flex items-center justify-center gap-1 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoading) {
                      deleteItemFromCart(id, 1);
                    }
                  }}
                >
                  <DeleteIcon
                    size="16"
                    color="#FF6A41"
                    strokeWidth="2"
                    className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                  />
                  <span className={`text-xs text-gray-400 font-cera-light ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    eliminar
                  </span>
                  <div className="ml-2">
                    <SpinnerLoading show={isLoading} size={4} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Show availability text for agreement users (individual or consolidated) */}
            {(isAgreementIndividual(user) || isAgreementConsolidated(user)) && maximumOrderTime && (
              <div className="mt-2">
                <p className="text-green-100 font-cera-regular tracking-normal text-xs md:text-sm">
                  {maximumOrderTime}
                </p>
              </div>
            )}
            
            {/* Show subcategories for agreement users (individual or consolidated) */}
            {(isAgreementIndividual(user) || isAgreementConsolidated(user)) && productSubcategories && productSubcategories.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {productSubcategories.map((subcategory, index) => (
                    <span
                      key={`${subcategory.id}-${index}`}
                      className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-50 text-white font-cera-medium"
                    >
                      {subcategory.name.charAt(0).toUpperCase() + subcategory.name.slice(1).toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
