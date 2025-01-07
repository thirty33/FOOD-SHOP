import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";

import {
	OrderResponse
} from "../types/order"

export interface OrderService {
	get(date: string): Promise<OrderResponse> | OrderResponse;
}

export const orderService = new (
	class MenuHttpService extends HttpClient implements OrderService {
		constructor() {
			super(API_ROUTES.orders.base);
		}

		async get(date: string) {
			try {
				const { data, status } = await this.http.get(`${API_ROUTES.orders.paths.getItem}/${date}`);

				const response = this.handleResponse<OrderResponse>(status, data);

				return response;

			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.error('Axios error:', error.response?.data || error.message);
				} else {
					console.error('Error:', error);
				}
				throw error;
			}
		}
	}
)();
