import { Link } from "react-router-dom";
import {
  ORDER_STATUS_TEXT,
  ORDER_STATUS_COLOR,
  ORDER_STATUS,
} from "../../../config/constant";
import { OrderData } from "../../../types/order";
import { SpinnerLoading } from "../../SpinnerLoading";
import { ROUTES } from "../../../config/routes";

interface OrderLinesProps {
  orders: OrderData[] | null;
  isLoading: boolean;
  showTotalPrice: boolean;
}

export const OrderLines = ({
  orders,
  isLoading,
  showTotalPrice,
}: OrderLinesProps) => {
  return (
    <>
      <div className="mt-6 flow-root sm:mt-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {orders &&
            orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center gap-y-4 py-6"
              >
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Fecha de creación:
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    <a href="#" className="hover:underline">
                      {order.created_date}
                    </a>
                  </dd>
                </dl>
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Fecha de despacho:
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                    {order.dispatch_date}
                  </dd>
                </dl>
                {showTotalPrice && (
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                      Total:
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                      {order.total_with_tax}
                    </dd>
                  </dl>
                )}
                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                  <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                    Estado:
                  </dt>
                  <dd
                    className={`me-2 mt-1.5 inline-flex items-center rounded ${
                      ORDER_STATUS_COLOR[order.status]
                    } px-2.5 py-0.5 text-xs font-medium text-white dark:bg-primary-900 dark:text-primary-300`}
                  >
                    <svg
                      className="me-1 h-3 w-3"
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
                        d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                      />
                    </svg>
                    {ORDER_STATUS_TEXT[order.status]}
                  </dd>
                </dl>
                <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                  <>
                    {order.menu && [ORDER_STATUS.PARTIALLY_SCHEDULED, ORDER_STATUS.PENDING].includes(
                      order.status as "PARTIALLY_SCHEDULED" | "PENDING"
                    ) && (
                      <Link
                        to={{
                          pathname: `/${ROUTES.GET_CATEGORY_ROUTE(
                            order?.menu?.id
                          )}`,
                          search: `?date=${order?.menu?.publication_date}`,
                        }}
                        type="button"
                        className="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
                      >
                        Retomar Orden
                      </Link>
                    )}

                    {[ORDER_STATUS.CANCELED, ORDER_STATUS.PROCESSED, ORDER_STATUS.PARTIALLY_SCHEDULED].includes(
                      order.status as "CANCELED" | "PROCESSED" | "PARTIALLY_SCHEDULED"
                    ) && (
                      <Link
                        to={{
                          pathname: `/${ROUTES.GET_ORDER_SUMMARY_ROUTE(
                            order.id
                          )}`,
                        }}
                        className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                      >
                        Ver Detalle
                      </Link>
                    )}
                  </>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center m-4">
          <SpinnerLoading show={isLoading} size={8} />
        </div>
      </div>
    </>
  );
};
