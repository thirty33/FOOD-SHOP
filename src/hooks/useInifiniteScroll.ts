import { useEffect, useReducer, useState } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";

export function useInifiniteScroll() {
    
    const [state, ] = useReducer(menuReducer, InitialState);

    const { isLoading } = state;

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreShorts = async () => {
        setCurrentPage((prevPage) => prevPage + 1);
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    return {
        currentPage,
        setCurrentPage,
        hasMore,
        setHasMore
    }
}