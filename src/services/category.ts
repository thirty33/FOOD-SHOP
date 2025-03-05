import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";

import { 
    MenuApiResponse, 
    Category, 
    CategoryItemPagination
} from "../types/categories";

import { 
    SuccessResponse,
    Pagination
} from "../types/responses";

export interface CategoryService {
    list(id: string | number, params?: { [key: string]: string | number }): Promise<CategoryItemPagination> | CategoryItemPagination;
}

export const categoryService = new (
    class CategoryHttpService extends HttpClient implements CategoryService {
    
        constructor() {
            super(API_ROUTES.categories.base);
        }
        
        async list(id: string | number, params?: { [key: string]: string | number }): Promise<CategoryItemPagination> {
            try {
                const { data, status } = await this.http.get(`${API_ROUTES.categories.paths.list}/${id}`, { params: params });
    
                const success = this.handleResponse<MenuApiResponse>(status, data) as SuccessResponse<Pagination<Category>>;
                
                const list: CategoryItemPagination = {
                    ...success.data
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

)();