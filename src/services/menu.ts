import axios from "axios";
import { HttpClient } from "../classes/HttpClient";
import { formatDate } from "../helpers/dates";
import { API_ROUTES } from "../config/routes";

import { 
    MenuApiResponse, 
    MenuData, 
    MenuItem, 
    MenuItemPagination
} from "../types/menus";

import { 
    SuccessResponse,
    Pagination
} from "../types/responses";

export interface MenuService {
    list(): Promise<MenuItemPagination> | MenuItemPagination;
}

export class MenuHttpService extends HttpClient implements MenuService {

    constructor() {
        super(API_ROUTES.menus.base);
    }
    
    async list(params?: { [key: string]: string | number }) {
        try {
            const { data, status } = await this.http.get(API_ROUTES.menus.paths.list, { params: params });

            const success = this.handleResponse<MenuApiResponse>(status, data) as SuccessResponse<Pagination<MenuData>>;
            
            const menuData: MenuItem[] = success.data.data.map((menu: MenuData) => {
                const formattedDate = formatDate(menu.publication_date);
                return {
                    title: `${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}`,
                    description: menu.description,
                    id: menu.id,
                    imageUrl: "https://files.oaiusercontent.com/file-XVrt61x76iiAo9PaA8LtZ5?se=2024-11-26T18%3A08%3A11Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3De93c25da-fe71-4e77-bf37-52703ccf837a.webp&sig=duKe9SeI7p%2B6sd0j9gprBMg4VQdxnKV2B5ypKguk2zA%3D"
                };
            });

            const list: MenuItemPagination = {
                ...success.data,
                data: menuData
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