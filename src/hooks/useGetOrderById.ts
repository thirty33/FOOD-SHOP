import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderData } from "../types/order";
import { useNotification } from "./useNotification";
import { orderService } from "../services/order";
import { configuration } from "../config/config";
import { useQueryParams } from "./useQueryParams";

export function useGetOrderById() {
  const { orderId } = useParams<{ orderId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const { enqueueSnackbar } = useNotification();
  const queryParams = useQueryParams(['delegate_user']);

  const fetchOrderById = async (orderId: string) => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      const response = await orderService.getById(orderId, queryParams);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: configuration.toast.duration,
      });
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch the order when route ID changes or delegate_user changes
  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, queryParams.delegate_user]);

  return {
    order,
    isLoading,
    fetchOrderById,
  };
}