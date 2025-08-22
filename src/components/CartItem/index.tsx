import { QuantitySelector } from "../QuantitySelector";
import { useQuantityChange } from "../../hooks/useQuantityChange";
import { ORDER_STATUS, ORDER_STATUS_TEXT } from "../../config/constant";
import XIcon from "../../components/Icons/XIcon";
import CloseButton from "../Icons/CloseButton";

export interface CartItemProps {
  id: number | number;
  image: string;
  name: string;
  price: string;
  quantity: number | string;
  deleteItemFromCart: (id: number | number, quantity: number | number) => void;
  showQuantitySelector: boolean;
  showPartialiSheduledTag: boolean;
  canSchedulePartially: boolean;
  subcategories?: Array<{id: number, name: string}>;
  categoryName?: string;
  showSubcategories?: boolean;
}

export const CartItem = ({
  id,
  image,
  name,
  price,
  quantity: initialQuantity,
  deleteItemFromCart,
  showQuantitySelector = false,
  showPartialiSheduledTag = false,
  canSchedulePartially = false,
  subcategories = [],
  categoryName = '',
  showSubcategories = false,
}: CartItemProps): JSX.Element => {
  const {
    handleQuantityChange,
    addOneItem,
    restOneItem,
    showPrices,
    handlePartiallyScheduled,
  } = useQuantityChange();

  return (
    <div 
      className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white pt-2 pl-2 pr-2 pb-2 md:pt-3 md:pl-3 md:pr-3 md:pb-3 lg:pt-4 lg:pl-2 lg:pr-4 lg:pb-4 shadow-sm h-36 max-h-36 md:h-40 lg:h-40 md:max-h-40 lg:max-h-40"
    >

      <CloseButton
        className="w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 cursor-pointer absolute top-[-1rem] right-0"
        color="white"
        width="8"
        height="8"
        onClick={() => deleteItemFromCart(id, 1)} 
      />

      {/* Product Image */}
      <div 
        className="h-28 w-28 md:h-36 lg:h-36 md:w-36 lg:w-36 flex-shrink-0"
      >
        {image ? (
          <img
            className="h-full w-full rounded-md object-cover"
            src={image}
            alt={name}
          />
        ) : (
          <div 
            className="h-full w-full rounded-md flex items-center justify-center text-center p-2"
            style={{ backgroundColor: '#E6E6E6' }}
          >
            <span 
              className="text-xs md:text-sm font-cera-bold leading-tight"
              style={{ color: '#CCCCCC' }}
            >
              Imagen no disponible
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div 
        className="flex flex-col flex-1 min-w-0"
      >
        <div 
          className="flex flex-col gap-y-0.5 md:gap-y-1.5 lg:gap-y-2 items-start justify-between w-full"
        >
          {showSubcategories && (subcategories.length > 0 || categoryName) && (
            <p className="text-sm md:text-2xl lg:text-base text-wrap text-green-100 font-cera-bold tracking-tighter leading-3 md:leading-tight w-full break-words mb-1">
              {subcategories.length > 0 
                ? subcategories.map(sub => sub.name.toUpperCase()).join(' ')
                : categoryName.toUpperCase()}
            </p>
          )}
          <h3 
            className="text-xs md:text-xl lg:text-sm text-wrap text-green-100 font-cera-bold tracking-tighter leading-3 md:leading-tight w-full break-words"
          >
            {(() => {
              return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            })()}
          </h3>
          {showPrices && (
            <p 
              className="text-sm md:text-xl lg:text-base text-green-100 font-cera-medium tracking-tighter leading-4 md:leading-4 truncate"
            >
              {price}
            </p>
          )}
          {showQuantitySelector && (
            <div className="w-full max-w-full">
              <QuantitySelector
              quantity={initialQuantity}
              handleQuantityChange={(ev) =>
                handleQuantityChange(ev, id, showPartialiSheduledTag)
              }
              addOneItem={() =>
                addOneItem(id, initialQuantity, showPartialiSheduledTag)
              }
              restOneItem={() =>
                restOneItem(id, initialQuantity, showPartialiSheduledTag)
              }
              />
            </div>
          )}
          
          {canSchedulePartially && showPartialiSheduledTag && (
            <div 
              className="flex items-center justify-between text-start gap-x-1 w-full"
            >
              <div 
                className="flex items-center gap-2"
              >
                <span className="bg-gray-state text-gray-text-state text-xs md:text-base lg:text-xs text-nowrap font-cera-bold px-2 py-1 rounded-sm">
                  {ORDER_STATUS_TEXT[ORDER_STATUS.PARTIALLY_SCHEDULED]}
                </span>
              </div>
              <XIcon 
                className="w-2 h-2 md:w-4 md:h-4 fill-gray-text-state stroke-gray-text-state"
                onClick={() =>
                  handlePartiallyScheduled(
                    id,
                    initialQuantity,
                    !showPartialiSheduledTag
                  )
                }
              />
            </div>
          )}

          {canSchedulePartially && !showPartialiSheduledTag && (
            <section 
              className="flex items-center gap-x-1 w-full"
            >
              <button
                type="button"
                onClick={() =>
                  handlePartiallyScheduled(
                    id,
                    initialQuantity,
                    !showPartialiSheduledTag
                  )
                }
                className="bg-green-50 text-white text-xs md:text-base lg:text-xs text-nowrap font-cera-bold px-3 py-1 rounded-sm hover:bg-yellow-active hover:text-white"
              >
                <span>Agendar parcialmente</span>
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};