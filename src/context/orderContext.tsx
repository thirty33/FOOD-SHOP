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
import { useNotification } from "../hooks/useNotification";
import { Product } from "../types/categories";
import { configuration } from "../config/config";
import { useQueryParams } from "../hooks/useQueryParams";
import { RequestQueue } from "../utils/RequestQueue";

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
  // Recent operation state
  recentOperation: boolean;
  // Loading states by product ID
  loadingStates: Record<number, boolean>;
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
  closeModal: () => {},
  recentOperation: false,
  loadingStates: {}
});

// Create provider component
export function OrderProvider({ children }: GlobalProviderProps) {
  const [reloadCart, setReloandCart] = useState(true);
  const { enqueueSnackbar } = useNotification();
  const queryParams = useQueryParams(['delegate_user']);

  const prevDateRef = useRef<string | null>(null);
  const location = useLocation();
  const [state, dispatch] = useReducer(menuReducer, InitialState);

  // Request queue for sequential processing (prevents race conditions)
  const requestQueueRef = useRef(new RequestQueue());

  // Loading states by product ID
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Pending updates accumulator for debounced updates
  const pendingUpdatesRef = useRef<Map<string | number, { quantity: number | string; partiallyScheduled: boolean }>>(new Map());

  // Function to get current state from reducer - updated each render
  // This solves the stale closure problem in async queue operations
  const getCurrentOrderRef = useRef<() => OrderData | null>(() => state.currentOrder);
  getCurrentOrderRef.current = () => state.currentOrder;

  // New modal state
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null
  });
  
  const { currentOrder, isLoading, isPendingReload, recentOperation } = state;

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
      // Only set loading to true if not coming from a multiple operation
      if (!isPendingReload) {
        dispatch({
          type: CART_ACTION_TYPES.APP_IS_LOADING,
          payload: { isLoading: true },
        });
      }

      const { data } = (await orderService.get(date, queryParams)) as SuccessResponse;

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
      // Always set loading to false and clear pending reload
      dispatch({
        type: CART_ACTION_TYPES.APP_IS_LOADING,
        payload: { isLoading: false },
      });
      
      if (isPendingReload) {
        dispatch({
          type: CART_ACTION_TYPES.SET_PENDING_RELOAD,
          payload: { isPendingReload: false },
        });
        
        // Set recent operation flag and clear after delay
        dispatch({
          type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
          payload: { recentOperation: true },
        });
        setTimeout(() => {
          dispatch({
            type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
            payload: { recentOperation: false },
          });
        }, 2000); // 2 second delay for better reliability
      }
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

    // Accumulate pending updates in ref (survives debounce cancellations)
    orderLines.forEach((line) => {
      pendingUpdatesRef.current.set(line.id, {
        quantity: line.quantity,
        partiallyScheduled: line.partiallyScheduled || false
      });
    });

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

    debouncedGetOrder();
  };

  const debouncedGetOrder = useCallback(
    debounce(
      () => {
        // Convert accumulated updates to array
        const accumulatedUpdates = Array.from(pendingUpdatesRef.current.entries()).map(([id, data]) => ({
          id,
          quantity: data.quantity,
          partiallyScheduled: data.partiallyScheduled
        }));

        // Clear accumulated updates
        pendingUpdatesRef.current.clear();

        // Send all accumulated updates at once
        if (accumulatedUpdates.length > 0) {
          addProductToCart(accumulatedUpdates);
        }
      },
      2000
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

    const filterOrderLines = orderLines
      .filter((line) => typeof line.quantity === "number")
      .map((line) => ({
        ...line,
        quantity: Number(line.quantity),
        partially_scheduled: line.partiallyScheduled || false,
      }));

    // Set loading state for each product being added
    const productIds = filterOrderLines.map(line => Number(line.id));
    setLoadingStates(prev => {
      const newStates = { ...prev };
      productIds.forEach(id => { newStates[id] = true; });
      return newStates;
    });

    // Add request to queue to prevent race conditions
    await requestQueueRef.current.add(async () => {

      // ⚡ GET FRESH STATE: Use ref function to get current state at execution time
      // This fixes the stale closure problem - we always get the latest state from the reducer
      const freshCurrentOrder = getCurrentOrderRef.current();
      
      // 💾 BACKUP: Take backup INSIDE the queue to capture the real current state
      // This ensures we don't include optimistic updates from other queued operations
      const previousOrderState = freshCurrentOrder
        ? JSON.parse(JSON.stringify(freshCurrentOrder)) as OrderData
        : null;

      // ✅ OPTIMISTIC UPDATE: Update local state immediately for instant UI feedback
      const optimisticOrder: OrderData = freshCurrentOrder
        ? { ...freshCurrentOrder, order_lines: [...freshCurrentOrder.order_lines] }
        : {
            id: 0,
            user_id: 0,
            total: 0,
            total_with_tax: 0,
            dispatch_cost: 0,
            tax_amount: 0,
            status: 'PENDING' as const,
            price_list_min: 0,
            branch_id: null,
            dispatch_date: getDate(location.search) || '',
            created_date: getDate(location.search) || '',
            alternative_address: null,
            address: null,
            order_lines: [],
            user_comment: null,
            shipping_threshold: {
              has_better_rate: false,
              next_threshold_amount: null,
              next_threshold_cost: null,
              amount_to_reach: null,
              current_cost: null,
              savings: null
            }
          };

      filterOrderLines.forEach(newLine => {
        const existingLineIndex = optimisticOrder.order_lines.findIndex(
          line => line.product?.id === Number(newLine.id)
        );

        if (existingLineIndex >= 0) {
          // Update existing line
          optimisticOrder.order_lines[existingLineIndex] = {
            ...optimisticOrder.order_lines[existingLineIndex],
            quantity: newLine.quantity,
            partially_scheduled: newLine.partially_scheduled
          };
        } else {
          // For new product, we don't have full product details yet
          // Just add a placeholder that will be replaced by server response
          // This ensures currentQuantity !== 0 so QuantitySelector appears immediately
          const placeholderLine: OrderLine = {
            id: 0,
            quantity: newLine.quantity,
            unit_price: '0',
            unit_price_with_tax: '0',
            order_id: optimisticOrder.id || 0,
            product_id: Number(newLine.id),
            total_price: '0',
            total_price_with_tax: '0',
            product: {
              id: Number(newLine.id),
              name: '',
              description: '',
              price: '0',
              image: '',
              category_id: 0,
              code: '',
              active: 1,
              measure_unit: '',
              price_list: '',
              stock: 0,
              weight: '',
              allow_sales_without_stock: 0,
              category: {
                id: 0,
                name: '',
                description: '',
                products: [],
                subcategories: []
              },
              ingredients: []
            },
            partially_scheduled: newLine.partially_scheduled
          };
          optimisticOrder.order_lines.push(placeholderLine);
        }
      });
      
      dispatch({
        type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
        payload: { currentOrder: optimisticOrder },
      });

      try {
        // Start operation with flags (NOT isLoading - we use per-product loadingStates)
        dispatch({
          type: CART_ACTION_TYPES.START_OPERATION,
          payload: {
            isLoading: false, // Keep false - using per-product loadingStates instead
            isPendingReload: true,
            recentOperation: true
          },
        });

        // 🚀 OPTIMIZATION: Use response from POST directly (no additional GET needed)
        const response = (await orderService.createOrUpdate(
          getDate(location.search)!,
          filterOrderLines,
          queryParams
        )) as SuccessResponse;
        
        // ✅ Merge pending updates with server response to avoid visual jumps
        const orderData = response.data;
        if (pendingUpdatesRef.current.size > 0) {
          // Apply pending local changes to server response
          orderData.order_lines = orderData.order_lines.map(line => {
            if (line.product?.id) {
              const pendingUpdate = pendingUpdatesRef.current.get(line.product.id);
              if (pendingUpdate) {
                return {
                  ...line,
                  quantity: pendingUpdate.quantity,
                  partially_scheduled: pendingUpdate.partiallyScheduled
                };
              }
            }
            return line;
          });
        }
        
        // ✅ Update order state with merged data
        dispatch({
          type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
          payload: { currentOrder: orderData },
        });

        // ✅ Clear operation flags (previously done by fetchOrder)
        dispatch({
          type: CART_ACTION_TYPES.APP_IS_LOADING,
          payload: { isLoading: false },
        });

        dispatch({
          type: CART_ACTION_TYPES.SET_PENDING_RELOAD,
          payload: { isPendingReload: false },
        });

        // Set recent operation flag and clear after delay
        dispatch({
          type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
          payload: { recentOperation: true },
        });

        setTimeout(() => {
          dispatch({
            type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
            payload: { recentOperation: false },
          });
        }, 2000);

      } catch (error) {
        
        // 🔄 ROLLBACK: Restore previous order state on error
        dispatch({
          type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
          payload: { currentOrder: previousOrderState },
        });

        enqueueSnackbar((error as Error).message, {
          variant: "error",
          autoHideDuration: configuration.toast.duration,
        });

        // Clear all operation flags on error
        dispatch({
          type: CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS,
          payload: {
            isLoading: false,
            isPendingReload: false,
            recentOperation: false
          },
        });
      } finally {
        // Clear loading state for all products
        setLoadingStates(prev => {
          const newStates = { ...prev };
          productIds.forEach(id => { delete newStates[id]; });
          return newStates;
        });
      }
    });
    
  };

  const deleteItemFromCart = async (id: string | number, quantity: number) => {
    const orderLines = [{ id, quantity }];
    const productId = Number(id);

    // Set loading state for this product
    setLoadingStates(prev => ({ ...prev, [productId]: true }));

    // Add request to queue to prevent race conditions
    await requestQueueRef.current.add(async () => {
      try {
        // Start operation with flags (NOT isLoading - we use per-product loadingStates)
        dispatch({
          type: CART_ACTION_TYPES.START_OPERATION,
          payload: {
            isLoading: false, // Keep false - using per-product loadingStates instead
            isPendingReload: true,
            recentOperation: true
          },
        });

        // 🚀 OPTIMIZATION: Use response from DELETE directly (no additional GET needed)
        const response = (await orderService.deleteOrderLine(
          getDate(location.search)!,
          orderLines,
          queryParams
        )) as SuccessResponse;

        // ✅ Update order state with response data from DELETE
        dispatch({
          type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
          payload: { currentOrder: response.data },
        });

        // ✅ Clear operation flags (previously done by fetchOrder)
        dispatch({
          type: CART_ACTION_TYPES.APP_IS_LOADING,
          payload: { isLoading: false },
        });

        dispatch({
          type: CART_ACTION_TYPES.SET_PENDING_RELOAD,
          payload: { isPendingReload: false },
        });

        // Set recent operation flag and clear after delay
        dispatch({
          type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
          payload: { recentOperation: true },
        });

        setTimeout(() => {
          dispatch({
            type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
            payload: { recentOperation: false },
          });
        }, 2000);

      } catch (error) {
        enqueueSnackbar((error as Error).message, {
          variant: "error",
          autoHideDuration: configuration.toast.duration,
        });

        // Clear all operation flags on error
        dispatch({
          type: CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS,
          payload: {
            isLoading: false,
            isPendingReload: false,
            recentOperation: false
          },
        });
      } finally {
        // Clear loading state for this product
        setLoadingStates(prev => {
          const newStates = { ...prev };
          delete newStates[productId];
          return newStates;
        });
      }
    });

  };

  const updateOrderStatus = async (status: string) => {
    // Add request to queue to prevent race conditions
    await requestQueueRef.current.add(async () => {
      try {
        // Start operation with flags (NOT isLoading - we use per-product loadingStates)
        dispatch({
          type: CART_ACTION_TYPES.START_OPERATION,
          payload: {
            isLoading: false, // Keep false - using per-product loadingStates instead
            isPendingReload: true,
            recentOperation: true
          },
        });

        // 🚀 OPTIMIZATION: Use response from POST directly (no additional GET needed)
        const response = (await orderService.updateOrderStatus(
          getDate(location.search)!,
          status,
          queryParams
        )) as SuccessResponse;

        // ✅ Update order state with response data from POST
        dispatch({
          type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
          payload: { currentOrder: response.data },
        });

        // ✅ Clear operation flags (previously done by fetchOrder)
        dispatch({
          type: CART_ACTION_TYPES.APP_IS_LOADING,
          payload: { isLoading: false },
        });

        dispatch({
          type: CART_ACTION_TYPES.SET_PENDING_RELOAD,
          payload: { isPendingReload: false },
        });

        // Set recent operation flag and clear after delay
        dispatch({
          type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
          payload: { recentOperation: true },
        });

        setTimeout(() => {
          dispatch({
            type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
            payload: { recentOperation: false },
          });
        }, 2000);

      } catch (error) {
        console.error(error);
        enqueueSnackbar((error as Error).message, {
          variant: "error",
          autoHideDuration: configuration.toast.duration,
        });

        // Clear all operation flags on error
        dispatch({
          type: CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS,
          payload: {
            isLoading: false,
            isPendingReload: false,
            recentOperation: false
          },
        });
      }
    });
  };

  const partiallyScheduleOrder = async (status: string) => {
    // Add request to queue to prevent race conditions
    await requestQueueRef.current.add(async () => {
      try {
        // Start operation with flags (NOT isLoading - we use per-product loadingStates)
        dispatch({
          type: CART_ACTION_TYPES.START_OPERATION,
          payload: {
            isLoading: false, // Keep false - using per-product loadingStates instead
            isPendingReload: true,
            recentOperation: true
          },
        });

        // 🚀 OPTIMIZATION: Use response from POST directly (no additional GET needed)
        const response = (await orderService.partiallyScheduleOrder(
          getDate(location.search)!,
          status
        )) as SuccessResponse;

        // ✅ Update order state with response data from POST
        dispatch({
          type: CART_ACTION_TYPES.SET_CURRENT_ORDER,
          payload: { currentOrder: response.data },
        });

        // ✅ Clear operation flags (previously done by fetchOrder)
        dispatch({
          type: CART_ACTION_TYPES.APP_IS_LOADING,
          payload: { isLoading: false },
        });

        dispatch({
          type: CART_ACTION_TYPES.SET_PENDING_RELOAD,
          payload: { isPendingReload: false },
        });

        // Set recent operation flag and clear after delay
        dispatch({
          type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
          payload: { recentOperation: true },
        });

        setTimeout(() => {
          dispatch({
            type: CART_ACTION_TYPES.SET_RECENT_OPERATION,
            payload: { recentOperation: false },
          });
        }, 2000);

      } catch (error) {
        console.error(error);
        enqueueSnackbar((error as Error).message, {
          variant: "error",
          autoHideDuration: configuration.toast.duration,
        });

        // Clear all operation flags on error
        dispatch({
          type: CART_ACTION_TYPES.CLEAR_OPERATION_FLAGS,
          payload: {
            isLoading: false,
            isPendingReload: false,
            recentOperation: false
          },
        });
      }
    });

  };

  useEffect(() => {
    const urlQueryParams = new URLSearchParams(location.search);
    const date = urlQueryParams.get("date");
    const delegateUser = urlQueryParams.get("delegate_user");

    if (date && (date !== prevDateRef.current || reloadCart || delegateUser)) {
      fetchOrder(date);

      prevDateRef.current = date;

      setReloandCart(false);
    }
  }, [location.search, reloadCart, queryParams.delegate_user]);

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
        autoHideDuration: configuration.toast.duration,
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
    closeModal,
    recentOperation,
    loadingStates
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
