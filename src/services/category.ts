import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { API_ROUTES } from "../config/routes";

import { 
    MenuApiResponse, 
    Category, 
    CategoryData, 
    CategoryItemPagination
} from "../types/categories";

import { 
    SuccessResponse,
    Pagination
} from "../types/responses";

export interface CategoryService {
    list(): Promise<CategoryItemPagination> | CategoryItemPagination;
}

export class CategoryHttpService extends HttpClient implements CategoryService {

    constructor() {
        super(API_ROUTES.categories.base);
    }
    
    async list(params?: { [key: string]: string | number }) {
        try {
            const { data, status } = await this.http.get(API_ROUTES.categories.paths.list, { params: params });

            const success = this.handleResponse<MenuApiResponse>(status, data) as SuccessResponse<Pagination<CategoryData>>;
            
            const categoryData: Category[] = success.data.data.map((category: CategoryData) => {
                
                return {
                    title: category.name,
                    description: category.description,
                    id: category.id,
                    discount: '',
                    linkText: 'ver productos',
                    href: '',
                    image: 'https://files.oaiusercontent.com/file-2ddYKb5R7s8gDtbEBpkY1q?se=2024-11-27T18%3A06%3A53Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D010408e6-a27e-4699-8f61-c2814b8f30b5.webp&sig=n2Sp0qG%2B5pNqRla4iEEwzLoGEXTjXFjQ9Ijvy0hxu%2BI%3D',
                };
            });

            const list: CategoryItemPagination = {
                ...success.data,
                data: categoryData
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