import { useState, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import { configuration } from "../config/config";

interface PaginationResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
}

interface UseManualPaginationOptions<T> {
  fetchFunction: (page: number, ...args: any[]) => Promise<PaginationResponse<T>>;
  resetTrigger?: any; // Dependency that triggers reset (like menuId)
  fetchArgs?: any[]; // Additional arguments for fetchFunction
}

/**
 * Generic hook for manual pagination with loading states
 * Encapsulates common pagination logic that can be reused across components
 */
export function useManualPagination<T>({
  fetchFunction,
  resetTrigger,
  fetchArgs = []
}: UseManualPaginationOptions<T>) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);

  const { enqueueSnackbar } = useSnackbar();
  const hasFetched = useRef(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      if (currentPage > lastPage) {
        setIsLoading(false);
        return;
      }

      const { last_page, current_page, data } = await fetchFunction(currentPage, ...fetchArgs);

      setHasMore(current_page < last_page);
      setLastPage(last_page);

      setItems(prevItems => {
        // On page 1, replace data; on subsequent pages, append data
        return currentPage === 1 ? data : [...prevItems, ...data]
      });
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar((error as Error).message, { 
        variant: 'error', 
        autoHideDuration: configuration.toast.duration 
      });
    }
  };

  // Reset pagination when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setItems([]);
      setCurrentPage(1);
      setLastPage(1);
      setHasMore(false);
      hasFetched.current = false;
    }
  }, [resetTrigger]);

  // Fetch more items when currentPage changes (except page 1)
  useEffect(() => {
    if (currentPage > 1) {
      fetchItems();
    }
  }, [currentPage]);

  // Initial fetch - only trigger when items are empty and we're on page 1
  useEffect(() => {
    if (!hasFetched.current && items.length === 0 && currentPage === 1) {
      fetchItems();
      hasFetched.current = true;
    }
  }, [items, currentPage]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const reset = () => {
    setItems([]);
    setCurrentPage(1);
    setLastPage(1);
    setHasMore(false);
    hasFetched.current = false;
  };

  return {
    // Data
    items,
    currentPage,
    lastPage,
    
    // States
    isLoading,
    hasMore,
    
    // Actions
    loadMore,
    reset,
    
    // Internal function (rarely needed)
    fetchItems
  };
}