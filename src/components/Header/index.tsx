import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useNotification } from "../../hooks/useNotification";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

export const Header = () => {
  const { logOut, setToken } = useAuth();
  const { enqueueSnackbar } = useNotification();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const SignOut = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    try {
      await logOut();
      setToken(null);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      enqueueSnackbar((error as Error).message, { variant: "error" });
    }
    event.preventDefault();
  };

  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://flowbite.com" className="flex items-center">
              <img
                src="https://deliciusfood.cl/wp-content/uploads/2022/09/logo-delicius.svg"
                className="mr-3 w-auto h-20"
                alt="Flowbite Logo"
              />
              {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span> */}
            </a>
            <div className="flex items-center lg:order-2">
              <a
                href="#"
                className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                onClick={SignOut}
              >
                Cerrar sesión
              </a>

              <button
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prevState) => !prevState)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`w-6 h-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <svg
                  className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              className="justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className={`
                ${isMenuOpen ? 'block' : 'hidden'} 
                lg:flex 
                flex flex-col mt-4 font-medium 
                lg:flex-row lg:space-x-8 lg:mt-0
              `}>
                <li>
                  <NavLink
                    to={ROUTES.MENUS}
                    className={({ isActive }) => (
                      isActive ? 
                      "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" : 
                      "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    )}
                    aria-current="page"
                  >
                    Menús
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/${ROUTES.GET_ORDERS_ROUTE}`}
                    className={({ isActive }) => (
                      isActive
                      ? "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                      : "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    )}
                  >
                    Pedidos
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};