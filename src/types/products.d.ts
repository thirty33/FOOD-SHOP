import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';
import { Product } from './categories';
//Component Object

export interface ProductData {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    category_id: number;
    code: string;
    active: number;
    measure_unit: string;
    price_list: string | null;
    stock: number;
    weight: string;
    allow_sales_without_stock: number;
    ingredients: Ingredients[];
}

export type ProductApiResponse = SuccessResponse<Pagination<ProductData>> | UnauthorizedResponse | RateLimitResponse;

export type ProductItemPagination = Pagination<Product>;