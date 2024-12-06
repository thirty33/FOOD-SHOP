import { useCategories } from "../../hooks/useCategories";
import { ProductItem } from "../Products";
import { Product, Category } from "../../types/categories";
import { SpinnerLoading } from "../SpinnerLoading";

// Componente para la lista de productos de una categoría
const ProductList = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      // <ProductCard key={product.id} product={product} />
      <ProductItem
        key={product.id}
        id={product.id}
        imageLight={product.image}
        imageDark={product.image}
        price={product.price_list_lines[0].unit_price}
        title={product.name}
      />
    ))}
  </div>
);

// Componente para una categoría
const CategorySection = ({ category }: { category: Category }): JSX.Element => {
  const completeCategory = category.show_all_products;

  const products = !completeCategory
    ? category.products
    : category?.category?.products;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {category?.category?.name}
      </h2>
      {products && <ProductList products={products} />}
    </div>
  );
};

export const CategoriesProducts = () => {
  const { categories, isLoading } = useCategories();

  const allCategoriesNull = categories.every(category => category.category === null);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {!allCategoriesNull && categories.map((category) => (
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
    </>
  );
};
