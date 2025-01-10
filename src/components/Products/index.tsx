import { Ingredients } from "../../types/categories";

interface ProductItemProps {
  id: string | number;
  imageLight: string;
  imageDark: string;
  title: string;
  price: string | number;
  ingredients: Ingredients[];
  addProductToCart: (id: string | number, quantity: number) => void;
}

export const ProductItem = ({
  id,
  imageLight,
  imageDark,
  title,
  price,
  ingredients,
  addProductToCart,
}: ProductItemProps): JSX.Element => {
  return (
    <div
      key={id}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="h-56 w-full">
        <div onClick={() => addProductToCart(id, 1)}>
          <img className="mx-auto h-full dark:hidden" src={imageLight} alt="" />
          <img
            className="mx-auto hidden h-full dark:block"
            src={imageDark}
            alt=""
          />
        </div>
      </div>
      <div className="pt-6">
        <div className="text-3xl font-semibold leading-tight text-gray-900 hover:underline dark:text-white py-4">
          {title}
        </div>

        <div className="mb-4 flex products-center justify-between gap-4">
          <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-lg font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
            Ingredientes
          </span>
        </div>

        <div className="mb-4 space-y-2 flex content-start items-start text-start">
          <ul className="text-md text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            {ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient.descriptive_text}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex products-center justify-between gap-4">
          <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
            {price}
          </p>
          <button
            type="button"
            className="inline-flex products-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={() => addProductToCart(id, 1)}
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

