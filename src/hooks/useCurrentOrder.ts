import { useEffect, useReducer } from "react"
import { orderService } from "../services/order";
import { SuccessResponse } from "../types/order";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES } from "../config/constant";
import { useLocation } from "react-router-dom";

const cartProducts = [
    {
        id: 1,
        title: "Product 1",
        price: 20,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 2,
        title: "Product 2",
        price: 30,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 3,
        title: "Product 3",
        price: 40,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 4,
        title: "Product 3",
        price: 40,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 5,
        title: "Product 3",
        price: 40,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 6,
        title: "Product 3",
        price: 40,
        images: ["https://via.placeholder.com/150"],
    },
    {
        id: 7,
        title: "Product 3",
        price: 40,
        images: ["https://via.placeholder.com/150"],
    },
]

export function useOrder() {

    const location = useLocation();

    const [state, dispatch ] = useReducer(menuReducer, InitialState);

    const { 
        currentOrder,
        isLoading,
    } = state;

    const fetchOrder = async (date: string) => {

        try {
            // Fetch order
            dispatch({
                type: CART_ACTION_TYPES.APP_IS_LOADING,
                payload: { isLoading: true }
            })

            const { data } = await orderService.get(date) as SuccessResponse;

            dispatch({
                type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
                payload: { currentOrder: data }
            })

            console.log(data);

        } catch (error) {

            dispatch({
                type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
                payload: { currentOrder: null }
            })
        }
        finally {
            dispatch({
                type: CART_ACTION_TYPES.APP_IS_LOADING,
                payload: { isLoading: false }
            })
        }
    }
    
    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const date = queryParams.get("date");

        if (date) {
            fetchOrder(date);
        }

    }, [location.search]); 

    return {
        cartProducts,
        currentOrder,
        isLoading
    }
}