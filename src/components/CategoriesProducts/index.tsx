import { useCategories } from "../../hooks/useCategories";
import { ProductItem } from "../Products";
import { Product, Category } from "../../types/categories";
import { SpinnerLoading } from "../SpinnerLoading";
import { useOrder } from "../../hooks/useCurrentOrder";
import { isAgreementIndividual } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/user";
import { useMemo, useRef } from "react";
import { truncateString } from "../../helpers/texts";
import { TRUNCATE_LENGTHS } from "../../config/constant";
import { useScrollToClose } from "../../hooks/useScrollToClose";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import ArrowUpIcon from "../Icons/ArrowUpIcon";
import { textMessages } from "../../config/textMessages";

// Componente para la lista de productos de una categoría
const ProductList = ({ products }: { products: Product[] }) => {
  const { addProductToCart } = useOrder();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-8">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          id={product.id}
          imageLight={product.image}
          price={product.price_list_lines[0].unit_price}
          title={product.name}
          ingredients={product.ingredients}
          addProductToCart={addProductToCart}
        />
      ))}
    </div>
  );
};

// Componente para una categoría
const CategorySection = ({
  category,
  user,
}: {
  category: Category;
  user: User;
}): JSX.Element => {
  const completeCategory = category.show_all_products;

  const products = !completeCategory
    ? category.products
    : category?.category?.products;

  // Get the maximum_order_time from the first category_lines entry, or "Not available" if empty
  const maximumOrderTime =
    category?.category?.category_user_lines?.[0]?.maximum_order_time ||
    category?.category?.category_lines?.[0]?.maximum_order_time ||
    "No disponible";

  // Get subcategories, if any
  const subcategories = category?.category?.subcategories || [];

  const showSubcategories = useMemo(
    () => isAgreementIndividual(user) && subcategories.length > 0,
    [subcategories, user]
  );

  return (
    <div className="mb-6">
      <div
        className={`flex flex-col justify-start content-start items-start ${
          showSubcategories ? "mb-1" : "mb-6"
        } md:flex-row md:items-end`}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-cera-bold tracking-tight text-green-100 text-nowrap">
          {truncateString(category?.category?.name || "", TRUNCATE_LENGTHS.CATEGORY_NAME)}
        </h2>
        <p className="text-green-100 font-cera-regular tracking-normal text-sm md:text-base md:ml-2">
          {maximumOrderTime}
        </p>
      </div>

      {/* Display subcategories if they exist */}
      {showSubcategories && (
        <div className="mb-2 flex justify-center md:justify-start font-cera-bold">
          <p className="text-green-100">
            {/* <strong>Categorías:</strong>{" "} */}
            {subcategories.map((subcategory) => subcategory.name).join(", ")}
          </p>
        </div>
      )}

      {products && <ProductList products={products} />}
    </div>
  );
};

export const CategoriesProducts = () => {
  const { user } = useAuth();
  const { showSideCart, setShowSideCart } = useOrder();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { categories, isLoading } = useCategories();
  const { isVisible, scrollToTop } = useScrollToTop();

  // Use custom hook for scroll to close functionality
  useScrollToClose({
    elementRef: categoriesRef,
    isOpen: showSideCart,
    onClose: () => setShowSideCart(false),
  });

  const allCategoriesNull = categories.every(
    (category) => category.category === null
  );

  return (
    <>
      <div ref={categoriesRef} className="2xl:px-80 lg:px-48">
        <div className="container mx-auto px-4">
          {!allCategoriesNull &&
            categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                user={user}
              />
            ))}
        </div>
        {(categories.length === 0 || allCategoriesNull) && !isLoading && (
          <div
            className="p-4 mb-4 text-sm text-green-100 rounded-lg bg-blue-50 flex justify-center"
            role="alert"
          >
            <span className="font-medium text-green-100">
              {textMessages.NO_CATEGORIES_MESSAGE}
            </span>
          </div>
        )}
        <div className="flex justify-center m-4">
          <SpinnerLoading show={isLoading} size={8} />
        </div>
      </div>
      {isVisible && (
        <ArrowUpIcon 
          className="fixed bottom-16 right-6 cursor-pointer block lg:hidden" 
          size="64" 
          onClick={scrollToTop}
        />
      )}
    </>
  );
};
