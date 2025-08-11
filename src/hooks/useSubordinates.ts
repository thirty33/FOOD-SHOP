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

    useEffect(() => {
        fetchSubordinates();
    }, []);

    return {
        subordinates,
        isLoading,
        refetch: fetchSubordinates,
        handleMakeOrder
    };
}