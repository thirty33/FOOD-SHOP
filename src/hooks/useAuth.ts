import { useContext } from "react";
import { GlobalContext } from "../context/globalContext";
import { UserInputs, ApiResponse, SignOutResponse } from "../types/user";
import { AuthHttpService } from "../services/user";

const authService = new AuthHttpService();

export function useAuth() {

    const { 
        showHeader, 
        setShowHeader, 
        setIsLoading, 
        isLoading,
        token,
        setToken
     } = useContext(GlobalContext);

    const authUser = async ({ email, password, device_name = 'app' }: UserInputs) => {
        try {
            setIsLoading(true);
            const response: ApiResponse = await authService.login({ email, password, device_name });
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

    return {
        showHeader,
        setShowHeader,
        authUser,
        isLoading,
        token,
        setToken,
        logOut
    }
}