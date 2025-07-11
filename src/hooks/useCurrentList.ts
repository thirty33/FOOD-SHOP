import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { orderService } from "../services/order"
import { OrderData } from "../types/order"
import { Pagination } from "../types/responses"
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES, ORDERS_QUERY_PARAMS } from "../config/constant";
import { useNotification } from "./useNotification";
import { useInfiniteScroll } from "./useInfiniteScroll";

export function useCurrentList() {

	const { enqueueSnackbar } = useNotification();
	const [state, dispatch] = useReducer(menuReducer, InitialState);

	const [filters, setFilters] = useState({
		[ORDERS_QUERY_PARAMS.ORDER_STATUS]: "",
		[ORDERS_QUERY_PARAMS.TIME_PERIOD]: "",
	});

	const changeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setFilters({
			...filters,
			[event.target.name]: event.target.value
		})
	};

	const {
		currentPage,
		isLoading,
		setIsLoading,
		setHasMore,
		setLastPage,
		setCurrenPage
	} = useInfiniteScroll();

	const { orders } = state;

	const fetchOrders = async (filteredFilters?: Record<string, string | number>) => {

		try {

			setIsLoading(true);

			const { last_page, current_page, data } = await orderService.getOrders({
				...filteredFilters,
				page: currentPage,
			}) as Pagination<OrderData>;

			setHasMore(current_page < last_page);
			setLastPage(last_page);

			const finalOrders = currentPage === 1 ? [...data] : [...orders || [], ...data];

			dispatch({
				type: CART_ACTION_TYPES.SET_ORDERS,
				payload: { orders: finalOrders },
			});

		} catch (error) {
			console.error(error);
			enqueueSnackbar((error as Error).message, {
				variant: "error",
				autoHideDuration: 5000,
			});
		} finally {
			setIsLoading(false);
		}

	}

	const filteredFilters = useMemo(() => {

		setCurrenPage(1)

		return Object.entries(filters).reduce((acc, [key, value]) => {
			if (typeof value === 'string' && value.trim() !== '') {
				acc[key] = value;
			}
			return acc;
		}, {
			page: 1
		} as Record<string, string | number>)

	}, [filters]);

	useEffect(() => {
		if (currentPage > 1) {
			fetchOrders(filteredFilters)
		}
	}, [currentPage, filteredFilters])

	const hasFetched = useRef(false);
	useEffect(() => {
		if (!hasFetched.current && (!orders || orders?.length === 0) && currentPage === 1) {
			fetchOrders();
			hasFetched.current = true;
		}
	}, [orders, currentPage])

	useEffect(() => {
		
		if (Object.entries(filteredFilters).length > 0) {
			fetchOrders(filteredFilters);
		}

	}, [filteredFilters]);

	return {
		orders,
		isLoading,
		filters,
		changeFilter,
	}
}