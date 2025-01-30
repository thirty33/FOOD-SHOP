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

export const CheckoutSideMenu = () => {
  const {
    currentOrder,
    isLoading,
    deleteItemFromCart,
    showSideCart,
    setShowSideCart,
    updateOrderStatus,
    showPrices,
    partiallyScheduleOrder,
    user,
  } = useOrder();

  const { showQuantitySelector } = useAuth();

  const handleCheckout = () => {
    updateOrderStatus(ORDER_STATUS.PROCESSED);
  };

  const handlePartiallyScheduled = () => {
    console.log("handlePartiallyScheduled");
    partiallyScheduleOrder(ORDER_STATUS.PARTIALLY_SCHEDULED);
  };

  return (
    <aside
      className={`${
        showSideCart ? "flex" : "hidden"
      } checkout-side-menu flex-col fixed right-0 border border-black rounded-lg bg-white z-50`}
    >
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center px-4 pt-4 pb-2">
          <h2 className="font-bold text-2xl">Mi Orden.</h2>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => setShowSideCart(!showSideCart)}
          ></XMarkIcon>
        </div>
        {currentOrder && (
          <div className="flex flex-row justify-between items-center px-4 pb-2">
            <h3>
              Estado:{" "}
              <span
                className={`${
                  ORDER_STATUS_COLOR[currentOrder?.status]
                } text-white px-2 py-1 rounded`}
              >
                {currentOrder ? ORDER_STATUS_TEXT[currentOrder.status] : "N/A"}
              </span>
            </h3>
          </div>
        )}
      </div>
      <div className="px-6 overflow-y-scroll flex flex-col gap-y-4 ">
        {currentOrder &&
          currentOrder.order_lines.map((line) => (
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
          ))}
      </div>
      {(!currentOrder || currentOrder.order_lines.length === 0) &&
      !isLoading ? (
        <div
          className="p-4 m-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <span className="font-medium">
            No hay orden disponible para el día de hoy!
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
      <div className="px-6 mb-6">
        {showPrices && (
          <p className="flex justify-between items-center mb-2 p-4">
            <span className="font-bold text-2xl">Total:</span>
            <span className="font-medium text-2xl">
              {currentOrder ? currentOrder?.total : "$0"}
            </span>
          </p>
        )}
        {/* {user &&
          isAdminOrCafe(user) &&
          currentOrder &&
          currentOrder.order_lines.length > 0 && (
            <button
              className="bg-black py-3 text-white w-full rounded-lg mb-4 disabled:bg-gray-300"
              onClick={() => handlePartiallyScheduled()}
              disabled={
                currentOrder.status === ORDER_STATUS.PARTIALLY_SCHEDULED
              }
            >
              Agendar Parcialmente
            </button>
          )} */}
        {currentOrder && currentOrder.order_lines.length > 0 && (
          <button
            className="bg-black py-3 text-white w-full rounded-lg disabled:bg-gray-300"
            onClick={() => handleCheckout()}
            disabled={currentOrder.status === ORDER_STATUS.PROCESSED}
          >
            Completar Orden
          </button>
        )}
      </div>
    </aside>
  );
};
