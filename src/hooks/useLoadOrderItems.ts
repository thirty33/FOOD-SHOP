import { useState, useCallback } from 'react';
import axios from 'axios';
import { orderService } from '../services/order';
import { PreviousOrderItem } from './usePreviousOrderItems';

export interface LoadItemResult {
  productId: number;
  success: boolean;
  errorMessage: string;
}

interface UseLoadOrderItemsReturn {
  isLoading: boolean;
  loadItems: (
    items: PreviousOrderItem[],
    date: string,
    queryParams: { [key: string]: string | number },
    callbacks: {
      onItemLoading: (productId: number) => void;
      onItemSuccess: (productId: number) => void;
      onItemError: (productId: number, errorMessage: string) => void;
      onComplete?: (results: LoadItemResult[]) => void;
    }
  ) => Promise<LoadItemResult[]>;
}

export function useLoadOrderItems(): UseLoadOrderItemsReturn {
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = useCallback(async (
    items: PreviousOrderItem[],
    date: string,
    queryParams: { [key: string]: string | number },
    callbacks: {
      onItemLoading: (productId: number) => void;
      onItemSuccess: (productId: number) => void;
      onItemError: (productId: number, errorMessage: string) => void;
      onComplete?: (results: LoadItemResult[]) => void;
    }
  ): Promise<LoadItemResult[]> => {
    if (items.length === 0 || !date) {
      return [];
    }

    setIsLoading(true);
    const results: LoadItemResult[] = [];

    for (const item of items) {
      callbacks.onItemLoading(item.productId);

      try {
        await orderService.createOrUpdate(
          date,
          [{ id: item.productId, quantity: item.quantity }],
          queryParams
        );

        callbacks.onItemSuccess(item.productId);
        results.push({
          productId: item.productId,
          success: true,
          errorMessage: '',
        });
      } catch (error) {
        let errorMessage = 'Error al agregar el producto';

        if (axios.isAxiosError(error) && error.response?.data?.errors?.message) {
          const messages = error.response.data.errors.message;
          errorMessage = Array.isArray(messages) ? messages.join(' ') : messages;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        callbacks.onItemError(item.productId, errorMessage);
        results.push({
          productId: item.productId,
          success: false,
          errorMessage,
        });
      }
    }

    setIsLoading(false);

    if (callbacks.onComplete) {
      callbacks.onComplete(results);
    }

    return results;
  }, []);

  return {
    isLoading,
    loadItems,
  };
}