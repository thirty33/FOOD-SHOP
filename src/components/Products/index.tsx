import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { SpinnerLoading } from "../SpinnerLoading";
import { ROUTES } from "../../config/routes";

interface ProductItemProps {
  id: string | number;
  imageLight: string;
  imageDark: string;
  title: string;
  price: string | number;
}

export const ProductItem = ({
  id,
  imageLight,
  imageDark,
  title,
  price
}: ProductItemProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div
      key={id}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="h-56 w-full">
        <Link to={`/${ROUTES.GET_PRODUCT_DETAIL_ROUTE(id)}`}>
          <img
            className="mx-auto h-full dark:hidden"
            src={imageLight}
            alt=""
          />
          <img
            className="mx-auto hidden h-full dark:block"
            src={imageDark}
            alt=""
          />
        </Link>
      </div>
      <div className="pt-6">
        <div className="mb-4 flex products-center justify-between gap-4">
          {/* <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
          {item.discount}
        </span> */}
          <div className="flex products-center justify-end gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() =>
                navigate(`/${ROUTES.GET_PRODUCT_DETAIL_ROUTE(id)}`)
              }
            >
              <span className="sr-only">Quick look</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth={2}
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            {/* <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <span className="sr-only">Add to Favorites</span>
            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z" />
            </svg>
          </button> */}
          </div>
        </div>
        <a
          href="#"
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
        >
          {title}
        </a>
        {/* <div className="mt-2 flex products-center gap-2">
        <div className="flex products-center">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
            </svg>
          ))}
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.rating}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">({item.reviews})</p>
      </div>
      <ul className="mt-2 flex products-center gap-4">
        {item.tags.map((tag, index) => (
          <li key={index} className="flex products-center gap-2">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
            </svg>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{tag}</p>
          </li>
        ))}
      </ul> */}
        <div className="mt-4 flex products-center justify-between gap-4">
          <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
            {price}
          </p>
          <button
            type="button"
            className="inline-flex products-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={() => navigate(`/${ROUTES.CART_ROUTE}`)}
          >
            <svg
              className="-ms-2 me-2 h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
              />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export const Products = (): JSX.Element => {
  const { products, isLoading } = useProducts();
  
  return (
    <>
      <section className=" py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-3">
            {products.map((item) => (
              <ProductItem
                key={item.id}
                id={item.id}
                imageLight={item.imageLight}
                imageDark={item.imageLight}
                price={item.price}
                title={item.title}
              />
            ))}
          </div>
        </div>
      </section>
      {products.length === 0 && !isLoading && (
        <div
          className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <span className="font-medium">No hay productos disponibles!</span>{" "}
          para el día de hoy.
        </div>
      )}
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
    </>
  );
};
