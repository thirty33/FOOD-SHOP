import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useAuth } from "../../hooks/useAuth";

interface LinkWithQueryParamsProps extends Omit<LinkProps, 'to'> {
  to: string;
}

export const LinkWithQueryParams: React.FC<LinkWithQueryParamsProps> = ({ to, children, ...props }) => {
  const queryParams = useQueryParams(['delegate_user']);
  const { user } = useAuth();
  
  // Construir la URL con el parámetro delegate_user si existe
  const buildUrl = (path: string) => {
    // Only apply delegate_user logic if user is master
    if (!user?.master_user) {
      return path;
    }

    const searchParams = new URLSearchParams();
    
    if (queryParams.delegate_user) {
      searchParams.set('delegate_user', queryParams.delegate_user);
    }
    
    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  };
  
  return (
    <Link to={buildUrl(to)} {...props}>
      {children}
    </Link>
  );
};