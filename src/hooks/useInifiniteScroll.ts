import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/globalContext";

export function useInifiniteScroll() {
    
    const { 
        isLoading, 
        currentPage, 
        hasMore, 
        categories,
        menuItems,
        loadMoreShorts,
        setIsLoading,
        setHasMore,
        setMenus,
        setCategories,
        setSelectedMenu,
        setCurrenPage
    } = useContext(GlobalContext);
    
    useEffect(() => {
        const handleScroll = () => {

            if (isLoading || !hasMore) return;
            
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            
            if (scrollTop + clientHeight >= scrollHeight) {
                loadMoreShorts();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        };
    }, [isLoading, hasMore]);

    return {
        currentPage,
        hasMore,
        isLoading,
        categories,
        menuItems,
        setIsLoading,
        setHasMore,
        setMenus,
        setCategories,
        setSelectedMenu,
        setCurrenPage
    }
}