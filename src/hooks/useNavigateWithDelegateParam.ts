import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useQueryParams } from "./useQueryParams";

export function useNavigateWithDelegateParam() {
    const navigate = useNavigate();
    const queryParams = useQueryParams(['delegate_user']);

    const navigateWithDelegate = useCallback((to: string) => {
        // Construir los search params preservando delegate_user si existe
        const searchParams = new URLSearchParams();
        
        if (queryParams.delegate_user) {
            searchParams.set('delegate_user', queryParams.delegate_user);
        }
        
        // Construir la URL final
        const finalUrl = searchParams.toString() ? `${to}?${searchParams.toString()}` : to;
        
        navigate(finalUrl);
    }, [navigate, queryParams.delegate_user]);

    return navigateWithDelegate;
}