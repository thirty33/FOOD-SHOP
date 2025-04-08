import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useMemo } from "react";

export const BreadCrumbsNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer la fecha del parámetro de la URL
  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  
  // Fecha del query param ajustada con timezone
  const dateFromQuery = useMemo(() => {
    const dateParam = queryParams.get('date');
    if (dateParam) {
      try {
        // Obtener la zona horaria de la variable de entorno, o usar 'UTC' como fallback
        const timezone = import.meta.env.VITE_TIMEZONE || 'America/Santiago';
        
        // Crear un formatter que tenga en cuenta la zona horaria correcta
        const formatter = new Intl.DateTimeFormat('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: timezone
        });
        
        // Asegurarse de que la fecha se interprete correctamente con la zona horaria
        // Crear la fecha con formato ISO para mejor manejo de zonas horarias
        const dateString = `${dateParam}T00:00:00`;
        const dateObj = new Date(dateString);
        
        // Formatear la fecha usando el formatter con la zona horaria correcta
        return formatter.format(dateObj);
      } catch (e) {
        console.error("Error al parsear la fecha del query param:", e);
        return "fecha no disponible";
      }
    }
    return "fecha no disponible";
  }, [queryParams]);

  // Utilizar useMemo para recalcular estas variables cuando la ruta o los queryParams cambien
  const { 
    isMenuRoute, 
    isCartRoute, 
    isCategoryRoute, 
    showCategoryRoute 
  } = useMemo(() => {
    const isMenuRoute = location.pathname === ROUTES.MENUS;
    const isCartRoute = location.pathname === `/${ROUTES.CART_ROUTE}`;
    const isCategoryRoute = location.pathname.includes("/categories");
    const showCategoryRoute = isCategoryRoute || isCartRoute;

    return {
      isMenuRoute,
      isCartRoute,
      isCategoryRoute,
      showCategoryRoute
    };
  }, [location.pathname, location.search]); // Dependencias: path y queryParams

  const renderMenuLink = useMemo(() => {
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
  }, [isMenuRoute]);

  const renderCategoryLink = useMemo(() => {
    if (!showCategoryRoute) {
      return null;
    }

    // Usar la fecha del query param para construir el título
    const title = `Menú del ${dateFromQuery}`;

    const handleNavigate = () => {
      navigate(-1);
    };

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
  }, [showCategoryRoute, isCategoryRoute, dateFromQuery, navigate, location.search]);

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
    <section className="mt-8">
      <nav className="flex pt-2.5 pb-5" aria-label="Breadcrumb">
        <div className="flex">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">{renderMenuLink}</li>
              {renderCategoryLink}
              {renderCartLink}
            </ol>
          </ol>
        </div>
      </nav>
    </section>
  );
};