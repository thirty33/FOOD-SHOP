import React, { cloneElement, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '../../hooks/useQueryParams';

interface NavigateWithDelegateProps {
  children: ReactElement;
  to?: string;
  onNavigate?: (path: string) => void;
  preserveOtherParams?: boolean;
}

/**
 * Wrapper component that preserves query parameters when navigating
 * Can be used with any clickable component (button, link, etc.)
 * 
 * @example
 * <NavigateWithDelegate to="/orders">
 *   <CloseButton />
 * </NavigateWithDelegate>
 * 
 * @example with custom navigation
 * <NavigateWithDelegate onNavigate={(path) => console.log(path)}>
 *   <button>Custom Action</button>
 * </NavigateWithDelegate>
 */
export const NavigateWithDelegate: React.FC<NavigateWithDelegateProps> = ({ 
  children, 
  to,
  onNavigate
}) => {
  const navigate = useNavigate();
  const queryParams = useQueryParams(['delegate_user']);
  
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default if the child is a link or form element
    if (e.currentTarget.tagName === 'A' || e.currentTarget.tagName === 'BUTTON') {
      e.preventDefault();
    }
    
    // Call original onClick if it exists
    const originalOnClick = children.props.onClick;
    if (originalOnClick && !to && !onNavigate) {
      originalOnClick(e);
      return;
    }
    
    if (to) {
      // Build the path with delegate_user param if it exists
      const delegateUser = queryParams.delegate_user;
      let path = to;
      
      if (delegateUser) {
        const separator = to.includes('?') ? '&' : '?';
        path = `${to}${separator}delegate_user=${delegateUser}`;
      }
      
      if (onNavigate) {
        onNavigate(path);
      } else {
        navigate(path);
      }
    } else if (originalOnClick) {
      // If no navigation path provided, just call the original onClick
      originalOnClick(e);
    }
  };
  
  // Clone the child element and override its onClick handler
  return cloneElement(children, {
    onClick: handleClick
  });
};