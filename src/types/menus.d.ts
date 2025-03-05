import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';

//Component object
export interface MenuItem {
    title: string;
    description: string;
    imageUrl: string;
    id: string | number;
    publication_date: string;
}

//Api object
export interface MenuData {
    active: boolean;
    title: string;
    description: string;
    publication_date: string;
    id: string | number;
}

export type MenuApiResponse = SuccessResponse<Pagination<MenuData>> | UnauthorizedResponse | RateLimitResponse;

export type MenuItemPagination = Pagination<MenuItem>;
