import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useNotification } from "../../hooks/useNotification";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { configuration } from "../../config/config";
import { useOrder } from "../../hooks/useCurrentOrder";
import CartIcon from "../Icons/CartIcon";
import BurgerButton from "../Icons/BurgerButton";
import CloseButton from "../Icons/CloseButton";

interface NavItemProps {
  menuName: string;
  route?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onNavClick?: () => void;
}

export const NavItem = ({ menuName, route, onClick, onNavClick }: NavItemProps) => {
  const baseClasses =
    "text-white tracking-tighter text-4xl block py-1 pr-4 pl-3 rounded border-gray-100 lg:border-0 lg:p-0 dark:border-gray-700 transition-colors duration-200";

  // Si tiene onClick, renderizar como botón/enlace clickeable
  if (onClick) {
    return (
      <li className="list-none">
        <a
          className={`${baseClasses} cursor-pointer md:text-xl font-cera-bold md:font-cera-regular ml-4 md:ml-0`}
          onClick={onClick}
        >
          {menuName}
        </a>
      </li>
    );
  }

  // Si tiene route, renderizar como NavLink normal
  return (
    <li>
      <NavLink
        to={route!}
        className={({ isActive }) =>
          `${baseClasses} md:text-3xl font-cera-bold ml-4 ${
            isActive ? "text-yellow-active" : "text-white"
          }`
        }
        aria-current="page"
        onClick={onNavClick}
      >
        {menuName}
      </NavLink>
    </li>
  );
};

export const Header = () => {
  const { logOut, setToken, signOut } = useAuth();
  const { setShowSideCart, showSideCart, cartItemsCount, isAtCategoriesRoute } =
    useOrder();
  const { enqueueSnackbar } = useNotification();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openMenu = (currentState: boolean) => {
    if(showSideCart) {
      setShowSideCart(currentState)
    }
    setIsMenuOpen(!currentState)
  }

  const openSideCart = (currentState: boolean) => {
    if(isMenuOpen) {
      setIsMenuOpen(currentState)
    }
    setShowSideCart(!currentState)
  }

  const SignOut = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    try {
      await logOut();
      setToken(null);
      signOut();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      enqueueSnackbar((error as Error).message, { variant: "error" });
    }
    event.preventDefault();
  };

  const menuLinks = [
    {
      menuName: "Menús",
      route: ROUTES.MENUS,
    },
    {
      menuName: "Pedidos",
      route: `/${ROUTES.GET_ORDERS_ROUTE}`,
    },
    {
      menuName: "Cerrar sesión",
      onClick: SignOut,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 overflow-x-hidden">
        <nav className="bg-green-50 h-28 md:h-auto flex flex-row items-center md:pt-2">

          <div className="flex flex-row md:grid md:grid-cols-[1fr_280px_1fr] lg:grid-cols-[1fr_320px_1fr] md:grid-rows-[80px_32px] md:gap-0 items-center md:items-start basis-full md:bg-white">

            <section className="bg-green-50 hidden md:flex basis-1/3 flex-row justify-end md:h-20 lg:pr-8">
              <ul className="flex flex-row items-center justify-center h-full">
                {menuLinks
                  .filter((link) => link.menuName !== "Cerrar sesión")
                  .map((link, index) => (
                    <NavItem
                      key={index}
                      menuName={link.menuName}
                      route={link.route}
                      onClick={link.onClick}
                      onNavClick={closeMenu}
                    />
                  ))}
              </ul>
            </section>

            <Link
              to={"/"}
              className="basis-4/6 shrink-0 flex items-center md:justify-center md:h-28"
            >
              <div className="bg-green-50 md:h-28 md:w-xs md:max-w-xs md:flex justify-center rounded-b-2xl md:shrink-0 md:basis-full">
                <img
                  src={configuration.company.logo}
                  className="h-[5rem] md:h-24 w-auto md:min-w-24"
                  alt={configuration.company.name}
                />
              </div>
            </Link>

            <div className="basis-2/6 md:basis-1/3 shrink-0 grid gap-0 grid-cols-2 md:grid-cols-[1fr_6.4fr_17fr] lg:grid-cols-[64px_64px_128px_64px] content-start pr-2 bg-green-50 md:h-20 md:content-center">
              {isAtCategoriesRoute() && (
                <button
                  type="button"
                  className="md:col-start-2 relative inline-flex items-center p-3 text-sm font-medium text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 md:w-[64px]"
                  onClick={() => openSideCart(showSideCart)}
                >
                  <CartIcon
                    className="w-9 h-9 text-white cursor-pointer"
                    color="white"
                    width="64"
                    height="56"
                  />
                  <span className="sr-only">Notifications</span>
                  <div className="absolute inline-flex items-center justify-center w-5 h-5 text-md text-white bg-red-1000 rounded-full top-[8px] end-[5px] font-cera-regular">
                    {cartItemsCount}
                  </div>
                </button>
              )}

              <section className="hidden md:flex items-center justify-center col-start-3">
                {menuLinks
                  .filter((link) => link.menuName === "Cerrar sesión")
                  .map((link, index) => (
                    <NavItem
                      key={index}
                      menuName={link.menuName}
                      route={link.route}
                      onClick={link.onClick}
                    />
                  ))}
              </section>

              <button
                type="button"
                className="md:hidden col-start-2 inline-flex justify-center items-center p-3 text-sm text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="mobile-menu-2"
                aria-expanded={isMenuOpen}
                onClick={() => openMenu(isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <BurgerButton
                  className="w-9 h-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                />
              </button>
            </div>
          </div>
        </nav>

        <div
          className={`
              ${isMenuOpen ? "block" : "hidden"}
              md:hidden relative justify-between items-center w-full basis-1/5 h-64
            `}
          id="mobile-menu-2"
        >
          <ul
            className={`
              md:hidden lg:flex 
              flex flex-col mt-4 font-medium 
              bg-green-100 mx-6 rounded-xl py-8 h-56
            `}
          >
            {menuLinks.map((link, index) => (
              <NavItem
                key={index}
                menuName={link.menuName}
                route={link.route}
                onClick={link.onClick}
                onNavClick={closeMenu}
              />
            ))}
          </ul>
          <CloseButton
            className="w-16 h-16 cursor-pointer z-10 absolute bottom-0 left-[40%]"
            color="white"
            width="32"
            height="32"
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
          />
        </div>
      </header>
    </>
  );
};
