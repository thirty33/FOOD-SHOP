import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNotification } from "./useNotification";

export interface PaginationState {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface PaginationResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface UsePaginationOptions<T> {
    fetchFunction: (page: number, perPage: number, filters?: Record<string, string | number>) => Promise<PaginationResponse<T>>;
    defaultPerPage?: number;
    filters?: Record<string, string | number>;
}

const DEFAULT_PER_PAGE = 10;

export function usePagination<T>({
    fetchFunction,
    defaultPerPage = DEFAULT_PER_PAGE,
    filters = {},
}: UsePaginationOptions<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        lastPage: 1,
        perPage: defaultPerPage,
        total: 0,
        from: null,
        to: null,
    });
    const { enqueueSnackbar } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const initializedRef = useRef(false);
    const filtersRef = useRef(filters);

    const getPageFromUrl = useCallback(() => {
        const urlPage = searchParams.get('page');
        if (urlPage) {
            const page = parseInt(urlPage, 10);
            return isNaN(page) || page < 1 ? 1 : page;
        }
        return 1;
    }, [searchParams]);

    const updateUrlParams = useCallback((page: number) => {
        const newParams = new URLSearchParams(searchParams);

        if (page === 1) {
            newParams.delete('page');
        } else {
            newParams.set('page', String(page));
        }

        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    const fetchItems = useCallback(async (page: number = 1, perPage: number = defaultPerPage) => {
        try {
            setIsLoading(true);
            const response = await fetchFunction(page, perPage, filtersRef.current);

            setItems(response.data);
            setPagination({
                currentPage: response.current_page,
                lastPage: response.last_page,
                perPage: response.per_page,
                total: response.total,
                from: response.from,
                to: response.to,
            });

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            console.error('Error fetching items:', error);
        }
    }, [fetchFunction, defaultPerPage, enqueueSnackbar]);

    const handlePageChange = useCallback((page: number) => {
        updateUrlParams(page);
        fetchItems(page, pagination.perPage);
    }, [fetchItems, pagination.perPage, updateUrlParams]);

    // Reset and refetch when filters change
    useEffect(() => {
        const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
        if (filtersChanged) {
            filtersRef.current = filters;
            updateUrlParams(1);
            fetchItems(1, pagination.perPage);
        }
    }, [filters, fetchItems, pagination.perPage, updateUrlParams]);

    // Initial fetch
    useEffect(() => {
        if (initializedRef.current) {
            return;
        }
        initializedRef.current = true;

        const page = getPageFromUrl();
        fetchItems(page, pagination.perPage);
    }, []);

    return {
        items,
        isLoading,
        pagination,
        handlePageChange,
        refetch: fetchItems,
    };
}
