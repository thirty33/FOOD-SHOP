import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES } from "../config/constant";
import { orderService } from "../services/order";
import { SuccessResponse } from "../types/order";
import { GlobalProviderProps, type state } from "../types/state";

// Create context
export const OrderContext = createContext<
  Pick<state, "isLoading" | "currentOrder" | "addProductToCart" | "deleteItemFromCart">
>({
  isLoading: false,
  currentOrder: null,
  addProductToCart: () => {},
  deleteItemFromCart: () => {},
});

// Create provider component
export function OrderProvider({ children }: GlobalProviderProps) {

  const [ reloadCart, setReloandCart ] = useState(true);

  const prevDateRef = useRef<string | null>(null);
  const location = useLocation();
  const [state, dispatch] = useReducer(menuReducer, InitialState);

  const { currentOrder, isLoading } = state;

  const fetchOrder = async (date: string) => {
    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      const { data } = (await orderService.get(date)) as SuccessResponse;

      dispatch({
        type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
        payload: { currentOrder: data },
      });
    } catch (error) {
      dispatch({
        type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
        payload: { currentOrder: null },
      });
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };
  
  const getDate = () => {
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get("date");
    return date;
  }

  const addProductToCart = async (id: string | number, quantity: number) => {
    
    const orderLines = [{ id, quantity }]

    try {

      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      await orderService.createOrUpdate(getDate()!, orderLines) as SuccessResponse;
      setReloandCart(true);
      
    } catch (error) {

    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };

  const deleteItemFromCart = async (id: string | number, quantity: number) => {
    const orderLines = [{ id, quantity }]

    try {

      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      await orderService.deleteOrderLine(getDate()!, orderLines) as SuccessResponse;
      setReloandCart(true);
      
    } catch (error) {

    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  }

  useEffect(() => {
    
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get("date");
    
    if (date && (date !== prevDateRef.current || reloadCart)) {

      fetchOrder(date);

      prevDateRef.current = date;
      setReloandCart(false);

    }

  }, [location.search, reloadCart]);

  const value = {
    currentOrder,
    isLoading,
    addProductToCart,
    deleteItemFromCart
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
