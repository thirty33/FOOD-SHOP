import { useEffect, RefObject } from 'react';
import { CHECKOUT_SIDE_MENU_CLASS } from '../config/constant';

interface UseScrollToCloseOptions {
  elementRef: RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

export const useScrollToClose = ({ elementRef, isOpen, onClose }: UseScrollToCloseOptions) => {
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element || !isOpen) return;

      // Get element bounds
      const rect = element.getBoundingClientRect();
      
      // Check if mouse is within the element bounds
      const isMouseWithinElement = (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );

      // Check if mouse is within the CheckoutSideMenu (using class selector)
      let isMouseWithinCheckoutSideMenu = false;
      const checkoutSideMenu = document.querySelector(`.${CHECKOUT_SIDE_MENU_CLASS}`);
      if (checkoutSideMenu) {
        const checkoutRect = checkoutSideMenu.getBoundingClientRect();
        isMouseWithinCheckoutSideMenu = (
          mouseX >= checkoutRect.left &&
          mouseX <= checkoutRect.right &&
          mouseY >= checkoutRect.top &&
          mouseY <= checkoutRect.bottom
        );
      }

      const shouldClose = isMouseWithinElement && !isMouseWithinCheckoutSideMenu;
      
      if (shouldClose) {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, onClose, elementRef]);
};