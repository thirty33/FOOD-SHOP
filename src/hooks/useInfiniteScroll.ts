import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { GlobalContext } from "../context/globalContext";

interface UseInfiniteScrollOptions {
  threshold?: number;
  debounceDelay?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions = {}) {
  const {
    threshold = 100,
    debounceDelay = 150,
    rootMargin = "0px 0px 100px 0px"
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const debounceTimerRef = useRef<number | null>(null);
  const loadingRef = useRef(false);

  const {
    isLoading,
    categories,
    menuItems,
    setIsLoading,
    setMenus,
    setCategories,
    setSelectedMenu,
  } = useContext(GlobalContext);

  const loadMoreItems = useCallback(() => {
    if (loadingRef.current || !hasMore || isLoading) return;
    
    loadingRef.current = true;
    setIsLoadingMore(true);
    setCurrentPage(prev => prev + 1);
  }, [hasMore, isLoading]);

  const debouncedLoadMore = useCallback(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      loadMoreItems();
    }, debounceDelay);
  }, [loadMoreItems, debounceDelay]);

  const getScrollTop = useCallback(() => {
    return window.pageYOffset || 
           document.documentElement.scrollTop || 
           document.body.scrollTop || 
           0;
  }, []);

  const getScrollHeight = useCallback(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }, []);

  const getClientHeight = useCallback(() => {
    return window.innerHeight || 
           document.documentElement.clientHeight || 
           document.body.clientHeight || 
           0;
  }, []);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || loadingRef.current) return;

    const scrollTop = getScrollTop();
    const scrollHeight = getScrollHeight();
    const clientHeight = getClientHeight();

    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom <= threshold || scrollPercentage >= 0.8) {
      debouncedLoadMore();
    }
  }, [isLoading, hasMore, threshold, debouncedLoadMore, getScrollTop, getScrollHeight, getClientHeight]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    setTimeout(() => {
      handleScroll();
    }, 50);
  }, [handleScroll]);

  const handleResize = useCallback(() => {
    setTimeout(() => {
      handleScroll();
    }, 100);
  }, [handleScroll]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const handleScrollThrottled = () => {
      if (debounceTimerRef.current) return;
      
      debounceTimerRef.current = window.setTimeout(() => {
        handleScroll();
        debounceTimerRef.current = null;
      }, 16);
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [hasMore, isLoading, handleScroll, handleTouchMove, handleResize]);

  useEffect(() => {
    if (currentPage > 1) {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [currentPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setHasMore(false);
    setIsLoadingMore(false);
    loadingRef.current = false;
    
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const updateHasMore = useCallback((newHasMore: boolean) => {
    setHasMore(newHasMore);
    if (!newHasMore) {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  return {
    currentPage,
    lastPage,
    hasMore: hasMore && !isLoadingMore,
    isLoading: isLoading || isLoadingMore,
    isLoadingMore,
    categories,
    menuItems,
    setIsLoading,
    setHasMore: updateHasMore,
    setMenus,
    setCategories,
    setSelectedMenu,
    setCurrentPage,
    setCurrenPage: setCurrentPage, // Backward compatibility
    setLastPage,
    reset,
    loadMoreItems,
  };
}