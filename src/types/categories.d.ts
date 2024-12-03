import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';

//Component Object
export interface Category {
    id: number;
    image: string;
    discount: string;
    title: string;
    linkText: string;
    href: string;
}

//Api Object
export interface CategoryData {
    id: number;
    name: string;
    description: string;
}

export type MenuApiResponse = SuccessResponse<Pagination<CategoryData>> | UnauthorizedResponse | RateLimitResponse;

export type CategoryItemPagination = Pagination<Category>;