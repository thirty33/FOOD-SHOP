import React from 'react';
import { OrderData, OrderLine } from '../../types/order';
import { SpinnerLoading } from '../SpinnerLoading';
import CloseButton from '../Icons/CloseButton';
import { QuantitySelector } from '../QuantitySelector';
import { PreviousOrderItem as PreviousOrderItemType } from '../../hooks/usePreviousOrderItems';

interface PreviousOrderItemProps {
  line: OrderLine;
  onQuantityChange: (productId: number, quantity: number) => void;
  quantity: number;
  error: { show: boolean; message: string };
  status: { isSuccess: boolean; isLoading: boolean };
}

const PreviousOrderItem: React.FC<PreviousOrderItemProps> = ({ line, onQuantityChange, quantity, error, status }) => {
  const product = line.product;
  if (!product) return null;

  const productName = product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      onQuantityChange(product.id, value);
    }
  };

  const addOneItem = () => {
    onQuantityChange(product.id, quantity + 1);
  };

  const restOneItem = () => {
    if (quantity > 1) {
      onQuantityChange(product.id, quantity - 1);
    }
  };

  return (
    <div className={`flex items-center gap-2 rounded-lg border bg-white p-2 shadow-sm ${status.isSuccess ? 'border-green-500' : 'border-gray-200'}`}>
      <div className="h-16 w-16 flex-shrink-0 relative">
        {status.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-md">
            <SpinnerLoading show={true} size={4} />
          </div>
        )}
        {product.image ? (
          <img
            className="h-full w-full rounded-md object-cover"
            src={product.image}
            alt={productName}
          />
        ) : (
          <div
            className="h-full w-full rounded-md flex items-center justify-center text-center p-1"
            style={{ backgroundColor: '#E6E6E6' }}
          >
            <span
              className="text-[10px] font-cera-bold leading-tight"
              style={{ color: '#CCCCCC' }}
            >
              Sin imagen
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs text-green-100 font-cera-bold tracking-tighter leading-tight truncate">
          {productName}
        </h3>
        <div className="mt-1">
          <QuantitySelector
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
            addOneItem={addOneItem}
            restOneItem={restOneItem}
          />
        </div>
        {status.isSuccess && (
          <p className="text-xs text-green-600 font-cera-light mt-1">
            Agregado exitosamente
          </p>
        )}
        {error.show && (
          <p className="text-xs text-red-500 font-cera-light mt-1">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

interface PreviousOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousOrder: OrderData | null;
  isLoading: boolean;
  error: string | null;
  items: PreviousOrderItemType[];
  onQuantityChange: (productId: number, quantity: number) => void;
  getItemError: (productId: number) => { show: boolean; message: string };
  getItemStatus: (productId: number) => { isSuccess: boolean; isLoading: boolean };
  onLoadOrder?: (items: PreviousOrderItemType[]) => void;
  isLoadingItems?: boolean;
}

export const PreviousOrderModal: React.FC<PreviousOrderModalProps> = ({
  isOpen,
  onClose,
  previousOrder,
  isLoading,
  error,
  items,
  onQuantityChange,
  getItemError,
  getItemStatus,
  onLoadOrder,
  isLoadingItems = false,
}) => {
  if (!isOpen) return null;

  const hasProducts = previousOrder && previousOrder.order_lines && previousOrder.order_lines.length > 0;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      const formatter = new Intl.DateTimeFormat('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      return formatter.format(date);
    } catch {
      return dateString;
    }
  };

  const getItemQuantity = (productId: number): number => {
    const item = items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const handleLoadOrder = () => {
    if (!onLoadOrder || items.length === 0 || isLoadingItems) return;
    onLoadOrder(items);
  };

  return (
    <div
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative p-4 w-full max-w-md max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-xl shadow-lg bg-white">
          <CloseButton
            className="w-8 h-8 cursor-pointer absolute top-[-1rem] right-0"
            size="32"
            onClick={onClose}
          />

          <div className="p-4">
            <h2 className="font-cera-bold text-xl text-green-100 tracking-tight mb-1">
              Tu pedido anterior
            </h2>
            {previousOrder && (
              <p className="text-sm text-gray-500 font-cera-light mb-4">
                {formatDate(previousOrder.dispatch_date)}
              </p>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <SpinnerLoading show={true} size={8} />
              </div>
            )}

            {!isLoading && error === 'not_found' && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-cera-light text-sm">
                  No tienes pedidos anteriores
                </p>
              </div>
            )}

            {!isLoading && !error && !hasProducts && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-cera-light text-sm">
                  No hay productos en tu pedido anterior
                </p>
              </div>
            )}

            {!isLoading && !error && hasProducts && (
              <>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4">
                  {previousOrder.order_lines
                    .filter((line) => line.product && Number(line.quantity) > 0)
                    .map((line) => (
                      <PreviousOrderItem
                        key={`prev-${line.id}-${line.product_id}`}
                        line={line}
                        onQuantityChange={onQuantityChange}
                        quantity={getItemQuantity(line.product!.id)}
                        error={getItemError(line.product!.id)}
                        status={getItemStatus(line.product!.id)}
                      />
                    ))}
                </div>

                <button
                  onClick={handleLoadOrder}
                  disabled={isLoadingItems}
                  className={`w-full py-3 text-white font-cera-bold text-base rounded-lg transition-colors ${
                    isLoadingItems
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-100 hover:bg-yellow-active'
                  }`}
                >
                  {isLoadingItems ? 'Cargando...' : 'Cargar pedido'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};