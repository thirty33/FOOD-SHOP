import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";

import { 
    ProductApiResponse, 
    Product, 
    ProductData, 
    ProductItemPagination
} from "../types/products";

import { 
    SuccessResponse,
    Pagination
} from "../types/responses";

export interface ProductService {
    list(): Promise<ProductItemPagination> | ProductItemPagination;
}

export class ProductHttpService extends HttpClient implements ProductService {

    constructor() {
        super(API_ROUTES.products.base);
    }

    async list(params?: { [key: string]: string | number }) {
        try {
            const { data, status } = await this.http.get(API_ROUTES.products.paths.list, { params: params });

            const success = this.handleResponse<ProductApiResponse>(status, data) as SuccessResponse<Pagination<ProductData>>;
            
            const productData: Product[] = success.data.data.map((product: ProductData) => {
                
                return {
                    id: product.id,
                    imageLight: product.image,
                    imageDark: product.image,
                    discount: '',
                    title: product.name,
                    rating: 0,
                    reviews: 0,
                    price: product.price,
                    tags: ['test'],
                    ingredients: product.ingredients
                };
            });

            const list: ProductItemPagination = {
                ...success.data,
                data: productData
            }

            return list

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