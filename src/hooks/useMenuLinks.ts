import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import { useQueryParams } from './useQueryParams';
import { useNavigationParamsContext } from '../context/NavigationParamsContext';
import { ROUTES } from '../config/routes';
import { textMessages } from '../config/textMessages';
import { configuration } from '../config/config';

interface MenuLink {
  menuName: string;
  route?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  showInMobile?: boolean;
  showInDesktop?: boolean;
}

/**
 * Hook to generate menu links based on user permissions and authentication state
 * Centralizes all menu link logic and dependencies
 */
export const useMenuLinks = () => {
  const { logOut, setToken, signOut, user } = useAuth();
  const { enqueueSnackbar } = useNotification();
  const { clearParams } = useNavigationParamsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useQueryParams(['delegate_user']);

  const menuLinks = useMemo(() => {
    // Check if we're on the subordinates page
    const isSubordinatesRoute = location.pathname === ROUTES.SUBORDINATES_USER;

    const handleSignOut = async (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      try {
        await logOut();
        setToken(null);
        signOut();
        clearParams();
        navigate(ROUTES.LOGIN);
      } catch (error) {
        enqueueSnackbar((error as Error).message, {
          variant: "error",
          autoHideDuration: configuration.toast.duration
        });
      }
      event.preventDefault();
    };

    const links: MenuLink[] = [];

    // Only show Menus link when NOT on subordinates page
    if (!isSubordinatesRoute) {
      links.push({
        menuName: textMessages.HEADER.MENUS,
        route: ROUTES.MENUS,
        showInMobile: true,
        showInDesktop: true,
      });
    }

    // Always show Orders link
    links.push({
      menuName: textMessages.HEADER.ORDERS,
      route: `/${ROUTES.GET_ORDERS_ROUTE}`,
      showInMobile: true,
      showInDesktop: true,
    });

    // Add subordinates link for master users
    if (user?.master_user) {
      links.push({
        menuName: 'Usuarios',
        route: ROUTES.SUBORDINATES_USER,
        showInMobile: true,
        showInDesktop: true,
      });
    }

    // Add sign out link
    links.push({
      menuName: textMessages.HEADER.SIGN_OUT,
      onClick: handleSignOut,
      showInMobile: true,
      showInDesktop: true,
    });

    return links;
  }, [logOut, setToken, signOut, clearParams, navigate, enqueueSnackbar, user, location.pathname, queryParams]);

  // Helper functions to filter links for different contexts
  const getDesktopLinks = useMemo(() => {
    return menuLinks.filter(link => link.showInDesktop !== false);
  }, [menuLinks]);

  const getMobileLinks = useMemo(() => {
    return menuLinks.filter(link => link.showInMobile !== false);
  }, [menuLinks]);

  const getMainNavLinks = useMemo(() => {
    return menuLinks.filter(link => link.menuName !== textMessages.HEADER.SIGN_OUT);
  }, [menuLinks]);

  const getSignOutLink = useMemo(() => {
    return menuLinks.find(link => link.menuName === textMessages.HEADER.SIGN_OUT);
  }, [menuLinks]);

  return {
    menuLinks,
    getDesktopLinks,
    getMobileLinks,
    getMainNavLinks,
    getSignOutLink,
  };
};