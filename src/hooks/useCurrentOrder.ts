import { useContext } from "react";
import { OrderContext } from "../context/orderContext";
// import { useAuth } from "./useAuth";
// import { PERMISSION_TYPES, ROLES_TYPES } from "../config/constant";

export function useOrder() {

    // const { user } = useAuth();

    const {
        currentOrder,
        isLoading,
        addProductToCart,
        deleteItemFromCart,
        showSideCart,
        setShowSideCart,
        cartItemsCount,
        updateCurrentOrder
    } = useContext(OrderContext);

    const modifyOrder = async (id: string | number, quantity: number | string) => {
        addProductToCart([{ id, quantity }])
    }

    const updateOrderLineItem = async (id: string | number, quantity: number | string) => {
        updateCurrentOrder([{ id, quantity }])
    }

    return {
        currentOrder,
        isLoading,
        addProductToCart: modifyOrder,
        deleteItemFromCart,
        showSideCart,
        setShowSideCart,
        cartItemsCount,
        updateCurrentOrder,
        updateOrderLineItem
    }
}