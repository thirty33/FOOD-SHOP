import { Link, useParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { SpinnerLoading } from "../SpinnerLoading";
import { ROUTES } from "../../config/routes";

export const Categories = (): JSX.Element => {
  const { categories, isLoading } = useCategories();

  const { menuId } = useParams<{ menuId: string }>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {categories.map((deal) => (
          <div 
            key={deal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] relative">
              <img
                src={deal.image}
                alt=""
                className="w-full h-full object-cover bg-gray-100 p-4"
              />
              <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                {deal.discount}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-medium textWgray-900">
                {deal.title}
              </h3>
              {menuId && (
                <Link
                  to={`/${ROUTES.GET_PRODUCTS_ROUTE(menuId, deal.id)}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  {deal.linkText}
                  <svg
                    className="w-5 h-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                )}
            </div>
          </div>
        ))}
      </div>
      {categories.length === 0 && !isLoading && (
        <div
          className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <span className="font-medium">No hay Categorias disponibles!</span>{" "}
          para el día de hoy.
        </div>
      )}
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
    </>
  );
};
