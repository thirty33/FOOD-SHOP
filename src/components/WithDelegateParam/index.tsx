import React, { cloneElement, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '../../hooks/useQueryParams';

interface WithDelegateParamProps {
  children: ReactElement;
  to: string;
}

/**
 * Wrapper component that preserves the delegate_user query param when navigating
 * It modifies the onClick handler of the child component to include the delegate_user param if present
 */
export const WithDelegateParam: React.FC<WithDelegateParamProps> = ({ children, to }) => {
  const navigate = useNavigate();
  const queryParams = useQueryParams(['delegate_user']);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Build the path with delegate_user param if it exists
    const delegateUser = queryParams.delegate_user;
    const path = delegateUser ? `${to}?delegate_user=${delegateUser}` : to;
    
    navigate(path);
  };
  
  // Clone the child element and override its onClick handler
  return cloneElement(children, {
    onClick: handleClick
  });
};