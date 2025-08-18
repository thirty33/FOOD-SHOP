import { useEffect, useMemo, useReducer, useState } from "react";
import { orderService } from "../services/order"
import { OrderData } from "../types/order"
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES, ORDERS_QUERY_PARAMS } from "../config/constant";
import { useManualPagination } from "./useManualPagination";

export function useCurrentList() {

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

	const onSearch = (search: string) => {
		setFilters({
			...filters,
			[ORDERS_QUERY_PARAMS.USER_SEARCH]: search,
			[ORDERS_QUERY_PARAMS.BRANCH_SEARCH]: search,
		})
	};

	const { orders } = state;

	// Create fetch function for useManualPagination
	const fetchOrders = async (page: number, filters: Record<string, string | number>) => {
		const response = await orderService.getOrders({
			...filters,
			page,
		});
		return response;
	};

	const filteredFilters = useMemo(() => {
		return Object.entries(filters).reduce((acc, [key, value]) => {
			if (typeof value === 'string' && value.trim() !== '') {
				acc[key] = value;
			}
			return acc;
		}, {} as Record<string, string | number>)
	}, [filters]);

	// ✅ NEW - Use the generic manual pagination hook
	const {
		items: paginatedOrders,
		isLoading,
		hasMore,
		loadMore,
		// reset
	} = useManualPagination<OrderData>({
		fetchFunction: fetchOrders,
		resetTrigger: filteredFilters, // Reset when filters change
		fetchArgs: [filteredFilters]
	});

	// Sync paginated orders with global state
	useEffect(() => {
		// Always update state, even with empty arrays to clear previous data
		dispatch({
			type: CART_ACTION_TYPES.SET_ORDERS,
			payload: { orders: paginatedOrders },
		});
	}, [paginatedOrders]);

	return {
		orders,
		isLoading,
		hasMore, // ✅ NEW - Expose hasMore for load more functionality
		loadMore, // ✅ NEW - Expose loadMore function
		filters,
		changeFilter,
		onSearch
	}
}