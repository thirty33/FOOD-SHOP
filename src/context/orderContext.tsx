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
import { OrderData, OrderLine, SuccessResponse } from "../types/order";
import { GlobalProviderProps, type state } from "../types/state";
import debounce from "just-debounce-it";

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
});

// Create provider component
export function OrderProvider({ children }: GlobalProviderProps) {
  const [reloadCart, setReloandCart] = useState(true);

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

  const getDate = () => {
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get("date");
    return date;
  };

  const updateCurrentOrder = async (
    orderLines: Array<{ id: string | number; quantity: number | string }>
  ) => {
    
    let newOrderLines: OrderLine[] | undefined;
    let productToUpdate: OrderLine | undefined;

    orderLines.map((line) => {
      productToUpdate = currentOrder?.order_lines.find(
        (orderLine) => line.id === orderLine.product.id
      );
      productToUpdate!.quantity = line.quantity;
      newOrderLines = currentOrder?.order_lines.filter(
        (orderLine) => line.id !== orderLine.product.id
      );
    });

    let newOrder: OrderData = {
      ...currentOrder!,
      order_lines: [...newOrderLines!, productToUpdate!],
    };

    dispatch({
      type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
      payload: { currentOrder: newOrder },
    });

    debouncedGetMovies(orderLines);
  };

  const debouncedGetMovies = useCallback(
    debounce(
      (
        orderLines: Array<{ id: string | number; quantity: number | string }>
      ) => {
        addProductToCart(orderLines);
      },
      500
    ),
    []
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
        getDate()!,
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
        getDate()!,
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
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
