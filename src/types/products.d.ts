import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';

//Component Object
export interface Product {
    id: number;
    imageLight: string;
    imageDark: string;
    discount: string;
    title: string;
    rating: number;
    reviews: number;
    price: string;
    tags: string[];
    ingredients: Ingredients[];
}

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