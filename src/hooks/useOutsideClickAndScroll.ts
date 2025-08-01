import { useEffect, RefObject } from 'react';

interface UseOutsideClickAndScrollOptions {
  elementRef: RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
  excludeSelectors?: string[];
}

export const useOutsideClickAndScroll = ({ 
  elementRef, 
  isOpen, 
  onClose, 
  excludeSelectors = [] 
}: UseOutsideClickAndScrollOptions) => {
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let touchX = 0;
    let touchY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
      }
    };

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element || !isOpen) return;

      // Use touch coordinates if available, otherwise use mouse coordinates
      const currentX = touchX || mouseX;
      const currentY = touchY || mouseY;
      
      // If no valid coordinates (0,0), don't close the menu
      if (currentX === 0 && currentY === 0) return;

      // Get element bounds
      const rect = element.getBoundingClientRect();
      
      // Check if pointer is within the element bounds
      const isPointerWithinElement = (
        currentX >= rect.left &&
        currentX <= rect.right &&
        currentY >= rect.top &&
        currentY <= rect.bottom
      );

      // If scrolling outside the element, close it
      if (!isPointerWithinElement) {
        onClose();
      }
    };

    const handleClick = (event: MouseEvent) => {
      const element = elementRef.current;
      if (!element || !isOpen) return;

      const target = event.target as Element;
      
      // Check if click is within the element
      const isClickWithinElement = element.contains(target);
      
      // Check if click is on an excluded element
      const isClickOnExcludedElement = excludeSelectors.some(selector => {
        const excludedElement = document.querySelector(selector);
        const contains = excludedElement && excludedElement.contains(target);
        return contains || !!target.closest(selector);
      });

      // Close if click is outside the element and not on excluded elements
      if (!isClickWithinElement && !isClickOnExcludedElement) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      
      // Add a small delay before enabling scroll detection
      const scrollTimeoutId = setTimeout(() => {
        window.addEventListener('scroll', handleScroll);
      }, 100);
      
      // Add a small delay to prevent the same click that opened the menu from closing it
      const clickTimeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClick);
      }, 0);
      
      return () => {
        clearTimeout(scrollTimeoutId);
        clearTimeout(clickTimeoutId);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mousedown', handleClick);
      };
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose, elementRef, excludeSelectors]);
};