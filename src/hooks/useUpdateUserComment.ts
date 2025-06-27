import { useState, useContext } from "react";
import { orderService } from "../services/order";
import { useNotification } from "./useNotification";
import { OrderContext } from "../context/orderContext";

export function useUpdateUserComment() {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useNotification();
    const { currentOrder, setCurrentOrder } = useContext(OrderContext);

    const updateUserComment = async (orderId: string | number, userComment: string) => {
        try {
            setIsLoading(true);
            const response = await orderService.updateUserComment(orderId, userComment);
            
            // Update currentOrder with new comment
            if (currentOrder && currentOrder.id === orderId) {
                setCurrentOrder({
                    ...currentOrder,
                    user_comment: userComment
                });
            }
            
            enqueueSnackbar("Comentario actualizado exitosamente", {
                variant: "success",
                autoHideDuration: 3000,
            });
            return response;
        } catch (error) {
            console.error("Error updating user comment:", error);
            enqueueSnackbar((error as Error).message, {
                variant: "error",
                autoHideDuration: 5000,
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateUserComment,
        isLoading
    };
}