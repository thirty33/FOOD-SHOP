import { XMarkIcon } from "@heroicons/react/24/solid";
import "./styles.css";
import { CartItem } from "../Cart";
import { useOrder } from "../../hooks/useCurrentOrder";
import { SpinnerLoading } from "../SpinnerLoading";
import { useAuth } from "../../hooks/useAuth";
import {
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_TEXT,
} from "../../config/constant";
import { isAdminOrCafe } from "../../helpers/permissions";
import MonkeyIcon from "../Icons/MonkeyIcon";
import CloseButton from "../Icons/CloseButton";

export const CheckoutSideMenu = () => {
  const {
    currentOrder,
    isLoading,
    deleteItemFromCart,
    showSideCart,
    setShowSideCart,
    updateOrderStatus,
    showPrices,
    user,
    isAtCategoriesRoute
  } = useOrder();

  const { showQuantitySelector } = useAuth();

  const handleCheckout = () => {
    updateOrderStatus(ORDER_STATUS.PROCESSED);
  };
  
  return (
    <aside
      className={`${
        showSideCart && isAtCategoriesRoute() ? "flex" : "hidden"
      } checkout-side-menu flex-col fixed rounded-t-3xl z-50 bg-green-100`}
    >

      <CloseButton
        className="w-8 h-8 md:w-12 md:h-12 cursor-pointer z-10 absolute top-[-1rem] md:top-[-1.5rem] right-2"
        color="white"
        width="8"
        height="8"
        onClick={() => setShowSideCart(!showSideCart)} 
      />

      <div className="flex flex-col px-6 pt-4">

        <div className="grid grid-cols-[2fr_7fr_1fr] justify-between items-center pb-2">
          <MonkeyIcon   
            className="w-24 h-24 md:w-32 md:h-32 fill-white stroke-white"
          />
          <section className="">
            
            <h2 className="font-bold text-3xl md:text-5xl text-white font-cera-bold tracking-tighter align-baseline leading-6">Mi orden</h2>

            {currentOrder && (

              <div className="flex flex-row justify-between items-center text-white tracking-tighter">
                <h3>
                  <span className="font-cera-light text-base md:text-2xl">Estado:{" "}</span>
                  <span
                    className={`${
                      ORDER_STATUS_COLOR[currentOrder?.status]
                    } 
                    px-2 py-0 rounded font-cera-bold text-lg md:text-xl text-nowrap
                    ${ currentOrder.status === ORDER_STATUS.PARTIALLY_SCHEDULED ? 'text-gray-text-state' : 'text-white'}
                    `}
                  >
                    {currentOrder ? ORDER_STATUS_TEXT[currentOrder.status] : "N/A"}
                  </span>
                </h3>
              </div>
              
            )}

          </section>
        </div>

      </div>
      <div className="overflow-y-hidden hover:overflow-y-scroll px-6 flex flex-col gap-y-5 md:gap-y-8 h-[19rem] max-h-[19rem] md:h-[60%] md:max-h-[60%] pt-4 md:pt-6">
        {currentOrder &&
          currentOrder.order_lines.map((line) => {
            if (!line.product) return null;
            return (
              <CartItem
                key={`${currentOrder.id}-${line.id}-${line.product.id}`}
                name={line.product.name}
                price={line.total_price}
                quantity={line.quantity}
                image={line.product.image}
                id={line.product.id}
                deleteItemFromCart={deleteItemFromCart}
                showQuantitySelector={showQuantitySelector}
                showPartialiSheduledTag={line.partially_scheduled}
                canSchedulePartially={isAdminOrCafe(user)}
              />
            );
          })}
      </div>
      {(!currentOrder || currentOrder.order_lines.length === 0) &&
      !isLoading ? (
        <div
          className="p-4 m-4 text-sm text-green-100 font-cera-bold rounded-lg bg-blue-50"
          role="alert"
        >
          <span className="font-medium">
            ¡Aún no has seleccionado ningun producto!
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="px-6 mb-1">
        {showPrices && currentOrder && currentOrder.order_lines.length > 0 && (
          <>
            <p className="flex justify-end justify-items-end items-center mb-0 mt-3 p-0">
              <span className="font-cera-bold text-3xl md:text-4xl text-white tracking-tighter text-nowrap mr-2">Total neto:</span>
              <span className="font-cera-bold text-3xl md:text-4xl text-white tracking-tighter text-nowrap">
                {currentOrder ? currentOrder?.total : "$0"}
              </span>
            </p>
            <p className="flex justify-end justify-items-end items-center mb-2 mt-0 p-0">
              <span className="font-cera-regular text-xl md:text-2xl text-white tracking-tighter text-nowrap mr-2">Total con IVA</span>
              <span className="font-cera-regular text-xl md:text-2xl text-white tracking-tighter text-nowrap">
                {currentOrder ? currentOrder?.total_with_tax : "$0"}
              </span>
            </p>
          </>
        )}
        <button
          className="bg-yellow-active font-cera-bold text-2xl md:text-3xl tracking-tighter py-3 text-white w-full rounded-lg disabled:bg-gray-300 mb-2"
          onClick={() => handleCheckout()}
        >
          Añadir comentarios
        </button>
        {currentOrder && currentOrder.order_lines.length > 0 && (
          <button
            className="bg-red-1000 font-cera-bold text-2xl md:text-3xl tracking-tighter py-3 text-white w-full rounded-lg disabled:bg-gray-300"
            onClick={() => handleCheckout()}
            disabled={currentOrder.status === ORDER_STATUS.PROCESSED}
          >
            Completar orden
          </button>
        )}
      </div>
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
    </aside>
  );
};
