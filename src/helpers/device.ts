/**
 * Helper function to detect if the user is on a mobile device
 * Uses viewport width breakpoint matching Tailwind's mobile breakpoint
 * @returns {boolean} true if viewport width is less than 768px (md breakpoint)
 */
export const isMobileDevice = (): boolean => {
  // Check viewport width - matches Tailwind's md breakpoint (768px)
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

/**
 * Helper function to detect if the user is on a tablet device
 * @returns {boolean} true if viewport width is between 768px and 1024px
 */
export const isTabletDevice = (): boolean => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    return width >= 768 && width < 1024;
  }
  return false;
};

/**
 * Helper function to detect if the user is on a desktop device
 * @returns {boolean} true if viewport width is 1024px or greater
 */
export const isDesktopDevice = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024;
  }
  return false;
};