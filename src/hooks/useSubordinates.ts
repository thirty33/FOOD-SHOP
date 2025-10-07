import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubordinatesHttpService } from "../services/subordinates";
import { SubordinateUser } from "../types/subordinates";
import { useNotification } from "./useNotification";
import { ROUTES } from "../config/routes";

const subordinatesService = new SubordinatesHttpService();

export function useSubordinates() {
    const [subordinates, setSubordinates] = useState<SubordinateUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useNotification();
    const navigate = useNavigate();

    const fetchSubordinates = async () => {
        try {
            setIsLoading(true);
            const response = await subordinatesService.getSubordinates();
            
            if (response.status === 'success') {
                setSubordinates(response.data);
            }
            
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar usuarios subordinados';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            console.error('Error fetching subordinates:', error);
        }
    };

    const handleMakeOrder = (nickname: string) => {
        navigate({
            pathname: ROUTES.MENUS,
            search: `?delegate_user=${encodeURIComponent(nickname)}`
        });
    };

    const handleMenuCardClick = (menuId: string | number, publicationDate: string, hasOrder: number, orderId: number | null | undefined, delegateUser: string) => {
        const searchParams = new URLSearchParams();
        searchParams.set('delegate_user', delegateUser);

        if (hasOrder === 1 && orderId) {
            // Navigate to order detail
            navigate({
                pathname: `/${ROUTES.GET_ORDER_SUMMARY_ROUTE(orderId)}`,
                search: searchParams.toString()
            });
        } else {
            // Navigate to menu categories
            searchParams.set('date', publicationDate);
            navigate({
                pathname: `/${ROUTES.GET_CATEGORY_ROUTE(menuId)}`,
                search: searchParams.toString()
            });
        }
    };

    useEffect(() => {
        fetchSubordinates();
    }, []);

    return {
        subordinates,
        isLoading,
        refetch: fetchSubordinates,
        handleMakeOrder,
        handleMenuCardClick
    };
}