import { useGetOrderById } from "../../hooks/useGetOrderById";
import { SpinnerLoading } from "../../components/SpinnerLoading";
import { Link, useNavigate } from "react-router-dom";
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from "../../config/constant";
import { configuration } from "../../config/config";
import { isAdminOrCafe } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";
import CloseButton from "../Icons/CloseButton";
import { ROUTES } from "../../config/routes";

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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tighter">
          No se encontró el pedido
        </h2>
        <Link
          to="/"
          className="mt-4 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 tracking-tighter"
        >
          Ir al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="antialiased px-5 lg:px-0">
        <div className="mx-auto max-w-screen-xl 2xl:px-0 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-state md:border-2 shadow-sm p-6 md:px-8 md:py-8 mb-6 relative">
              <CloseButton
                className="absolute top-[-1rem] right-[-1rem] w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                size="32"
                onClick={() => navigate(`/${ROUTES.GET_ORDERS_ROUTE}`)}
              />
              <h2 className="text-4xl md:text-5xl tracking-tighter text-nowrap font-cera-bold text-green-100 mb-3 pr-12 md:px-4">
                Detalle del pedido
              </h2>
              
              <div className="mb-2 md:grid md:grid-cols-3 md:gap-6 md:mb-6 md:px-4">
                <div>
                  <h4 className="text-lg md:text-xl font-cera-medium text-green-100 mb-0 tracking-tighter">
                    Despacho
                  </h4>
                  <p className="text-base md:text-lg font-cera-regular text-green-100 lowercase tracking-tighter">
                    {order.dispatch_date}
                  </p>
                </div>
                
                <div className="mb-2 md:mb-0">
                  <h4 className="text-lg md:text-xl font-cera-medium text-green-100 mb-0 tracking-tighter">
                    Dirección
                  </h4>
                  <p className="text-base md:text-lg font-cera-regular text-green-100 lowercase tracking-tighter">
                    {order.address}
                  </p>
                </div>
                
                <div className="mb-3 md:mb-0">
                  <h4 className="text-lg md:text-xl font-cera-medium text-green-100 mb-0 tracking-tighter">
                    Estado
                  </h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm md:text-base font-cera-medium ${ORDER_STATUS_COLOR[order.status]} text-white tracking-tighter`}>
                    {ORDER_STATUS_TEXT[order.status]}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-state pt-4">
                {/* Headers for md+ only */}
                <div className="hidden md:grid md:grid-cols-12 md:gap-2 md:mb-4 md:px-4">
                  <div className="md:col-span-8">
                    {/* No header for product column */}
                  </div>
                  <div className="md:col-span-2 md:text-center">
                    <span className="text-xl font-cera-bold text-green-100 tracking-tighter">Cantidades</span>
                  </div>
                  <div className="md:col-span-2 md:text-center">
                    <span className="text-xl font-cera-bold text-green-100 tracking-tighter">Neto</span>
                  </div>
                </div>
                {order.order_lines.map((line, index) => (
                  <div key={line.id} className="md:grid md:grid-cols-12 md:gap-2 md:items-center md:mb-4 md:px-4">
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <div className="bg-white rounded-lg border border-gray-state p-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-16 md:h-16 md:w-20 lg:h-20 lg:w-24 object-cover rounded-lg"
                              src={line?.product?.image ?? configuration.product.image}
                              alt={line?.product?.name ?? "product_image"} 
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h5 className="text-lg font-cera-bold text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 text-wrap break-words">
                              {line.product?.name ? line.product.name.charAt(0).toUpperCase() + line.product.name.slice(1).toLowerCase() : ''}
                            </h5>
                            <p className="text-sm font-cera-medium text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 text-wrap break-words">
                              Ingredientes
                            </p>
                            <p className="text-xs font-cera-light text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 text-wrap break-words">
                              {line.product?.ingredients?.map((ing, index) => {
                                const formattedText = ing.descriptive_text.charAt(0).toUpperCase() + ing.descriptive_text.slice(1).toLowerCase();
                                return `${formattedText}${index < (line.product?.ingredients?.length ?? 0) - 1 ? ', ' : '.'}`;
                              }).join('')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-4 mb-6">
                        <div className="col-span-4 flex items-center">
                          <span className="text-sm font-cera-bold text-green-100 tracking-tighter">
                            Cantidades
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center justify-center">
                          <span className="inline-flex items-center justify-center w-full h-6 border border-gray-state text-green-100 text-md font-cera-bold rounded tracking-tighter">
                            {line.quantity}
                          </span>
                        </div>
                        <div className="col-span-2"></div>
                        {canViewPrices && (
                          <div className="col-span-3 flex items-center justify-end gap-3">
                            <span className="text-sm font-cera-bold text-green-100 tracking-tighter">
                              Neto
                            </span>
                            <span className="text-md font-cera-regular text-green-100 tracking-tighter">
                              {line.total_price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Desktop layout */}
                    <div className="hidden md:contents">
                      <div className="md:col-span-8 md:pr-4">
                        <div className="bg-white rounded-lg md:rounded-2xl border border-gray-state p-4 w-full max-w-md">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <img
                                className="h-14 w-28 md:h-20 md:w-32 lg:h-24 lg:w-36 object-cover rounded-lg md:rounded-2xl"
                                src={line?.product?.image ?? configuration.product.image}
                                alt={line?.product?.name ?? "product_image"} 
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                              <h5 className="text-xl font-cera-bold text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 break-words overflow-hidden">
                                {line.product?.name ? line.product.name.charAt(0).toUpperCase() + line.product.name.slice(1).toLowerCase() : ''}
                              </h5>
                              <p className="text-base font-cera-medium text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 break-words overflow-hidden">
                                Ingredientes
                              </p>
                              <p className="text-sm font-cera-light text-green-100 tracking-tighter leading-tight md:leading-snug lg:leading-normal mb-0 break-words overflow-hidden">
                                {line.product?.ingredients?.map((ing, index) => {
                                  const formattedText = ing.descriptive_text.charAt(0).toUpperCase() + ing.descriptive_text.slice(1).toLowerCase();
                                  return `${formattedText}${index < (line.product?.ingredients?.length ?? 0) - 1 ? ', ' : '.'}`;
                                }).join('')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 md:text-center">
                        <span className="inline-flex items-center justify-center w-16 h-10 border border-gray-state text-green-100 text-xl font-cera-bold rounded tracking-tighter">
                          {line.quantity}
                        </span>
                      </div>
                      {canViewPrices && (
                        <div className="md:col-span-2 md:text-center">
                          <span className="text-xl font-cera-regular text-green-100 tracking-tighter">
                            {line.total_price}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {index < order.order_lines.length - 1 && (
                      <div className="border-t border-gray-state mb-6 md:hidden"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {canViewPrices && (
                <div className="mt-6 md:px-4 md:border-t md:border-gray-state md:pt-6">
                  <h4 className="text-xl font-cera-bold text-green-100 mb-0 tracking-tighter md:text-center">
                    Resumen del pedido
                  </h4>
                  <div className="space-y-0">
                    <div className="flex justify-between items-center">
                      <span className="text-base md:text-lg font-cera-regular text-green-100 tracking-tighter">Total Neto</span>
                      <div className="flex justify-start w-24">
                        <span className="text-lg md:text-xl font-cera-bold text-green-100 tracking-tighter">{order.total}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base md:text-lg font-cera-regular text-green-100 tracking-tighter">IVA 19%</span>
                      <div className="flex justify-start w-24">
                        <span className="text-lg md:text-xl font-cera-bold text-green-100 tracking-tighter">
                          {(parseFloat(String(order.total_with_tax).replace('$', '').replace('.', '')) - parseFloat(String(order.total).replace('$', '').replace('.', ''))).toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-state pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-cera-bold text-green-100 tracking-tighter">Total</span>
                        <div className="flex justify-start w-24">
                          <span className="text-lg md:text-xl font-cera-bold text-green-100 tracking-tighter">{order.total_with_tax}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
};