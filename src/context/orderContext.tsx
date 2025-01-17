import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES } from "../config/constant";
import { orderService } from "../services/order";
import { OrderData, SuccessResponse } from "../types/order";
import { GlobalProviderProps, type state } from "../types/state";
import debounce from "just-debounce-it";
import { useNotification } from "../hooks/useNotification";

type orderState = Pick<
  state,
  | "isLoading"
  | "currentOrder"
  | "addProductToCart"
  | "deleteItemFromCart"
  | "showSideCart"
  | "setShowSideCart"
  | "cartItemsCount"
  | "updateCurrentOrder"
  | "updateOrderStatus"
>;

// Create context
export const OrderContext = createContext<orderState>({
  isLoading: false,
  currentOrder: null,
  addProductToCart: () => {},
  deleteItemFromCart: () => {},
  showSideCart: false,
  setShowSideCart: () => {},
  cartItemsCount: 0,
  updateCurrentOrder: () => {},
  updateOrderStatus: () => {},
});

// Create provider component
export function OrderProvider({ children }: GlobalProviderProps) {

  const [reloadCart, setReloandCart] = useState(true);
  const { enqueueSnackbar } = useNotification();

  const prevDateRef = useRef<string | null>(null);
  const location = useLocation();
  const [state, dispatch] = useReducer(menuReducer, InitialState);

  const { currentOrder, isLoading, showSideCart } = state;

  const setShowSideCart = (value: boolean) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_SHOW_CART,
      payload: { showSideCart: value },
    });
  };

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

  const getDate = (search: string) => {
    const queryParams = new URLSearchParams(search);
    const date = queryParams.get("date");
    return date;
  };

  const updateCurrentOrder = async (
    orderLines: Array<{ id: string | number; quantity: number | string }>
  ) => {
    if (!currentOrder) return;

    const updatedOrderLines = [...currentOrder.order_lines];

    orderLines.forEach((line) => {
      const productToUpdate = updatedOrderLines.find(
        (orderLine) => line.id === orderLine.product.id
      );
      if (productToUpdate) {
        productToUpdate.quantity = line.quantity;
      }
    });

    const newOrder: OrderData = {
      ...currentOrder,
      order_lines: updatedOrderLines,
    };

    dispatch({
      type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
      payload: { currentOrder: newOrder },
    });

    debouncedGetOrder(orderLines);
  };

  const debouncedGetOrder = useCallback(
    debounce(
      (
        orderLines: Array<{ id: string | number; quantity: number | string }>
      ) => {
        addProductToCart(orderLines);
      },
      500
    ),
    [location.search]
  );

  const addProductToCart = async (
    orderLines: Array<{ id: string | number; quantity: number | string }>
  ) => {
    const filterOrderLines = orderLines
      .filter((line) => typeof line.quantity === "number")
      .map((line) => ({ ...line, quantity: Number(line.quantity) }));

    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      (await orderService.createOrUpdate(
        getDate(location.search)!,
        filterOrderLines
      )) as SuccessResponse;
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
    const orderLines = [{ id, quantity }];

    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      (await orderService.deleteOrderLine(
        getDate(location.search)!,
        orderLines
      )) as SuccessResponse;
      setReloandCart(true);
    } catch (error) {
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };

  const updateOrderStatus = async (status: string) => {
    console.log("here");
    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      (await orderService.updateOrderStatus(
        getDate(location.search)!,
        status
      )) as SuccessResponse;
      setReloandCart(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get("date");

    if (date && (date !== prevDateRef.current || reloadCart)) {
      fetchOrder(date);

      prevDateRef.current = date;

      setReloandCart(false);
    }
  }, [location.search, reloadCart]);

  const cartItemsCount = useMemo(() => {
    return currentOrder?.order_lines.length || 0;
  }, [currentOrder]);

  const value = {
    currentOrder,
    isLoading,
    addProductToCart,
    deleteItemFromCart,
    showSideCart,
    setShowSideCart,
    cartItemsCount,
    updateCurrentOrder,
    updateOrderStatus,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
