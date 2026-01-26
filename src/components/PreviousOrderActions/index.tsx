import React, { useState, useEffect, useContext } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { useQueryParams } from '../../hooks/useQueryParams';
import { usePreviousOrder } from '../../hooks/usePreviousOrder';
import { usePreviousOrderItems, PreviousOrderItem } from '../../hooks/usePreviousOrderItems';
import { useLoadOrderItems } from '../../hooks/useLoadOrderItems';
import { PreviousOrderModal } from '../PreviousOrderModal';
import { OrderContext } from '../../context/orderContext';
import { orderService } from '../../services/order';
import { SuccessResponse } from '../../types/order';

const InfoIcon: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-state text-green-100 text-xs font-cera-bold hover:bg-green-100 hover:text-white transition-colors"
    aria-label="Informacion"
  >
    ?
  </button>
);

export const PreviousOrderActions: React.FC = () => {
  const { enqueueSnackbar } = useNotification();
  const queryParams = useQueryParams(['date', 'delegate_user']);
  const { setCurrentOrder } = useContext(OrderContext);
  const { previousOrder, isLoading, error, fetchPreviousOrder, clearPreviousOrder } = usePreviousOrder();
  const {
    items,
    initializeItems,
    updateItemQuantity,
    clearItems,
    getItemError,
    setItemLoading,
    setItemSuccess,
    setItemError,
    getItemStatus,
  } = usePreviousOrderItems();
  const { isLoading: isLoadingItems, loadItems } = useLoadOrderItems();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (previousOrder) {
      initializeItems(previousOrder);
    }
  }, [previousOrder, initializeItems]);

  const handleRepeatOrder = () => {
    // TODO: Implement repeat order logic with modal
    console.log('Repetir pedido clicked');
  };

  const handleViewPreviousOrder = () => {
    const date = queryParams.date;
    if (!date) {
      enqueueSnackbar('No se pudo obtener la fecha del menu', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    setIsModalOpen(true);
    fetchPreviousOrder(date);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearPreviousOrder();
    clearItems();
  };

  const handleLoadOrder = async (orderItems: PreviousOrderItem[]) => {
    const date = queryParams.date;
    if (!date) {
      enqueueSnackbar('No se pudo obtener la fecha del menu', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    await loadItems(orderItems, date, queryParams, {
      onItemLoading: (productId) => setItemLoading(productId, true),
      onItemSuccess: (productId) => setItemSuccess(productId),
      onItemError: (productId, errorMessage) => setItemError(productId, errorMessage),
      onComplete: async () => {
        try {
          const response = await orderService.get(date, queryParams) as SuccessResponse;
          setCurrentOrder(response.data);
        } catch (err) {
          console.error('Error refreshing order:', err);
        }
      },
    });
  };

  const showRepeatInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    enqueueSnackbar('Carga los productos de tu ultimo pedido directamente al carrito actual', {
      variant: 'info',
      autoHideDuration: 4000,
    });
  };

  const showViewInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    enqueueSnackbar('Revisa los productos que pediste en tu orden anterior antes de agregarlos', {
      variant: 'info',
      autoHideDuration: 4000,
    });
  };

  return (
    <>
      <div className="w-full bg-white py-4 px-4">
        <div className="flex gap-3 justify-center items-center">
          <div className="flex items-center gap-1">
            <button
              onClick={handleRepeatOrder}
              className="py-3 px-4 bg-green-50 text-green-100 font-cera-medium text-sm rounded-full hover:bg-yellow-active hover:text-white transition-colors"
            >
              Repetir pedido
            </button>
            <InfoIcon onClick={showRepeatInfo} />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleViewPreviousOrder}
              className="py-3 px-4 bg-white text-green-100 font-cera-medium text-sm rounded-full border-2 border-green-100 hover:bg-green-100 hover:text-white transition-colors"
            >
              Ver ultimo pedido
            </button>
            <InfoIcon onClick={showViewInfo} />
          </div>
        </div>
      </div>

      <PreviousOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        previousOrder={previousOrder}
        isLoading={isLoading}
        error={error}
        items={items}
        onQuantityChange={updateItemQuantity}
        getItemError={getItemError}
        getItemStatus={getItemStatus}
        onLoadOrder={handleLoadOrder}
        isLoadingItems={isLoadingItems}
      />
    </>
  );
};
