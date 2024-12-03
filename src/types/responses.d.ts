export interface SuccessResponse<T> {
    status: "success";
    message: string;
    data: T;
}

export interface UnauthorizedResponse {
    status: "error";
    message: string;
}

export interface RateLimitResponse {
    status: "error";
    message: string;
    retry_after: number;
    max_attempts: number;
}

export type ApiResponse<T> = SuccessResponse<T> | UnauthorizedResponse | RateLimitResponse;

export interface Pagination<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}