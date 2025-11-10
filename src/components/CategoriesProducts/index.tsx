import { useCategories } from "../../hooks/useCategories";
import { ProductItem } from "../Products";
import { Product, Category
  // , Subcategory
} from "../../types/categories";
import { ExtendedCategory } from "../../helpers/categoryGrouping";
import { SpinnerLoading } from "../SpinnerLoading";
import { useOrder } from "../../hooks/useCurrentOrder";
import { isAgreementIndividual, isAgreementConsolidated } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/user";
import { useMemo, useRef } from "react";
// import { useScrollToClose } from "../../hooks/useScrollToClose";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import ArrowUpIcon from "../Icons/ArrowUpIcon";
import { textMessages } from "../../config/textMessages";

// Component for product list of a category
const ProductList = ({ 
  products, 
  maximumOrderTime, 
  category, 
  user 
}: { 
  products: Product[], 
  maximumOrderTime: string,
  category: Category | ExtendedCategory,
  user: User
}) => {
  const { addProductToCart } = useOrder();
  
  // Function to calculate maximumOrderTime per product
  const getProductMaximumOrderTime = useMemo(() => {
    return (product: Product): string => {
      // For agreement users (individual or consolidated), calculate per product
      if ((isAgreementIndividual(user) || isAgreementConsolidated(user)) && category.category) {
        // Find the correct category_line for this product using its category_id
        const productCategoryLine = category.category.category_lines.find(
          (line: any) => line.source_category_id === product.category_id
        );

        if (productCategoryLine) {
          return productCategoryLine.maximum_order_time;
        }
      }

      // For all other users, use the category's maximumOrderTime
      return maximumOrderTime;
    };
  }, [user, category, maximumOrderTime]);
  
  // Function to get subcategories for a product
  const getProductSubcategories = useMemo(() => {
    return (product: Product): any[] => {
      // For agreement users (individual or consolidated)
      if ((isAgreementIndividual(user) || isAgreementConsolidated(user)) && category.category && category.category.subcategories) {
        // Filter subcategories that match the product's category_id
        return category.category.subcategories.filter(
          (sub: any) => sub.source_category_id === product.category_id
        );
      }

      return [];
    };
  }, [user, category]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 2xl:gap-8">
      {products.map((product, index) => (
        <ProductItem
          key={`product-${product.id}-${product.category_id}-${index}`}
          id={product.id}
          imageLight={product.image}
          price={product.price_list_lines[0].unit_price}
          title={product.name}
          ingredients={product.ingredients}
          addProductToCart={addProductToCart}
          maximumOrderTime={getProductMaximumOrderTime(product)}
          productSubcategories={getProductSubcategories(product)}
        />
      ))}
    </div>
  );
};

// Component for a category section
const CategorySection = ({
  category,
  user,
}: {
  category: Category | ExtendedCategory;
  user: User;
}): JSX.Element => {
  const completeCategory = category.show_all_products;

  // Determine where to get products based on user type
  const products = useMemo(() => {
    // For agreement users (individual or consolidated) with subcategories: always get from category?.category?.products
    if ((isAgreementIndividual(user) || isAgreementConsolidated(user)) && category?.category?.subcategories && category.category.subcategories.length > 0) {
      return category?.category?.products;
    }

    // For other users: maintain original logic with show_all_products
    const result = !completeCategory ? category.products : category?.category?.products;
    return result;
  }, [user, category, completeCategory]);

  // Get the maximum_order_time from the first category_lines entry, or "Not available" if empty
  const maximumOrderTime =
    category?.category?.category_user_lines?.[0]?.maximum_order_time ||
    category?.category?.category_lines?.[0]?.maximum_order_time ||
    "No disponible";

  // Get subcategories, if any
  const subcategories = category?.category?.subcategories || [];

  const showSubcategories = useMemo(
    () => (isAgreementIndividual(user) || isAgreementConsolidated(user)) && subcategories.length > 0,
    [subcategories, user]
  );

  return (

    <div className="mb-6">

      {/* Display subcategories if they exist */}
      {showSubcategories && (
        <div className="mb-2 flex justify-start font-cera-bold">
          <p className="text-4xl md:text-5xl font-bold font-cera-bold tracking-tighter text-green-100 leading-[0.8] md:leading-tight">
            {/* {subcategories.map((subcategory) => 
              subcategory.name.charAt(0).toUpperCase() + subcategory.name.slice(1).toLowerCase()
            ).join(" ")} */}
            {(() => {
              const name = category?.category?.name || "";
              return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            })()}
          </p>
        </div>
        
      )}

      {/* Show category name unless user is agreement (individual or consolidated) with subcategories */}
      {!((isAgreementIndividual(user) || isAgreementConsolidated(user)) && subcategories.length > 0) && (
        <div
          className={`flex flex-col justify-start content-start items-start ${
            showSubcategories ? "mb-1" : "mb-3 md:mb-6"
          }`}
        >
          <h2 className={`${showSubcategories ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-bold font-cera-bold tracking-tighter text-green-100 leading-[0.8] md:leading-tight`}>
            {(() => {
              const name = category?.category?.name || "";
              return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            })()}
          </h2>
        </div>
      )}
      
      {/* Show availability text only for non-convenio users */}
      {!isAgreementIndividual(user) && !isAgreementConsolidated(user) && (
        <p className="text-green-100 font-cera-regular tracking-normal text-sm md:text-base mb-3 md:mb-6">
          {maximumOrderTime}
        </p>
      )}

      {products && <ProductList products={products} maximumOrderTime={maximumOrderTime} category={category} user={user} />}
    </div>
  );
};

export const CategoriesProducts = () => {
  const { user } = useAuth();
  // const { showSideCart, setShowSideCart, isLoading: isOrderLoading, recentOperation } = useOrder();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { categories, groupedCategories, isLoading, hasMore, loadMoreCategories } =
    useCategories();
  const { isVisible, scrollToTop } = useScrollToTop();

  // Use custom hook for scroll to close functionality
  // useScrollToClose({
  //   elementRef: categoriesRef,
  //   isOpen: showSideCart,
  //   onClose: () => setShowSideCart(false),
  //   isLoading: isOrderLoading,
  //   recentOperation,
  // });

  const allCategoriesNull = categories.every(
    (category) => category.category === null
  );


  // Decide which categories to use based on user type
  // Use grouped categories for both Individual and Consolidated agreement users
  const categoriesToRender = useMemo(() => {
    return (isAgreementIndividual(user) || isAgreementConsolidated(user))
      ? groupedCategories
      : categories;
  }, [user, groupedCategories, categories]);

  return (
    <>
      <div ref={categoriesRef} className="2xl:px-80 lg:px-48">
        <div className="container mx-auto px-4">
          {!allCategoriesNull &&
            categoriesToRender.map((category: Category | ExtendedCategory, index) => (
              <CategorySection
                key={`category-${category.id}-${category.category?.id || 'null'}-${category.menu_id || 'no-menu'}-${index}`}
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
