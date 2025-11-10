import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { OrderContext } from "../context/orderContext";
import { useAuth } from "./useAuth";
import { ROLES_TYPES } from "../config/constant";
import { useMemo } from 'react';

export function useOrder() {

    const { user } = useAuth();
    const location = useLocation();
    
    const {
        currentOrder,
        isLoading,
        addProductToCart,
        deleteItemFromCart,
        showSideCart,
        setShowSideCart,
        cartItemsCount,
        updateCurrentOrder,
        updateOrderStatus,
        partiallyScheduleOrder,
        setCurrentOrder,
        modalState,
        setShowProductDetail,
        closeModal,
        recentOperation,
        loadingStates
    } = useContext(OrderContext);

    const modifyOrder = async (
        orderLines: Array<{
            id: string | number,
            quantity: number | string,
            productInfo?: {
                name: string,
                price: string,
                image: string | null
            }
        }>
    ) => {
        addProductToCart(orderLines)
    }

    const updateOrderLineItem = async (id: string | number, quantity: number | string, partiallyScheduled: boolean = false) => {
        updateCurrentOrder([{ 
            id, 
            quantity,
            partiallyScheduled
         }])
    }
    
    const showPrices = useMemo(() => {
        return user.role && (user.role === ROLES_TYPES.ADMIN || user.role === ROLES_TYPES.CAFE)
    }, [user])

    const isAtCategoriesRoute = (): boolean => {
        const regex = /^\/menu\/[^/]+\/categories$/;
        return regex.test(location.pathname);
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
        updateOrderLineItem,
        user,
        showPrices,
        updateOrderStatus,
        partiallyScheduleOrder,
        setCurrentOrder,
        isAtCategoriesRoute,
        modalState,
        setShowProductDetail,
        closeModal,
        recentOperation,
        loadingStates
    }
}