import "./styles.css";
import { useContext } from "react";
import { CartItem } from "../CartItem";
import { useOrder } from "../../hooks/useCurrentOrder";
import { SpinnerLoading } from "../SpinnerLoading";
import { useAuth } from "../../hooks/useAuth";
import {
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_TEXT,
  CHECKOUT_SIDE_MENU_CLASS,
} from "../../config/constant";
import { ROUTES } from "../../config/routes";
import { isAdminOrCafe, isAgreementIndividual } from "../../helpers/permissions";
import MonkeyIcon from "../Icons/MonkeyIcon";
import CloseButton from "../Icons/CloseButton";
import TruckIcon from "../Icons/TruckIcon";
import { GlobalContext } from "../../context/globalContext";
import { ProductDetailContent } from "../ProductDetailContent";
import { LinkWithQueryParams } from "../LinkWithQueryParams";

export const CheckoutSideMenu = () => {
  const {
    currentOrder,
    isLoading,
    deleteItemFromCart,
    updateOrderStatus,
    showPrices,
    user,
    isAtCategoriesRoute,
    modalState,
    closeModal
  } = useOrder();

  const { showQuantitySelector } = useAuth();
  const { setShowModal } = useContext(GlobalContext);

  const handleCheckout = () => {
    updateOrderStatus(ORDER_STATUS.PROCESSED);
  };

  const handleAddComments = () => {
    setShowModal(true);
  };

  
  return (
    <aside
      className={`${
        modalState.isOpen && isAtCategoriesRoute() ? "flex" : "hidden"
      } ${CHECKOUT_SIDE_MENU_CLASS} flex-col fixed rounded-t-3xl z-50 bg-green-100`}
    >

      <CloseButton
        className="w-12 h-12 cursor-pointer z-10 absolute top-[-1.5rem] right-0"
        color="white"
        width="8"
        height="8"
        onClick={closeModal} 
      />

      {modalState.type === 'cart' && (
        <>
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
          <div 
            className="overflow-y-auto overflow-x-hidden px-3 md:px-4 lg:px-6 flex flex-col gap-y-5 md:gap-y-6 lg:gap-y-5 max-h-[19rem] md:max-h-[55%] xl:max-h-[90%] 2xl:max-h-[55%] pt-6 md:pt-5 lg:pt-6"
          >
            {currentOrder &&
              currentOrder.order_lines.map((line) => {
                if (!line.product) return null;
                return (
                  <CartItem
                    key={`${currentOrder.id}-${line.id}-${line.product.id}`}
                    name={line.product.name}
                    price={line.unit_price}
                    quantity={line.quantity}
                    image={line.product.image}
                    id={line.product.id}
                    deleteItemFromCart={deleteItemFromCart}
                    showQuantitySelector={showQuantitySelector}
                    showPartialiSheduledTag={line.partially_scheduled}
                    canSchedulePartially={isAdminOrCafe(user)}
                    subcategories={line.product?.category?.subcategories || []}
                    categoryName={line.product?.category?.name || ''}
                    showSubcategories={isAgreementIndividual(user)}
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
                  <span className="font-cera-bold text-2xl md:text-3xl lg:text-3xl text-white tracking-tighter text-nowrap mr-2">Total neto:</span>
                  <span className="font-cera-bold text-2xl md:text-3xl lg:text-3xl text-white tracking-tighter text-nowrap">
                    {currentOrder ? currentOrder?.total : "$0"}
                  </span>
                </p>
                {currentOrder?.dispatch_cost && currentOrder.dispatch_cost !== "$0" && currentOrder.dispatch_cost !== "0" && (
                  <p className="flex justify-end justify-items-end items-center mb-0 mt-0 p-0">
                    <span className="font-cera-regular text-lg md:text-xl lg:text-xl text-white tracking-tighter text-nowrap mr-2">Costo de despacho:</span>
                    <span className="font-cera-regular text-lg md:text-xl lg:text-xl text-white tracking-tighter text-nowrap">
                      {currentOrder.dispatch_cost}
                    </span>
                  </p>
                )}
                {currentOrder?.shipping_threshold?.has_better_rate && (
                  <p className="flex justify-end items-center mb-2 mt-1 p-2 bg-green-800 rounded-lg">
                    <TruckIcon 
                      className="w-4 h-4 mr-2 flex-shrink-0" 
                      color="white" 
                    />
                    <span className="font-cera-regular text-xs md:text-sm lg:text-sm text-white tracking-tighter text-right">
                      Estás a {currentOrder.shipping_threshold.amount_to_reach} de obtener envío por solo {currentOrder.shipping_threshold.next_threshold_cost}
                    </span>
                  </p>
                )}
                <p className="flex justify-end justify-items-end items-center mb-2 mt-0 p-0">
                  <span className="font-cera-regular text-lg md:text-xl lg:text-xl text-white tracking-tighter text-nowrap mr-2">Total con IVA</span>
                  <span className="font-cera-regular text-lg md:text-xl lg:text-xl text-white tracking-tighter text-nowrap">
                    {currentOrder ? currentOrder?.total_with_tax : "$0"}
                  </span>
                </p>
              </>
            )}
            {currentOrder && currentOrder.order_lines.length > 0 && (
              <>
                <button
                  className="bg-yellow-active font-cera-bold text-xl md:text-2xl lg:text-2xl tracking-tighter py-3 text-white w-full rounded-lg disabled:bg-gray-300 mb-2"
                  onClick={handleAddComments}
                >
                  {currentOrder.user_comment ? 'Actualizar comentarios' : 'Añadir comentarios'}
                </button>
                {currentOrder.status !== ORDER_STATUS.PROCESSED ? (
                  <button
                    className="bg-red-1000 font-cera-bold text-xl md:text-2xl lg:text-2xl tracking-tighter py-3 text-white w-full rounded-lg disabled:bg-gray-300"
                    onClick={() => handleCheckout()}
                  >
                    Completar orden
                  </button>
                ) : (
                  <LinkWithQueryParams
                    to={`/${ROUTES.GET_ORDER_SUMMARY_ROUTE(currentOrder.id)}`}
                    className="bg-blue-600 font-cera-bold text-xl md:text-2xl lg:text-2xl tracking-tighter py-3 text-white w-full rounded-lg text-center block no-underline hover:bg-blue-700"
                  >
                    Detalle de pedido
                  </LinkWithQueryParams>
                )}
              </>
            )}
          </div>
          <div className="flex justify-center m-4">
            <SpinnerLoading show={isLoading} size={8} />
          </div>
        </>
      )}

      {modalState.type === 'productDetail' && modalState.selectedProduct && (
        <ProductDetailContent 
          product={modalState.selectedProduct}
        />
      )}
    </aside>
  );
};
