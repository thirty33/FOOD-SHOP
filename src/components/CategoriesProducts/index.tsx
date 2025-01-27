import { useCategories } from "../../hooks/useCategories";
import { ProductItem } from "../Products";
import { Product, Category } from "../../types/categories";
import { SpinnerLoading } from "../SpinnerLoading";
import { useOrder } from "../../hooks/useCurrentOrder";

// Componente para la lista de productos de una categoría
const ProductList = ({ products }: { products: Product[] }) => {
  const { addProductToCart } = useOrder();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          id={product.id}
          imageLight={product.image}
          imageDark={product.image}
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
const CategorySection = ({ category }: { category: Category }): JSX.Element => {
  const completeCategory = category.show_all_products;

  const products = !completeCategory
    ? category.products
    : category?.category?.products;

  // Get the maximum_order_time from the first category_lines entry, or "Not available" if empty
  const maximumOrderTime =
    category?.category?.category_lines?.[0]?.maximum_order_time ||
    "No disponible";

  // Get subcategories, if any
  const subcategories = category?.category?.subcategories || [];

  return (
    <div className="mb-12">
      <div className="flex flex-col justify-start items-center mb-2 md:flex-row md:justify-start">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{category?.category?.name}</h2>
        <p className="text-gray-600 ml-2">{maximumOrderTime}</p>
      </div>

      {/* Display subcategories if they exist */}
      {subcategories.length > 0 && (
        <div className="mb-6 flex justify-center md:justify-start">
          <p className="text-gray-600">
            <strong>Categorías:</strong> {subcategories.map((subcategory) => subcategory.name).join(", ")}
          </p>
        </div>
      )}

      {products && <ProductList products={products} />}
    </div>
  )
};

export const CategoriesProducts = () => {
  const { categories, isLoading } = useCategories();

  const allCategoriesNull = categories.every(
    (category) => category.category === null
  );

  return (
    <>
      <div className="">
        <div className="container mx-auto px-4 py-8">
          {!allCategoriesNull &&
            categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
        </div>
        {(categories.length === 0 || allCategoriesNull) && !isLoading && (
          <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">No hay categorías disponibles!</span>{" "}
            para el día de hoy.
          </div>
        )}
        <div className="flex justify-center m-4">
          <SpinnerLoading show={isLoading} size={8} />
        </div>
      </div>
    </>
  );
};
