import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';

export type Ingredients = {
    descriptive_text: string
}

type PriceListLine = {
    id: number | string;
    unit_price: string;
    unit_price_with_tax: string;
    unit_price_raw?: number;
    unit_price_with_tax_raw?: number;
};

export type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string | null;
    category_id: number;
    code: string;
    active: number;
    measure_unit: string;
    price_list: string;
    stock: number;
    weight: string;
    allow_sales_without_stock: number;
    price_list_lines: PriceListLine[];
    ingredients: Ingredients[];
};

export interface CategoryLine {
    id: number
    category_id: number
    weekday: string
    preparation_days: number
    maximum_order_time: string
    active: boolean
}

export interface Subcategory {
    id: number
    name: string
}


type CategoryDetail = {
    id: number;
    name: string;
    description: string;
    is_dynamic?: boolean;
    products: Product[];
    category_lines: CategoryLine[];
    category_user_lines: CategoryLine[];
    subcategories: Subcategory[];
};

type Menu = {
    id: number;
    active: boolean;
    title: string;
    description: string;
    publication_date: string;
};

export interface Category {
    id: number;
    order: number;
    show_all_products: boolean;
    category_id: number;
    menu_id: number;
    category: CategoryDetail | null;
    menu: Menu;
    products: Product[];
};

export type MenuApiResponse = SuccessResponse<Pagination<Category>> | UnauthorizedResponse | RateLimitResponse;

export type CategoryItemPagination = Pagination<Category>;

// Category Group types
export interface CategoryGroup {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export type CategoryGroupResponse = SuccessResponse<CategoryGroup[]> | UnauthorizedResponse | RateLimitResponse;