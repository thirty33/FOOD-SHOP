import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useContext } from "react";
import { GlobalContext } from "../../context/globalContext";

export const BreadCrumbsNavigation = () => {

  const { selectedMenu } = useContext(GlobalContext);

  const location = useLocation();
  const navigate = useNavigate();

  const isMenuRoute = location.pathname === ROUTES.MENUS;
  const isCartRoute = location.pathname === `/${ROUTES.CART_ROUTE}`;
  const isCategoryRoute = location.pathname.includes("/categories");

  const showCategoryRoute =
    location.pathname.includes("/categories") || isCartRoute;

  const renderMenuLink = () => {
    if (isMenuRoute) {
      return (
        <span className="inline-flex items-center text-lg font-medium text-gray-500 cursor-default">
          Menus
        </span>
      );
    }
    return (
      <Link
        to={{ pathname: "/" }}
        className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
      >
        Menus
      </Link>
    );
  };

  const renderCategoryLink = () => {

    let title: string | undefined = "";

    if (selectedMenu) {
      title = selectedMenu?.title;
    }

    const handleNavigate = () => {
      navigate(-1);
    };

    if (!showCategoryRoute) {
      return null;
    }

    return (
      <li>
        <div className="flex items-center">
          <svg
            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 9 4-4-4-4"
            />
          </svg>
          {isCategoryRoute ? (
            <span className="ms-1 text-lg font-medium text-gray-500 md:ms-2 dark:text-gray-400 cursor-default">
              Categorías del {title}
            </span>
          ) : (
            <Link
              onClick={handleNavigate}
              to={"#"}
              className="ms-1 text-lg font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              Categorías del {title}
            </Link>
          )}
        </div>
      </li>
    );
  };

  const renderCartLink = () => {
    if (!isCartRoute) {
      return null;
    }

    return (
      <li aria-current="page">
        <div className="flex items-center">
          <svg
            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="ms-1 text-lg font-medium text-gray-500 md:ms-2 dark:text-gray-400 cursor-default">
            Cart
          </span>
        </div>
      </li>
    );
  };

  return (
    <section className="mt-8">
      <nav className="flex pt-2.5 pb-5" aria-label="Breadcrumb">
        <div className="flex">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">{renderMenuLink()}</li>
              {renderCategoryLink()}
              {renderCartLink()}
            </ol>
          </ol>
        </div>
      </nav>
    </section>
  );
};
