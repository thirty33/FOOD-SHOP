import { useContext } from "react";
import { OrderContext } from "../context/orderContext";
import { useAuth } from "./useAuth";
import { ROLES_TYPES } from "../config/constant";
import { useMemo } from 'react';

export function useOrder() {

    const { user } = useAuth();
    
    const {
        currentOrder,
        isLoading,
        addProductToCart,
        deleteItemFromCart,
        showSideCart,
        setShowSideCart,
        cartItemsCount,
        updateCurrentOrder,
        updateOrderStatus
    } = useContext(OrderContext);

    const modifyOrder = async (id: string | number, quantity: number | string) => {
        addProductToCart([{ id, quantity }])
    }

    const updateOrderLineItem = async (id: string | number, quantity: number | string) => {
        updateCurrentOrder([{ id, quantity }])
    }
    
    const showPrices = useMemo(() => {
        return user.role && (user.role === ROLES_TYPES.ADMIN || user.role === ROLES_TYPES.CAFE)
    }, [user])

    return {
        currentOrder,
        isLoading,
        addProductToCart: modifyOrder,
        deleteItemFromCart,
        showSideCart,
        setShowSideCart,
        cartItemsCount,
        updateCurrentOrder,
        updateOrderLineItem,
        user,
        showPrices,
        updateOrderStatus
    }
}