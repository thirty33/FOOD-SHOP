import { useCategories } from "../../hooks/useCategories";
import { ProductItem } from "../Products";
import { Product, Category } from "../../types/categories";
import { SpinnerLoading } from "../SpinnerLoading";
import { useOrder } from "../../hooks/useCurrentOrder";
import { isAgreementIndividual } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/user";
import { useMemo, useRef } from "react";
import { useScrollToClose } from "../../hooks/useScrollToClose";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import ArrowUpIcon from "../Icons/ArrowUpIcon";
import { textMessages } from "../../config/textMessages";

// Componente para la lista de productos de una categoría
const ProductList = ({ products }: { products: Product[] }) => {
  const { addProductToCart } = useOrder();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 2xl:gap-8">
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
    <div 
      className="mb-6"
    >
      <div
        className={`flex flex-col justify-start content-start items-start ${
          showSubcategories ? "mb-1" : "mb-3 md:mb-6"
        }`}
      >
        <h2 
          className="text-4xl md:text-5xl font-bold font-cera-bold tracking-tighter text-green-100 leading-[0.8] md:leading-tight"
        >
          {(() => {
            const name = category?.category?.name || "";
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          })()}
        </h2>
        <p 
          className="text-green-100 font-cera-regular tracking-normal text-sm md:text-base"
        >
          {maximumOrderTime}
        </p>
      </div>

      {/* Display subcategories if they exist */}
      {showSubcategories && (
        <div 
          className="mb-2 flex justify-center md:justify-start font-cera-bold"
        >
          <p 
            className="text-green-100"
          >
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
  const { categories, isLoading, hasMore, loadMoreCategories } = useCategories();
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
        
        {/* Load More Button */}
        {hasMore && !isLoading && (
          <div className="flex justify-center m-4">
            <button
              onClick={loadMoreCategories}
              className="px-6 py-3 bg-lime-600 text-white font-cera-medium rounded-lg hover:bg-lime-700 transition-colors"
            >
              Cargar más
            </button>
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
