import { MenuData } from './menus.d.ts';
import { Pagination } from './responses.d.ts';

export interface SubordinateUser {
  nickname: string;
  email: string | null;
  role: string | null;
  company_name: string | null;
  branch_name: string;
  branch_address: string;
  available_menus: MenuData[];
}

export interface SubordinateUsersResponse {
  status: 'success';
  message: string;
  data: Pagination<SubordinateUser>;
}

export interface SubordinateUsersError {
  status: 'error';
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface SubordinatesParams {
  page?: number;
  per_page?: number;
  // User filters
  company_search?: string;
  branch_search?: string;
  user_search?: string;
  // Menu filters
  start_date?: string;
  end_date?: string;
  order_status?: string;
}

export interface SubordinatesService {
  getSubordinates(params?: SubordinatesParams): Promise<SubordinateUsersResponse>;
}