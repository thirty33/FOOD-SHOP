import { PERMISSION_TYPES, ROLES_TYPES } from "../config/constant"

export type UserInputs = {
    email: string
    password: string
    device_name?: string
}
// typeof TODO_FILTERS[keyof typeof TODO_FILTERS]
export type Role = typeof ROLES_TYPES[keyof typeof ROLES_TYPES];
export type Permission = typeof PERMISSION_TYPES[keyof typeof PERMISSION_TYPES];
export interface SuccessResponse {
    status: 'success';
    message: string;
    data: {
        token: string;
        token_type: string;
        role: Role;
        permission: Permission;
    };
}

export interface ValidationErrorResponse {
    message: string;
    errors: {
        [key: string]: string[];
    };
}

export interface TooManyAttemptsResponse {
    status: 'error';
    message: string;
    retry_after: number;
    max_attempts: number;
}

export interface UnauthorizedResponse {
    status: 'error';
    message: string;
}

export type ApiResponse = SuccessResponse | ValidationErrorResponse | TooManyAttemptsResponse | UnauthorizedResponse;


export interface SuccessSignOutResponse {
    status: 'success';
    message: string;
    data: null;
}

export interface SignOutErrorResponse {
    message: string;
}

export type SignOutResponse = SuccessSignOutResponse | SignOutErrorResponse;