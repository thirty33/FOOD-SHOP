import { useContext } from "react";
import { OrderContext } from "../context/orderContext";
    
export function useOrder() {
    
    const { 
        currentOrder, 
        isLoading,
        addProductToCart,
        deleteItemFromCart
    } = useContext(OrderContext);
    
    return {
        currentOrder,
        isLoading,
        addProductToCart,
        deleteItemFromCart
    }
}