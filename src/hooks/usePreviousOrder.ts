import { useState, useCallback } from "react";
import { OrderData } from "../types/order";
import { useNotification } from "./useNotification";
import { orderService } from "../services/order";
import { configuration } from "../config/config";
import { useQueryParams } from "./useQueryParams";
import axios from "axios";

export function usePreviousOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [previousOrder, setPreviousOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useNotification();
  const queryParams = useQueryParams(['delegate_user']);

  const fetchPreviousOrder = useCallback(async (date: string, overrideParams?: { [key: string]: string }) => {
    if (!date) return;

    try {
      setIsLoading(true);
      setError(null);
      const params = overrideParams ? { ...queryParams, ...overrideParams } : queryParams;
      const response = await orderService.getPreviousOrder(date, params);

      if ('data' in response && response.data !== null) {
        setPreviousOrder(response.data);
      } else {
        setPreviousOrder(null);
        setError('not_found');
      }
    } catch (err) {
      console.error('Error fetching previous order:', err);

      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setPreviousOrder(null);
        setError('not_found');
      } else {
        enqueueSnackbar((err as Error).message || 'Error al cargar el pedido anterior', {
          variant: "error",
          autoHideDuration: configuration.toast.duration,
        });
        setError('error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [queryParams, enqueueSnackbar]);

  const clearPreviousOrder = useCallback(() => {
    setPreviousOrder(null);
    setError(null);
  }, []);

  return {
    previousOrder,
    isLoading,
    error,
    fetchPreviousOrder,
    clearPreviousOrder,
  };
}