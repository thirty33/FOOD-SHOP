import { HttpClient } from '../classes/HttpClient';
import { API_ROUTES } from '../config/routes';
import { SubordinateUsersResponse, SubordinatesService } from '../types/subordinates';

export class SubordinatesHttpService extends HttpClient implements SubordinatesService {
    constructor() {
        super(API_ROUTES.users.base);
    }

    async getSubordinates(): Promise<SubordinateUsersResponse> {
        try {
            const { data, status } = await this.http.get(API_ROUTES.users.paths.subordinates);
            
            const response = this.handleResponse<SubordinateUsersResponse>(status, data);
            
            return response;
            
        } catch (error) {
            console.error('Error fetching subordinates:', error);
            throw error;
        }
    }
}