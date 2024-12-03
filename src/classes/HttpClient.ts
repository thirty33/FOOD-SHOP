import axios, { AxiosInstance } from "axios";
import { ROUTES } from "../config/routes";

import {
    ValidationErrorResponse,
} from "../types/user"

const API_URL = import.meta.env.VITE_API_URL

export class HttpClient {

    public http: AxiosInstance;

    constructor(private path: string) {
        this.http = axios.create({
            baseURL: `${API_URL}/${this.path}`,
            headers: {
                'Content-Type': 'application/json',
            },
            validateStatus: () => true // Accept all status codes
        });

        this.http.interceptors.request.use(config => {
            let token = localStorage.getItem('token');
            if (token) {
                token = token.replace(/['"\s]/g, '');
            }
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });

        this.http.interceptors.response.use(response => {
            if (response.status === 401 && window.location.pathname !== '/login') {
                window.location.href = ROUTES.LOGIN;
            }
            return response;
        }, error => {
            return Promise.reject(error);
        });

    }

    protected handleResponse<T>(status: number, data: unknown): T {
        if (status === 200) {
            return data as T;
        } else if (status === 422) {
            const validationErrorResponse = data as ValidationErrorResponse;
            const firstErrorKey = Object.keys(validationErrorResponse.errors)[0];
            const firstErrorMessage = validationErrorResponse.errors[firstErrorKey];
            throw new Error(firstErrorMessage[0]);
        } else if (status === 429) {
            throw new Error(`Demasiados intentos`);
        } else if (status === 401) {
            throw new Error(`El usuario no existe o los datos son incorrectos`);
        } else {
            throw new Error('Hubo un problema, por favor intente de nuevo más tarde.');
        }
    }

}