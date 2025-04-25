import { useGetOrderById } from "../../hooks/useGetOrderById";
import { SpinnerLoading } from "../../components/SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from "../../config/constant";
import { configuration } from "../../config/config";
import { isAdminOrCafe } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";

export const OrderSummary = (): JSX.Element => {
  const { order, isLoading } = useGetOrderById();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canViewPrices = isAdminOrCafe(user);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          No se encontró el pedido
        </h2>
        <Link
          to="/"
          className="mt-4 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Detalle del pedido #{order.id}
            </h2>
            <div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información sobre pedido
              </h4>
              <dl>
                <dt className="text-base font-medium text-gray-900 dark:text-white">
                  Estado
                </dt>
                <dd className="mt-1.5">
                  <span
                    className={`me-2 inline-flex items-center rounded ${
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
                  </span>
                </dd>
              </dl>
              <dl>
                <dt className="text-base font-medium text-gray-900 dark:text-white">
                  Fecha de despacho
                </dt>
                <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                  {order.dispatch_date}
                </dd>
              </dl>
              <dl>
                <dt className="text-base font-medium text-gray-900 dark:text-white">
                  Fecha de creación
                </dt>
                <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                  {order.created_date}
                </dd>
              </dl>
              {order.address && (
                <dl>
                  <dt className="text-base font-medium text-gray-900 dark:text-white">
                    Dirección de despacho
                  </dt>
                  <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                    {order.address}
                  </dd>
                </dl>
              )}
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {order.order_lines.map((line) => (
                      <tr key={line.id}>
                        <td className="whitespace-nowrap py-4 md:w-[384px]">
                          <div className="flex items-center gap-4">
                            <div>
                              <a
                                href="#"
                                className="flex items-center aspect-square w-10 h-10 shrink-0"
                              >
                                <img
                                  className="h-full w-full object-cover"
                                  src={
                                    line?.product?.image ??
                                    configuration.product.image
                                  }
                                  alt={line?.product?.name ?? "product_image"}
                                />
                              </a>
                            </div>

                            <span className="hover:underline">
                              {line.product?.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-base font-normal text-gray-900 dark:text-white">
                          x{line.quantity}
                        </td>
                        {canViewPrices && (
                          <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                            {line.total_price}
                            <div className="text-xs text-gray-500">
                              Con imp: {line.total_price_with_tax}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {canViewPrices && (
                <div className="mt-4 space-y-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Resumen del pedido
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                          Total
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          {order.total}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                          Total con impuestos
                        </dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                          {order.total_with_tax}
                        </dd>
                      </dl>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </dt>
                      <dd className="text-lg font-bold text-gray-900 dark:text-white">
                        {order.total_with_tax}
                      </dd>
                    </dl>
                  </div>
                </div>
              )}
              <div className="gap-4 sm:flex sm:items-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                >
                  Regresar a los pedidos
                </button>
                <Link
                  to="/"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0"
                >
                  Ir al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};