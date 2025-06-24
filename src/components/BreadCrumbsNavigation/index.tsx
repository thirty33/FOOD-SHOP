import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useMemo } from "react";

export const BreadCrumbsNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const dateFromQuery = useMemo(() => {
    const dateParam = queryParams.get("date");
    if (dateParam) {
      try {

        const timezone = import.meta.env.VITE_TIMEZONE || "America/Santiago";

        const formatter = new Intl.DateTimeFormat("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: timezone,
        });

        const dateString = `${dateParam}T00:00:00`;
        const dateObj = new Date(dateString);

        return formatter.format(dateObj);
      } catch (e) {
        console.error("Error al parsear la fecha del query param:", e);
        return "fecha no disponible";
      }
    }
    return "fecha no disponible";
  }, [queryParams]);

  const { isMenuRoute, isCartRoute, isCategoryRoute, showCategoryRoute } =
    useMemo(() => {
      const isMenuRoute = location.pathname === ROUTES.MENUS;
      const isCartRoute = location.pathname === `/${ROUTES.CART_ROUTE}`;
      const isCategoryRoute = location.pathname.includes("/categories");
      const showCategoryRoute = isCategoryRoute || isCartRoute;

      return {
        isMenuRoute,
        isCartRoute,
        isCategoryRoute,
        showCategoryRoute,
      };
    }, [location.pathname, location.search]);

  const renderMenuMessage = useMemo(() => {
    if (isMenuRoute) {
      return (
        <section className="flex flex-col justify-center text-center text-green-100">
          <p className="font-cera-bold text-3xl md:text-5xl lg:text-6xl tracking-tight">
            Selecciona día de entrega
          </p>
          <p className="font-cera-regular tracking-tight text-base md:text-2xl lg:text-3xl leading-3">
            ¿Que día necesitas que entreguemos tu pedido?
          </p>
        </section>
      );
    }
  }, [isMenuRoute]);

  const renderMenuLink = useMemo(() => {
    return (
      <Link
        to={{ pathname: "/" }}
        className="font-cera-light tracking-tight inline-flex items-center text-md lg:text-xl font-medium text-gray-400 hover:text-yellow-active dark:text-gray-400 dark:hover:text-white"
      >
        Menús
      </Link>
    );
  }, []);

  const renderCategoryLink = useMemo(() => {
    if (!showCategoryRoute) {
      return null;
    }

    const title = `Menú ${dateFromQuery}`;

    const handleNavigate = () => {
      navigate(-1);
    };

    return (
      <li>
        <div className="flex items-center justify-center font-cera-light tracking-tight">
          <svg
            className="rtl:rotate-180 w-3 h-3 text-gray-400 ml-2"
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
            <span className="ms-1 text-md lg:text-xl font-medium text-gray-400 md:ms-2 cursor-default">
              {title}
            </span>
          ) : (
            <Link
              onClick={handleNavigate}
              to={"#"}
              className="ms-1 text-lg lg:text-xl font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              Categorías del {title}
            </Link>
          )}
        </div>
      </li>
    );
  }, [
    showCategoryRoute,
    isCategoryRoute,
    dateFromQuery,
    navigate,
    location.search,
  ]);

  const renderCartLink = useMemo(() => {
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
  }, [isCartRoute]);

  return (
    <section className="mt-8 px-1 md:px-0 2xl:px-[21rem] lg:px-52">
      {isMenuRoute && <>{renderMenuMessage}</>}
      {!isMenuRoute && (
        <nav className="flex pt-2.5 pb-5 justify-center content-center lg:justify-start" aria-label="Breadcrumb">
          <ul className="flex">
            {renderMenuLink}
            {renderCategoryLink}
            {renderCartLink}
          </ul>
        </nav>
      )}
    </section>
  );
};
