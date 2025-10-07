import { MenuData } from './menus.d.ts';

export interface SubordinateUser {
  nickname: string;
  email: string | null;
  branch_name: string;
  branch_address: string;
  available_menus: MenuData[];
}

export interface SubordinateUsersResponse {
  status: 'success';
  message: string;
  data: SubordinateUser[];
}

export interface SubordinateUsersError {
  status: 'error';
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface SubordinatesService {
  getSubordinates(): Promise<SubordinateUsersResponse>;
}