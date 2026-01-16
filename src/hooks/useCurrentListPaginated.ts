import { useMemo, useState } from "react";
import { orderService } from "../services/order"
import { OrderData } from "../types/order"
import { ORDERS_QUERY_PARAMS } from "../config/constant";
import { usePagination, PaginationResponse } from "./usePagination";

export function useCurrentListPaginated() {

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

	// Create fetch function for usePagination
	const fetchOrders = async (page: number, perPage: number, filters?: Record<string, string | number>): Promise<PaginationResponse<OrderData>> => {
		const response = await orderService.getOrders({
			...filters,
			page,
			per_page: perPage,
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

	// Use the generic pagination hook
	const {
		items: orders,
		isLoading,
		pagination,
		handlePageChange,
	} = usePagination<OrderData>({
		fetchFunction: fetchOrders,
		defaultPerPage: 10,
		filters: filteredFilters,
	});

	return {
		orders,
		isLoading,
		pagination,
		handlePageChange,
		filters,
		changeFilter,
		onSearch
	}
}
