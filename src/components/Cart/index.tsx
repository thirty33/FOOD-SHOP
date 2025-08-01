import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { QuantitySelector } from "../QuantitySelector";
import { useQuantityChange } from "../../hooks/useQuantityChange";
import { ORDER_STATUS, ORDER_STATUS_TEXT } from "../../config/constant";
import XIcon from "../../components/Icons/XIcon";
import { configuration } from "../../config/config";
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
        <img
          className="h-full w-full rounded-md object-cover"
          src={image ?? configuration.product.image}
          alt={name}
        />
      </div>

      {/* Product Details */}
      <div 
        className="flex flex-col flex-1 min-w-0"
      >
        <div 
          className="flex flex-col gap-y-0.5 md:gap-y-1.5 lg:gap-y-2 items-start justify-between w-full"
        >
          <h3 
            className="text-xs md:text-xl lg:text-sm text-wrap text-green-100 font-cera-bold tracking-tighter leading-3 md:leading-tight w-full break-words"
          >
            {(() => {
              return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            })()}
          </h3>
          {showPrices && (
            <p 
              className="text-sm md:text-xl lg:text-base text-green-100 font-cera-regular tracking-tighter leading-4 md:leading-4 truncate"
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

export const Cart = (): JSX.Element => {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Carrito de Compras
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6"></div>
            <div className="hidden xl:mt-8 xl:block">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                La gente también compró
              </h3>
              <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <a href="#" className="overflow-hidden rounded">
                    <img
                      className="mx-auto h-44 w-44 dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                      alt="imac image"
                    />
                    <img
                      className="mx-auto hidden h-44 w-44 dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                      alt="imac image"
                    />
                  </a>
                  <div>
                    <a
                      href="#"
                      className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                    >
                      iMac 27”
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      This generation has some improvements, including a longer
                      continuous battery life.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      <span className="line-through"> $399,99 </span>
                    </p>
                    <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                      $299
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2.5">
                    <button
                      data-tooltip-target="favourites-tooltip-1"
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                        />
                      </svg>
                    </button>
                    <div
                      id="favourites-tooltip-1"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                    >
                      Add to favourites
                      <div className="tooltip-arrow" data-popper-arrow="" />
                    </div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        className="-ms-2 me-2 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Add to cart
                    </button>
                  </div>
                </div>
                <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <a href="#" className="overflow-hidden rounded">
                    <img
                      className="mx-auto h-44 w-44 dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg"
                      alt="imac image"
                    />
                    <img
                      className="mx-auto hidden h-44 w-44 dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg"
                      alt="imac image"
                    />
                  </a>
                  <div>
                    <a
                      href="#"
                      className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                    >
                      Playstation 5
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      This generation has some improvements, including a longer
                      continuous battery life.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      <span className="line-through"> $799,99 </span>
                    </p>
                    <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                      $499
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2.5">
                    <button
                      data-tooltip-target="favourites-tooltip-2"
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                        />
                      </svg>
                    </button>
                    <div
                      id="favourites-tooltip-2"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                    >
                      Add to favourites
                      <div className="tooltip-arrow" data-popper-arrow="" />
                    </div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        className="-ms-2 me-2 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Add to cart
                    </button>
                  </div>
                </div>
                <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <a href="#" className="overflow-hidden rounded">
                    <img
                      className="mx-auto h-44 w-44 dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg"
                      alt="imac image"
                    />
                    <img
                      className="mx-auto hidden h-44 w-44 dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
                      alt="imac image"
                    />
                  </a>
                  <div>
                    <a
                      href="#"
                      className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                    >
                      Apple Watch Series 8
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      This generation has some improvements, including a longer
                      continuous battery life.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      <span className="line-through"> $1799,99 </span>
                    </p>
                    <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                      $1199
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2.5">
                    <button
                      data-tooltip-target="favourites-tooltip-3"
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                        />
                      </svg>
                    </button>
                    <div
                      id="favourites-tooltip-3"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                    >
                      Add to favourites
                      <div className="tooltip-arrow" data-popper-arrow="" />
                    </div>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        className="-ms-2 me-2 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Resumen del pedido
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Precio original
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $7,592.00
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Ahorros
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      -$299.00
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Recogida en tienda
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $99
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Impuestos
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      $799
                    </dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    $8,191.00
                  </dd>
                </dl>
              </div>
              <Link
                to={`/${ROUTES.CHECKOUT_ROUTE}`}
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Proceder al pago
              </Link>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {" "}
                  o{" "}
                </span>
                <a
                  href="#"
                  title=""
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                >
                  Continuar comprando
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </a>
              </div>
            </div>
            {/* <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
                    Do you have a voucher or gift card?{" "}
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder=""
                    required=""
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Apply Code
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartItem;
