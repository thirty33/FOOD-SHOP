import { useEffect, useReducer, useState } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";

export function useInifiniteScroll() {
    
    const [state, dispatch] = useReducer(menuReducer, InitialState);

    const { 
        isLoading, 
        currentPage, 
        hasMore, 
        categories,
        menuItems
    } = state;

    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const [hasMore, setHasMore] = useState(true);


    const loadMoreShorts = async () => {
        // setCurrentPage((prevPage) => prevPage + 1);
        dispatch({ type: 'SET_CURRENT_PAGE', payload: { currentPage: currentPage + 1 }})
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

        // window.scrollTo(0, 0);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        };
    }, [isLoading, hasMore]);

    return {
        currentPage,
        // setCurrentPage,
        hasMore,
        // setHasMore
        isLoading,
        categories,
        dispatch,
        menuItems
    }
}