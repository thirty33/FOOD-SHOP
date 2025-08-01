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
import { Product } from "../types/categories";

// Modal state interface
interface ModalState {
  isOpen: boolean;
  type: 'cart' | 'productDetail' | null;
  selectedProduct?: Product;
}

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
  | "partiallyScheduleOrder"
  | "setCurrentOrder"
  | "getOrders"
> & {
  // New modal functions
  modalState: ModalState;
  setShowProductDetail: (product: Product) => void;
  closeModal: () => void;
};

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
  partiallyScheduleOrder: () => {},
  setCurrentOrder: () => {},
  getOrders: () => {},
  modalState: { isOpen: false, type: null },
  setShowProductDetail: () => {},
  closeModal: () => {}
});

// Create provider component
export function OrderProvider({ children }: GlobalProviderProps) {
  const [reloadCart, setReloandCart] = useState(true);
  const { enqueueSnackbar } = useNotification();

  const prevDateRef = useRef<string | null>(null);
  const location = useLocation();
  const [state, dispatch] = useReducer(menuReducer, InitialState);

  // New modal state
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null
  });

  const { currentOrder, isLoading } = state;

  // Backward compatible setShowSideCart
  const setShowSideCart = (value: boolean) => {
    setModalState({
      isOpen: value,
      type: value ? 'cart' : null
    });
  };

  // New modal functions
  const setShowProductDetail = (product: Product) => {
    setModalState({
      isOpen: true,
      type: 'productDetail',
      selectedProduct: product
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null
    });
  };

  // Backward compatible showSideCart getter
  const showSideCart = modalState.isOpen && modalState.type === 'cart';

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
    orderLines: Array<{
      id: string | number;
      quantity: number | string;
      partiallyScheduled?: boolean;
    }>
  ) => {

    if (!currentOrder) return;
    
    const updatedOrderLines = [...currentOrder.order_lines];

    orderLines.forEach((line) => {
      const productToUpdate = updatedOrderLines.find(
        (orderLine) => orderLine.product && line.id === orderLine.product.id
      );
      if (productToUpdate) {
        productToUpdate.quantity = line.quantity;
        productToUpdate.partially_scheduled = line.partiallyScheduled || false;
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
        orderLines: Array<{
          id: string | number;
          quantity: number | string;
          partiallyScheduled?: boolean;
        }>
      ) => {
        addProductToCart(orderLines);
      },
      500
    ),
    [location.search]
  );

  const addProductToCart = async (
    orderLines: Array<{
      id: string | number;
      quantity: number | string;
      partiallyScheduled?: boolean;
    }>
  ) => {
    // Capture current cart state before adding products
    const previousCartCount = currentOrder?.order_lines.length || 0;
    
    const filterOrderLines = orderLines
      .filter((line) => typeof line.quantity === "number")
      .map((line) => ({
        ...line,
        quantity: Number(line.quantity),
        partially_scheduled: line.partiallyScheduled || false,
      }));

    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      (await orderService.createOrUpdate(
        getDate(location.search)!,
        filterOrderLines
      )) as SuccessResponse;


    } catch (error) {

      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
      
    } finally {

      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });

      setReloandCart(true);

      // Auto-open CheckoutSideMenu only when adding products to an empty cart
      if (filterOrderLines.length > 0 && previousCartCount === 0) {
        setShowSideCart(true);
      }

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
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };

  const updateOrderStatus = async (status: string) => {
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
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  };

  const partiallyScheduleOrder = async (status: string) => {
    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      (await orderService.partiallyScheduleOrder(
        getDate(location.search)!,
        status
      )) as SuccessResponse;
      setReloandCart(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
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

  // Reset modal to cart view when route changes
  useEffect(() => {
    if (modalState.isOpen && modalState.type === 'productDetail') {
      setModalState({
        isOpen: false,
        type: null
      });
    }
  }, [location.pathname]);

  const cartItemsCount = useMemo(() => {
    return currentOrder?.order_lines.length || 0;
  }, [currentOrder]);

  const setCurrentOrder = (order: OrderData | null) => {
    dispatch({
      type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
      payload: { currentOrder: order },
    });
  }

  const getOrders = async () => {

    try {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: true },
      });

      const { data } = (await orderService.getOrders());

      dispatch({
        type: CART_ACTION_TYPES.SET_ORDERS,
        payload: { orders: data },
      });

    } catch (error) {
      enqueueSnackbar((error as Error).message, {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
    }
  }

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
    partiallyScheduleOrder,
    setCurrentOrder,
    getOrders,
    modalState,
    setShowProductDetail,
    closeModal
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
