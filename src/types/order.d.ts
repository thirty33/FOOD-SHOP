import { ORDER_STATUS } from "../config/constant"
import { MenuData } from "./menus";
import { Pagination, SuccessResponse, UnauthorizedResponse, RateLimitResponse } from './responses.d.ts';
import { Ingredients } from './categories.d.ts';

export interface Category {
  id: number
  name: string
  description: string
  products: any[]
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: number
  name: string
}


interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	image: string;
	category_id: number;
	code: string;
	active: number;
	measure_unit: string;
	price_list: string;
	stock: number;
	weight: string;
	allow_sales_without_stock: number;
	category: Category;
	ingredients: Ingredients[];
}

export interface OrderLine {
	id: number;
	quantity: number | string;
	unit_price: string;
	unit_price_with_tax: string;
	order_id: number;
	product_id: number;
	total_price: string;
	total_price_with_tax: string;
	product?: Product;
	partially_scheduled: boolean;
}

export interface UserData {
	nickname: string;
	email: string;
	branch_name: string | null;
	branch_address: string | null;
}

export interface OrderData {
	id: number;
	total: number | string;
	total_with_tax: number | string;
	status: typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
	user_id: number;
	price_list_min: number;
	branch_id: number | null;
	dispatch_date: string;
	created_date: string;
	alternative_address: string | null;
	address: string | null;
	order_lines: OrderLine[];
	menu?: MenuData;
	user_comment: string | null;
	user?: UserData;
}

export interface SuccessResponse {
	status: "success";
	message: string;
	data: OrderData;
}

export interface ErrorResponse {
	status: "error";
	message: string;
}

export interface ValidationErrorResponse {
	message: string;
	errors: {
			[key: string]: string[];
	};
}

export type OrderResponse = SuccessResponse | ErrorResponse | ValidationErrorResponse;

export type PaginateResponse = SuccessResponse<Pagination<OrderData>> | UnauthorizedResponse | RateLimitResponse;