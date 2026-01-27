import { useState, useCallback } from 'react';
import { OrderData } from '../types/order';

export interface PreviousOrderItem {
  productId: number;
  quantity: number;
  showErrorMessage: boolean;
  errorMessage: string;
  isSuccess: boolean;
  isLoading: boolean;
}

interface UsePreviousOrderItemsReturn {
  items: PreviousOrderItem[];
  initializeItems: (order: OrderData) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearItems: () => void;
  getItemQuantity: (productId: number) => number;
  getItemError: (productId: number) => { show: boolean; message: string };
  setItemLoading: (productId: number, isLoading: boolean) => void;
  setItemSuccess: (productId: number) => void;
  setItemError: (productId: number, errorMessage: string) => void;
  getItemStatus: (productId: number) => { isSuccess: boolean; isLoading: boolean };
}

export function usePreviousOrderItems(): UsePreviousOrderItemsReturn {
  const [items, setItems] = useState<PreviousOrderItem[]>([]);

  const initializeItems = useCallback((order: OrderData) => {
    if (!order || !order.order_lines) {
      setItems([]);
      return;
    }

    const initialItems: PreviousOrderItem[] = order.order_lines
      .filter((line) => line.product && Number(line.quantity) > 0)
      .map((line) => ({
        productId: line.product!.id,
        quantity: Number(line.quantity),
        showErrorMessage: false,
        errorMessage: '',
        isSuccess: false,
        isLoading: false,
      }));

    setItems(initialItems);
  }, []);

  const updateItemQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback((productId: number): number => {
    const item = items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }, [items]);

  const getItemError = useCallback((productId: number): { show: boolean; message: string } => {
    const item = items.find((item) => item.productId === productId);
    return item
      ? { show: item.showErrorMessage, message: item.errorMessage }
      : { show: false, message: '' };
  }, [items]);

  const setItemLoading = useCallback((productId: number, isLoading: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, isLoading }
          : item
      )
    );
  }, []);

  const setItemSuccess = useCallback((productId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, isSuccess: true, isLoading: false, showErrorMessage: false, errorMessage: '' }
          : item
      )
    );
  }, []);

  const setItemError = useCallback((productId: number, errorMessage: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, isSuccess: false, isLoading: false, showErrorMessage: true, errorMessage }
          : item
      )
    );
  }, []);

  const getItemStatus = useCallback((productId: number): { isSuccess: boolean; isLoading: boolean } => {
    const item = items.find((item) => item.productId === productId);
    return item
      ? { isSuccess: item.isSuccess, isLoading: item.isLoading }
      : { isSuccess: false, isLoading: false };
  }, [items]);

  return {
    items,
    initializeItems,
    updateItemQuantity,
    removeItem,
    clearItems,
    getItemQuantity,
    getItemError,
    setItemLoading,
    setItemSuccess,
    setItemError,
    getItemStatus,
  };
}
