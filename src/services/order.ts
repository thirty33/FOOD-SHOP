import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";

import {
	OrderResponse
} from "../types/order"

export interface OrderService {
	get(date: string): Promise<OrderResponse> | OrderResponse;
	createOrUpdate(date: string, orderLines: { id: number; quantity: number }[]): Promise<OrderResponse> | OrderResponse;
	deleteOrderLine(date: string, orderLines: { id: number; quantity: number }[]): Promise<OrderResponse> | OrderResponse;
	updateOrderStatus(date: string, statusOrder: string): Promise<OrderResponse> | OrderResponse;
	partiallyScheduleOrder(date: string, statusOrder: string): Promise<OrderResponse> | OrderResponse;
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

		async createOrUpdate(date: string, orderLines: { id: number | string; quantity: number }[]) {
			try {
				const { data, status } = await this.http.post(`${API_ROUTES.orders.paths.createOrUpdateOrder}/${date}`, {
					order_lines: orderLines
				});

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

		async deleteOrderLine(date: string, orderLines: { id: number | string; quantity: number }[]) {

			try {

				const { data, status } = await this.http.delete(`${API_ROUTES.orders.paths.deleteOrderLine}/${date}`, {
					data: {
						order_lines: orderLines
					}
				});

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

		async updateOrderStatus(date: string, statusOrder: string) {

			try {

				const { data, status } = await this.http.post(`${API_ROUTES.orders.paths.updateOrderStatus}/${date}`, {
					status: statusOrder
				});

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

		async partiallyScheduleOrder(date: string, statusOrder: string) {

			try {

				const { data, status } = await this.http.post(`${API_ROUTES.orders.paths.partiallyScheduleOrder}/${date}`, {
					status: statusOrder
				});

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
