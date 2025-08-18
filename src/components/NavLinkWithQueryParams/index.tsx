import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../config/routes";

interface NavLinkWithQueryParamsProps extends Omit<NavLinkProps, 'to'> {
  to: string;
}

export const NavLinkWithQueryParams: React.FC<NavLinkWithQueryParamsProps> = ({ to, children, ...props }) => {
  const queryParams = useQueryParams(['delegate_user']);
  const { user } = useAuth();
  
  // Construir la URL con el parámetro delegate_user
  const buildUrl = (path: string) => {
    // Only apply delegate_user logic if user is master
    if (!user?.master_user) {
      return path;
    }

    const searchParams = new URLSearchParams();
    
    // Special logic for Menus route - always add delegate_user
    if (path === ROUTES.MENUS) {
      const delegateUser = queryParams.delegate_user || user?.nickname || user?.name || 'unknown';
      searchParams.set('delegate_user', delegateUser);
    } else if (queryParams.delegate_user) {
      // For other routes, only add if it exists
      searchParams.set('delegate_user', queryParams.delegate_user);
    }
    
    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  };
  
  return (
    <NavLink to={buildUrl(to)} {...props}>
      {children}
    </NavLink>
  );
};