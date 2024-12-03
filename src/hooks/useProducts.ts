import { useEffect, useReducer } from "react";
import { menuReducer } from "../store/reducers/menuReducer";
import { InitialState } from "../store/state/initialState";
import { CART_ACTION_TYPES } from "../config/constant";
import { useInifiniteScroll } from "./useInifiniteScroll";
import { ProductItemPagination } from "../types/products";
import { ProductHttpService } from "../services/product";

const productsService = new ProductHttpService();

export function useProducts() {

    const { currentPage, setHasMore } = useInifiniteScroll();
    
    const [ state, dispatch ] = useReducer(menuReducer, InitialState);

    const { products, isLoading } = state;

    const fetchProducts = async () => {

        dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: true } });

        const { last_page, current_page, data } = await productsService.list({ page: currentPage }) as ProductItemPagination;

        setHasMore(current_page < last_page);

        dispatch({ type: CART_ACTION_TYPES.SET_PRODUCTS, payload: { products: [...products, ...data] } });

        dispatch({ type: CART_ACTION_TYPES.APP_IS_LOADING, payload: { isLoading: false } });
    }

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    return {
        products,
        isLoading
    }
}