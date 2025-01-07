import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";

export function useInifiniteScroll() {
    
    const [ currentPage, setCurrenPage] = useState(1);
    const [ hasMore, setHasMore] = useState(false);

    const { 
        isLoading, 
        categories,
        menuItems,
        setIsLoading,
        setMenus,
        setCategories,
        setSelectedMenu,
    } = useContext(GlobalContext);

    const loadMoreShorts = () => {
        setCurrenPage(prev => prev  + 1)
    };
    
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
    }, [hasMore]);

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