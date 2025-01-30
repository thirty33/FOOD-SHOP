import { ORDER_STATUS } from "../config/constant"

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
}

interface OrderLine {
	id: number;
	quantity: number | string;
	unit_price: string;
	order_id: number;
	product_id: number;
	total_price: string;
	product: Product;
	partially_scheduled: boolean;
}

export interface OrderData {
	id: number;
	total: number;
	status: typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
	user_id: number;
	price_list_min: number;
	branch_id: number;
	dispatch_date: string;
	alternative_address: string | null;
	order_lines: OrderLine[];
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