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
}

interface OrderLine {
	id: number;
	quantity: number | string;
	unit_price: string;
	order_id: number;
	product_id: number;
	total_price: string;
	product: Product;
}

export interface OrderData {
	id: number;
	total: number;
	status: string;
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

export type OrderResponse = SuccessResponse | ErrorResponse;