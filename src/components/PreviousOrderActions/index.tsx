import React, { useState, useEffect, useContext } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { useQueryParams } from '../../hooks/useQueryParams';
import { usePreviousOrder } from '../../hooks/usePreviousOrder';
import { usePreviousOrderItems, PreviousOrderItem } from '../../hooks/usePreviousOrderItems';
import { useLoadOrderItems, LoadItemResult } from '../../hooks/useLoadOrderItems';
import { PreviousOrderModal } from '../PreviousOrderModal';
import { CompactPreviousOrderButtons } from '../CompactPreviousOrderButtons';
import { OrderContext } from '../../context/orderContext';
import { GlobalContext } from '../../context/globalContext';
import { orderService } from '../../services/order';
import { SuccessResponse } from '../../types/order';
import { ORDER_STATUS } from '../../config/constant';

const InfoIcon: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-state text-green-100 text-xs font-cera-bold hover:bg-green-100 hover:text-white transition-colors"
    aria-label="Informacion"
  >
    ?
  </button>
);

interface PreviousOrderActionsProps {
  date?: string;
  compact?: boolean;
  delegateUser?: string;
  onOrderConfirmed?: (date: string) => void;
}

export const PreviousOrderActions: React.FC<PreviousOrderActionsProps> = ({ date: dateProp, compact = false, delegateUser, onOrderConfirmed }) => {
  const { enqueueSnackbar } = useNotification();
  const urlQueryParams = useQueryParams(['date', 'delegate_user']);
  const effectiveQueryParams = delegateUser
    ? { ...urlQueryParams, delegate_user: delegateUser }
    : urlQueryParams;
  const { setCurrentOrder } = useContext(OrderContext);
  const { menuItems, setMenus } = useContext(GlobalContext);
  const { previousOrder, isLoading, error, fetchPreviousOrder, clearPreviousOrder } = usePreviousOrder();
  const {
    items,
    initializeItems,
    updateItemQuantity,
    removeItem,
    clearItems,
    getItemError,
    setItemLoading,
    setItemSuccess,
    setItemError,
    getItemStatus,
  } = usePreviousOrderItems();
  const { isLoading: isLoadingItems, loadItems } = useLoadOrderItems();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoLoad, setAutoLoad] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [hasLoadErrors, setHasLoadErrors] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const effectiveDate = dateProp || effectiveQueryParams.date;

  useEffect(() => {
    if (previousOrder) {
      initializeItems(previousOrder);
    }
  }, [previousOrder, initializeItems]);

  useEffect(() => {
    if (autoLoad && items.length > 0 && !isLoadingItems) {
      setAutoLoad(false);
      handleLoadOrder(items);
    }
  }, [autoLoad, items, isLoadingItems]);

  const handleRepeatOrder = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!effectiveDate) {
      enqueueSnackbar('No se pudo obtener la fecha del menu', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    setAutoLoad(true);
    setIsModalOpen(true);
    fetchPreviousOrder(effectiveDate, delegateUser ? { delegate_user: delegateUser } : undefined);
  };

  const handleViewPreviousOrder = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!effectiveDate) {
      enqueueSnackbar('No se pudo obtener la fecha del menu', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    setIsModalOpen(true);
    fetchPreviousOrder(effectiveDate, delegateUser ? { delegate_user: delegateUser } : undefined);
  };

  const handleCloseModal = () => {
    if (isLoadingItems || isConfirming) return;
    setIsModalOpen(false);
    clearPreviousOrder();
    clearItems();
    setLoadComplete(false);
    setHasLoadErrors(false);
  };

  const handleConfirmOrder = async () => {
    if (!effectiveDate) return;
    setIsConfirming(true);
    try {
      const response = await orderService.updateOrderStatus(effectiveDate, ORDER_STATUS.PROCESSED, effectiveQueryParams) as SuccessResponse;
      setCurrentOrder(response.data);
      enqueueSnackbar('Pedido confirmado!', {
        variant: 'success',
        autoHideDuration: 4000,
      });
      if (onOrderConfirmed) {
        onOrderConfirmed(effectiveDate);
      } else {
        const updatedMenus = menuItems.map((menu) =>
          menu.publication_date === effectiveDate ? { ...menu, has_order: 1 } : menu
        );
        setMenus(updatedMenus);
      }
      setIsModalOpen(false);
      clearPreviousOrder();
      clearItems();
      setLoadComplete(false);
      setHasLoadErrors(false);
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Error al confirmar el pedido', {
        variant: 'error',
        autoHideDuration: 4000,
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleLoadOrder = async (orderItems: PreviousOrderItem[]) => {
    if (!effectiveDate) {
      enqueueSnackbar('No se pudo obtener la fecha del menu', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    await loadItems(orderItems, effectiveDate, effectiveQueryParams, {
      onItemLoading: (productId) => setItemLoading(productId, true),
      onItemSuccess: (productId) => setItemSuccess(productId),
      onItemError: (productId, errorMessage) => setItemError(productId, errorMessage),
      onComplete: async (results: LoadItemResult[]) => {
        const hasErrors = results.some((r) => !r.success);
        setHasLoadErrors(hasErrors);
        setLoadComplete(true);

        try {
          const response = await orderService.get(effectiveDate, effectiveQueryParams) as SuccessResponse;
          setCurrentOrder(response.data);
        } catch (err) {
          console.error('Error refreshing order:', err);
        }

        if (hasErrors) {
          enqueueSnackbar('Algunos productos tuvieron errores. Entra al menu y revisa tu pedido', {
            variant: 'warning',
            autoHideDuration: 6000,
          });
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

  if (compact) {
    return (
      <>
        <CompactPreviousOrderButtons
          onRepeat={handleRepeatOrder}
          onViewPrevious={handleViewPreviousOrder}
          onRepeatInfo={showRepeatInfo}
          onViewInfo={showViewInfo}
        />

        <PreviousOrderModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          previousOrder={previousOrder}
          isLoading={isLoading}
          error={error}
          items={items}
          onQuantityChange={updateItemQuantity}
          onRemoveItem={removeItem}
          getItemError={getItemError}
          getItemStatus={getItemStatus}
          onLoadOrder={handleLoadOrder}
          isLoadingItems={isLoadingItems}
          loadComplete={loadComplete}
          hasLoadErrors={hasLoadErrors}
          onConfirmOrder={handleConfirmOrder}
          isConfirming={isConfirming}
          currentDate={effectiveDate}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-white py-4 px-4">
        <div className="flex gap-3 justify-center items-center">
          {/* DISABLED: Repetir pedido button
          <div className="flex items-center gap-1">
            <button
              onClick={handleRepeatOrder}
              className="py-3 px-4 bg-green-50 text-green-100 font-cera-medium text-sm rounded-full hover:bg-yellow-active hover:text-white transition-colors"
            >
              Repetir pedido
            </button>
            <InfoIcon onClick={showRepeatInfo} />
          </div>
          */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleViewPreviousOrder}
              className="py-3 px-4 bg-white text-green-100 font-cera-medium text-sm rounded-full border-2 border-green-100 hover:bg-green-100 hover:text-white transition-colors"
            >
              Ver pedido anterior y repetir
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
        onRemoveItem={removeItem}
        getItemError={getItemError}
        getItemStatus={getItemStatus}
        onLoadOrder={handleLoadOrder}
        isLoadingItems={isLoadingItems}
        loadComplete={loadComplete}
        hasLoadErrors={hasLoadErrors}
        onConfirmOrder={handleConfirmOrder}
        isConfirming={isConfirming}
        currentDate={effectiveDate}
      />
    </>
  );
};
