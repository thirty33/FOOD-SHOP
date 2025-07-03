import { Link } from "react-router-dom";
import {
  ORDER_STATUS_TEXT,
  ORDER_STATUS_COLOR,
  ORDER_STATUS,
} from "../../../config/constant";
import { OrderData } from "../../../types/order";
import { SpinnerLoading } from "../../SpinnerLoading";
import { ROUTES } from "../../../config/routes";
import { truncateString } from "../../../helpers/texts";

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
        <div className="divide-y divide-text-info-400 dark:divide-gray-700">
          {orders &&
            orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-12 lg:grid-cols-10 gap-y-4 gap-x-2 py-6"
              >
                <dl className=" col-span-6 lg:col-span-2">
                  <dt className="text-lg md:text-2xl lg:text-3xl tracking-tight font-cera-bold text-green-100">
                    Creación
                  </dt>
                  <dd className="mt-1.5 text-sm md:text-lg lg:text-xl font-cera-light text-green-100">
                    <a href="#" className="hover:underline">
                      {order.created_date}
                    </a>
                  </dd>
                </dl>
                <dl className=" col-span-6 lg:col-span-2">
                  <dt className="text-lg md:text-2xl lg:text-3xl tracking-tight font-cera-bold text-green-100">
                    Despacho
                  </dt>
                  <dd className="mt-1.5 text-sm md:text-lg lg:text-xl font-cera-light text-green-100">
                    {order.dispatch_date}
                  </dd>
                </dl>
                {showTotalPrice && (
                  <dl className=" col-span-2 lg:col-span-1">
                    <dt className="text-lg md:text-2xl lg:text-3xl tracking-tight font-cera-bold text-green-100">
                      Neto:
                    </dt>
                    <dd className="mt-1.5 text-xs md:text-lg lg:text-xl font-cera-light text-green-100">
                      {order.total}
                    </dd>
                  </dl>
                )}
                {showTotalPrice && (
                  <dl className=" col-span-2 lg:col-span-1">
                    <dt className="text-lg md:text-2xl lg:text-3xl tracking-tight font-cera-bold text-green-100">
                      Total:
                    </dt>
                    <dd className="mt-1.5 text-xs md:text-lg lg:text-xl font-cera-light text-green-100">
                      {order.total_with_tax}
                    </dd>
                  </dl>
                )}
                <dl className="col-span-5 lg:col-span-2">
                  <dt className="text-lg md:text-2xl lg:text-3xl tracking-tight font-cera-bold text-green-100 flex justify-center justify-items-center items-center content-center">
                    Estado:
                  </dt>
                  <dd
                    className={`me-2 mt-2 flex items-center justify-center justify-items-center rounded ${
                      ORDER_STATUS_COLOR[order.status]
                    } px-0 py-0.5 text-xs md:text-base lg:text-lg font-cera-bold tracking-tight ${
                      order.status === ORDER_STATUS.PARTIALLY_SCHEDULED ? 'text-gray-text-state' : 'text-white'
                    } text-nowrap text-center`}
                  >
                    {truncateString(ORDER_STATUS_TEXT[order.status], 12)}
                  </dd>
                </dl>
                <div className="grid grid-cols-1 grid-rows-2 px-0 col-span-3 lg:col-span-2 gap-y-2">
                  <>
                    {[
                      ORDER_STATUS.CANCELED,
                      ORDER_STATUS.PROCESSED,
                      ORDER_STATUS.PARTIALLY_SCHEDULED,
                    ].includes(
                      order.status as
                        | "CANCELED"
                        | "PROCESSED"
                        | "PARTIALLY_SCHEDULED"
                    ) && (
                      <Link
                        to={{
                          pathname: `/${ROUTES.GET_ORDER_SUMMARY_ROUTE(
                            order.id
                          )}`,
                        }}
                        className="row-start-1 row-end-1 py-1 border flex justify-center items-center font-cera-regular text-gray-text-state text-md md:text-xl lg:text-2xl tracking-tighter rounded-sm"
                      >
                        Ver detalle
                      </Link>
                    )}

                    {order.menu &&
                      [
                        ORDER_STATUS.PARTIALLY_SCHEDULED,
                        ORDER_STATUS.PENDING,
                      ].includes(
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
                          className="py-1 bg-red-1000 border flex justify-center items-center font-cera-regular text-white text-md md:text-xl lg:text-2xl tracking-tighter rounded-sm"
                        >
                          Retomar
                        </Link>
                      )}
                  </>
                </div>
              </div>
            ))}
        </div>
        {orders && orders.length === 0 && !isLoading && (
          <div
            className="p-4 mb-4 text-sm text-green-100 rounded-lg bg-blue-50 flex justify-center"
            role="alert"
          >
            <span className="font-medium text-green-100 text-sm md:text-lg lg:text-xl">No hay órdenes disponibles!</span>
          </div>
        )}
        <div className="flex justify-center m-4">
          <SpinnerLoading show={isLoading} size={8} />
        </div>
      </div>
    </>
  );
};
