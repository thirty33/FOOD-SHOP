import { useState, useEffect, useCallback } from 'react';

export const useScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    // Show button when page is scrolled up to given distance
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    // Use passive listeners for better performance on mobile
    const options = { passive: true };
    
    window.addEventListener('scroll', toggleVisibility, options);
    window.addEventListener('touchmove', toggleVisibility, options);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('touchmove', toggleVisibility);
    };
  }, [toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return { isVisible, scrollToTop };
};