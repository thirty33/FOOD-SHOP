export type UserInputs = {
    email: string
    password: string
    device_name?: string
}

export interface SuccessResponse {
    status: 'success';
    message: string;
    data: {
        token: string;
        token_type: string;
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