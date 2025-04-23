import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderData } from "../types/order";
import { useNotification } from "./useNotification";
import { orderService } from "../services/order";

export function useGetOrderById() {
  const { orderId } = useParams<{ orderId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const { enqueueSnackbar } = useNotification();

  const fetchOrderById = async (orderId: string) => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      const response = await orderService.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch the order when route ID changes
  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);

  return {
    order,
    isLoading,
    fetchOrderById,
  };
}