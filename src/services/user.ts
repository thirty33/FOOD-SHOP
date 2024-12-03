import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";
import {
    UserInputs,
    ApiResponse,
    SignOutResponse
} from "../types/user"

export interface AuthService {
    login(body: UserInputs): Promise<ApiResponse> | ApiResponse;
    logOut(): Promise<SignOutResponse> | SignOutResponse;
}

export class AuthHttpService extends HttpClient implements AuthService {

    constructor() {
        super(API_ROUTES.auth.base);
    }

    async login(body: UserInputs) {
        try {
            const { data, status } = await this.http.post(API_ROUTES.auth.paths.login, body);

            return this.handleResponse<ApiResponse>(status, data);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Error:', error);
            }
            throw error;
        }
    }

    async logOut() {

        try {
            const { data, status } = await this.http.post(API_ROUTES.auth.paths.logout);

            return this.handleResponse<SignOutResponse>(status, data);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Error:', error);
            }
            throw error;
        }
    }
}
