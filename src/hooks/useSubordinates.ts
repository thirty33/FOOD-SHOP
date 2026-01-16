import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SubordinatesHttpService } from "../services/subordinates";
import { SubordinateUser, SubordinatesParams } from "../types/subordinates";
import { useNotification } from "./useNotification";
import { ROUTES } from "../config/routes";
import { useSubordinatesFilters, DEFAULT_FILTERS } from "../context/SubordinatesFiltersContext";
import { useNavigationParams } from "./useNavigationParams";
import { useAuth } from "./useAuth";

const subordinatesService = new SubordinatesHttpService();

interface PaginationState {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

const DEFAULT_PER_PAGE = 8;

const FILTER_KEYS = ['company_search', 'branch_search', 'user_search', 'start_date', 'end_date', 'order_status'] as const;
type FilterKey = typeof FILTER_KEYS[number];

export function useSubordinates() {
    const [subordinates, setSubordinates] = useState<SubordinateUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        lastPage: 1,
        perPage: DEFAULT_PER_PAGE,
        total: 0,
        from: null,
        to: null,
    });
    const { enqueueSnackbar } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const { filters, setPage: setContextPage, setFilter: setContextFilter, setFilters: setContextFilters, resetFilters: resetContextFilters } = useSubordinatesFilters();
    const { setParamsAndNavigate } = useNavigationParams();
    const { user } = useAuth();
    const initializedRef = useRef(false);
    const filtersRef = useRef(filters);

    // Keep ref in sync with context filters
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    const getInitialStateFromUrl = useCallback(() => {
        const urlPage = searchParams.get('page');
        const page = urlPage ? parseInt(urlPage, 10) : 1;

        const urlFilters: Partial<Record<FilterKey, string>> = {};
        for (const key of FILTER_KEYS) {
            const value = searchParams.get(key);
            if (value) {
                urlFilters[key] = value;
            }
        }

        return {
            page: isNaN(page) || page < 1 ? 1 : page,
            filters: urlFilters,
            hasUrlParams: urlPage !== null || Object.keys(urlFilters).length > 0,
        };
    }, [searchParams]);

    const updateUrlParams = useCallback((page: number, currentFilters: typeof filters) => {
        const newParams = new URLSearchParams();

        if (page > 1) {
            newParams.set('page', String(page));
        }

        for (const key of FILTER_KEYS) {
            const value = currentFilters[key];
            if (value) {
                newParams.set(key, value);
            }
        }

        setSearchParams(newParams, { replace: true });
    }, [setSearchParams]);

    const buildParams = useCallback((page: number, perPage: number): SubordinatesParams => {
        const params: SubordinatesParams = { page, per_page: perPage };
        const currentFilters = filtersRef.current;

        if (currentFilters.company_search) params.company_search = currentFilters.company_search;
        if (currentFilters.branch_search) params.branch_search = currentFilters.branch_search;
        if (currentFilters.user_search) params.user_search = currentFilters.user_search;
        if (currentFilters.start_date) params.start_date = currentFilters.start_date;
        if (currentFilters.end_date) params.end_date = currentFilters.end_date;
        if (currentFilters.order_status) params.order_status = currentFilters.order_status;

        return params;
    }, []);

    const fetchSubordinates = useCallback(async (page: number = 1, perPage: number = DEFAULT_PER_PAGE) => {
        try {
            setIsLoading(true);
            const params = buildParams(page, perPage);
            const response = await subordinatesService.getSubordinates(params);

            if (response.status === 'success') {
                setSubordinates(response.data.data);
                setPagination({
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page,
                    perPage: response.data.per_page,
                    total: response.data.total,
                    from: response.data.from,
                    to: response.data.to,
                });
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar usuarios subordinados';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            console.error('Error fetching subordinates:', error);
        }
    }, [enqueueSnackbar, buildParams]);

    const handlePageChange = useCallback((page: number) => {
        setContextPage(page);
        updateUrlParams(page, filtersRef.current);
        fetchSubordinates(page, pagination.perPage);
    }, [fetchSubordinates, pagination.perPage, updateUrlParams, setContextPage]);

    const handleMakeOrder = (nickname: string, role: string | null) => {
        setParamsAndNavigate(
            { delegate_user: nickname, user_role: role || undefined },
            ROUTES.MENUS
        );
    };

    const handleMenuCardClick = (menuId: string | number, publicationDate: string, hasOrder: number, orderId: number | null | undefined, delegateUser: string, role: string | null) => {
        // Super master users always go to category route to create/edit orders
        if (user.super_master_user) {
            setParamsAndNavigate(
                { delegate_user: delegateUser, user_role: role || undefined },
                `/${ROUTES.GET_CATEGORY_ROUTE(menuId)}`,
                { date: publicationDate }
            );
            return;
        }

        // Regular users go to order summary if order exists
        if (hasOrder === 1 && orderId) {
            setParamsAndNavigate(
                { delegate_user: delegateUser, user_role: role || undefined },
                `/${ROUTES.GET_ORDER_SUMMARY_ROUTE(orderId)}`
            );
        } else {
            setParamsAndNavigate(
                { delegate_user: delegateUser, user_role: role || undefined },
                `/${ROUTES.GET_CATEGORY_ROUTE(menuId)}`,
                { date: publicationDate }
            );
        }
    };

    const handleFilterChange = useCallback((name: string, value: string) => {
        // Update context
        setContextFilter(name as keyof typeof filters, value);
        setContextPage(1);

        // Update ref immediately for the fetch
        const newFilters = { ...filtersRef.current, [name]: value, page: 1 };
        filtersRef.current = newFilters;

        // Update URL
        updateUrlParams(1, newFilters);

        // Fetch with new filters
        fetchSubordinates(1, pagination.perPage);
    }, [fetchSubordinates, pagination.perPage, updateUrlParams, setContextPage, setContextFilter]);

    const handleClearFilters = useCallback(() => {
        // Reset context
        resetContextFilters();

        // Update ref immediately
        filtersRef.current = DEFAULT_FILTERS;

        // Clear URL params
        setSearchParams(new URLSearchParams(), { replace: true });

        // Fetch with default filters
        fetchSubordinates(1, pagination.perPage);
    }, [fetchSubordinates, pagination.perPage, setSearchParams, resetContextFilters]);

    // Initialize from URL on mount and handle URL changes
    useEffect(() => {
        const { page, filters: urlFilters, hasUrlParams } = getInitialStateFromUrl();

        // Build new filters from URL
        const newFilters = {
            ...DEFAULT_FILTERS,
            ...urlFilters,
            page,
        };

        if (!initializedRef.current) {
            // First initialization
            initializedRef.current = true;

            if (hasUrlParams) {
                // URL has params, use them and sync to context
                setContextFilters(newFilters);
                filtersRef.current = newFilters;
            } else if (filters.page !== DEFAULT_FILTERS.page || hasNonDefaultFilters(filters)) {
                // Context has non-default values, sync to URL
                updateUrlParams(filters.page, filters);
                filtersRef.current = filters;
                fetchSubordinates(filters.page, pagination.perPage);
                return;
            }

            fetchSubordinates(page, pagination.perPage);
            return;
        }

        // Already initialized - check if we need to re-sync from URL
        // This handles browser back/forward navigation
        const normalizeFilter = (val: string | undefined): string => val || '';
        const urlChanged = page !== pagination.currentPage ||
            normalizeFilter(urlFilters.company_search) !== normalizeFilter(filtersRef.current.company_search) ||
            normalizeFilter(urlFilters.branch_search) !== normalizeFilter(filtersRef.current.branch_search) ||
            normalizeFilter(urlFilters.user_search) !== normalizeFilter(filtersRef.current.user_search) ||
            normalizeFilter(urlFilters.start_date) !== normalizeFilter(filtersRef.current.start_date) ||
            normalizeFilter(urlFilters.end_date) !== normalizeFilter(filtersRef.current.end_date) ||
            normalizeFilter(urlFilters.order_status) !== normalizeFilter(filtersRef.current.order_status);

        if (urlChanged) {
            setContextFilters(newFilters);
            filtersRef.current = newFilters;
            fetchSubordinates(page, pagination.perPage);
        }
    }, [searchParams]);

    return {
        subordinates,
        isLoading,
        pagination,
        filters,
        refetch: fetchSubordinates,
        handlePageChange,
        handleMakeOrder,
        handleMenuCardClick,
        handleFilterChange,
        handleClearFilters,
    };
}

function hasNonDefaultFilters(filters: typeof DEFAULT_FILTERS): boolean {
    for (const key of FILTER_KEYS) {
        if (filters[key] !== DEFAULT_FILTERS[key]) {
            return true;
        }
    }
    return false;
}