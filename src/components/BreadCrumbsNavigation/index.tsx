import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { textMessages } from "../../config/textMessages";
import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useQueryParams } from "../../hooks/useQueryParams";

// Reusable arrow component
const ArrowIcon = () => (
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
);

export const BreadCrumbsNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryParams = useQueryParams(['date', 'delegate_user']);

  const dateFromQuery = useMemo(() => {
    const dateParam = queryParams.date;
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
        console.error("Error parsing date from query param:", e);
        return "date not available";
      }
    }
    return "date not available";
  }, [queryParams]);

  const { isMenuRoute, isCartRoute, isCategoryRoute, showCategoryRoute, isOrdersRoute, isOrderDetailRoute, isSubordinatesRoute } =
    useMemo(() => {
      const isMenuRoute = location.pathname === ROUTES.MENUS;
      const isCartRoute = location.pathname === `/${ROUTES.CART_ROUTE}`;
      const isCategoryRoute = location.pathname.includes("/categories");
      const showCategoryRoute = isCategoryRoute || isCartRoute;
      const isOrdersRoute = location.pathname.includes(`/${ROUTES.GET_ORDERS_ROUTE}`) || 
                           location.pathname.includes(ROUTES.ORDER_SUMMARY_ROUTE.split(':')[0]);
      const isOrderDetailRoute = location.pathname.includes("order-detail/");
      const isSubordinatesRoute = location.pathname === ROUTES.SUBORDINATES_USER;

      return {
        isMenuRoute,
        isCartRoute,
        isCategoryRoute,
        showCategoryRoute,
        isOrdersRoute,
        isOrderDetailRoute,
        isSubordinatesRoute,
      };
    }, [location.pathname, location.search]);

  const renderMenuMessage = useMemo(() => {
    if (isMenuRoute) {
      const delegateUser = queryParams.delegate_user;
      const isMasterUser = user?.master_user;
      
      return (
        <section className="flex flex-col justify-center text-center text-green-100">
          {delegateUser && isMasterUser && (
            <div className="mb-4 flex justify-center items-center">
              <Link 
                to={ROUTES.SUBORDINATES_USER}
                className="font-cera-light text-lg md:text-2xl text-gray-400 hover:text-yellow-active"
              >
                {delegateUser.toLowerCase()}
              </Link>
              <div className="mx-2 flex items-center">
                <ArrowIcon />
              </div>
              <span className="font-cera-light text-lg md:text-2xl text-gray-400">menús</span>
            </div>
          )}
          <p className="font-cera-bold text-3xl md:text-5xl lg:text-6xl tracking-tight">
            Selecciona día de entrega
          </p>
          <p className="font-cera-regular tracking-tight text-base md:text-2xl lg:text-3xl leading-3">
            ¿Que día necesitas que entreguemos tu pedido?
          </p>
        </section>
      );
    }
  }, [isMenuRoute, queryParams, user]);

  const renderMenuLink = useMemo(() => {
    const delegateUser = queryParams.delegate_user;
    const isMasterUser = user?.master_user;
    const toPath = delegateUser 
      ? { pathname: ROUTES.MENUS, search: `?delegate_user=${delegateUser}` }
      : { pathname: ROUTES.MENUS };
    
    // If there's a delegate user and the user is master, show special format
    if (delegateUser && isMasterUser) {
      return (
        <div className="flex items-center">
          <Link
            to={ROUTES.SUBORDINATES_USER}
            className="font-cera-light tracking-tight text-sm md:text-xl font-medium text-gray-400 hover:text-yellow-active"
          >
            {delegateUser.toLowerCase()}
          </Link>
          <div className="flex items-center">
            <ArrowIcon />
          </div>
          <Link
            to={toPath}
            className="font-cera-light tracking-tight text-sm md:text-xl font-medium text-gray-400 hover:text-yellow-active"
          >
            {textMessages.BREADCRUMBS.MENUS}
          </Link>
        </div>
      );
    }
    
    // Normal behavior when there's no delegate user or user is not master
    return (
      <Link
        to={toPath}
        className="font-cera-light tracking-tight inline-flex items-center text-sm md:text-xl font-medium text-gray-400 hover:text-yellow-active dark:text-gray-400 dark:hover:text-white"
      >
        {textMessages.BREADCRUMBS.MENUS}
      </Link>
    );
  }, [queryParams, user]);

  const renderCategoryLink = useMemo(() => {
    if (!showCategoryRoute) {
      return null;
    }

    const title = `${textMessages.BREADCRUMBS.MENU} ${dateFromQuery}`;

    const handleNavigate = () => {
      navigate(-1);
    };

    return (
      <li>
        <div className="flex items-center justify-center font-cera-light tracking-tight">
          <ArrowIcon />
          {isCategoryRoute ? (
            <span className="ms-1 text-sm md:text-xl font-medium text-gray-400 md:ms-2 cursor-default">
              {title}
            </span>
          ) : (
            <Link
              onClick={handleNavigate}
              to={"#"}
              className="ms-1 text-sm md:text-xl font-medium text-gray-700 hover:text-blue-600 md:ms-2"
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
          <ArrowIcon />
          <span className="ms-1 text-lg font-medium text-gray-500 md:ms-2 dark:text-gray-400 cursor-default">
            Cart
          </span>
        </div>
      </li>
    );
  }, [isCartRoute]);

  const renderOrderDetailLink = useMemo(() => {
    if (!isOrderDetailRoute) {
      return null;
    }

    const delegateUser = queryParams.delegate_user;
    const ordersPath = delegateUser 
      ? `/${ROUTES.GET_ORDERS_ROUTE}?delegate_user=${delegateUser}`
      : `/${ROUTES.GET_ORDERS_ROUTE}`;

    return (
      <>
        <Link
          to={ordersPath}
          className="font-cera-light tracking-tight inline-flex items-center text-sm md:text-xl font-medium text-gray-400 hover:text-yellow-active dark:text-gray-400 dark:hover:text-white"
        >
          Mis pedidos
        </Link>
        <li aria-current="page">
          <div className="flex items-center">
            <ArrowIcon />
            <span className="ms-1 text-sm md:text-xl font-cera-light tracking-tight text-gray-400 md:ms-2 cursor-default">
              Detalle del pedido
            </span>
          </div>
        </li>
      </>
    );
  }, [isOrderDetailRoute, queryParams]);

  // Don't render anything if on orders routes (except order detail)
  if (isOrdersRoute && !isOrderDetailRoute) {
    return null;
  }

  // Handle subordinates route - show only "Company Users"
  if (isSubordinatesRoute) {
    return (
      <section className="mt-8 px-1 md:px-0 2xl:px-[21rem] lg:px-52">
        <nav className="flex pt-2.5 pb-5 justify-center content-center" aria-label="Breadcrumb">
          <span className="font-cera-light tracking-tight text-sm md:text-xl font-medium text-gray-400">
            Usuarios de la empresa
          </span>
        </nav>
      </section>
    );
  }

  return (
    <section className="mt-8 px-1 md:px-0 2xl:px-[21rem] lg:px-52">
      {isMenuRoute && <>{renderMenuMessage}</>}
      {!isMenuRoute && (
        <nav className="flex pt-2.5 pb-5 justify-center content-center" aria-label="Breadcrumb">
          <ul className="flex">
            {!isOrderDetailRoute && renderMenuLink}
            {renderCategoryLink}
            {renderCartLink}
            {renderOrderDetailLink}
          </ul>
        </nav>
      )}
    </section>
  );
};
