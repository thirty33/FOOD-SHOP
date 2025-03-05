import { useContext, useMemo } from "react";
import { GlobalContext } from "../context/globalContext";
import { UserInputs, SignOutResponse, SuccessResponse } from "../types/user";
import { AuthHttpService } from "../services/user";
import { PERMISSION_TYPES, ROLES_TYPES } from "../config/constant";

const authService = new AuthHttpService();

export function useAuth() {

    const {
        showHeader,
        setShowHeader,
        setIsLoading,
        isLoading,
        token,
        setToken,
        signOut,
        setUser,
        user
    } = useContext(GlobalContext);

    const authUser = async ({ email, password, device_name = 'app' }: UserInputs) => {
        try {
            setIsLoading(true);
            const response = await authService.login({ email, password, device_name }) as SuccessResponse;
            setIsLoading(false);
            return response;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }

    const logOut = async () => {
        try {
            setIsLoading(true);
            const response: SignOutResponse = await authService.logOut();
            setIsLoading(false);
            return response;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    }

    const showQuantitySelector = useMemo(() => {
        return user.role === ROLES_TYPES.ADMIN ||
            user.role === ROLES_TYPES.CAFE ||
            (user.role === ROLES_TYPES.CONVENIO && user.permission === PERMISSION_TYPES.CONSOLIDADO)
    }, [user])

    return {
        showHeader,
        setShowHeader,
        authUser,
        isLoading,
        token,
        setToken,
        logOut,
        signOut,
        setUser,
        user,
        showQuantitySelector
    }
}