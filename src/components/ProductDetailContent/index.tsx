import { useMemo } from "react";
import { Product } from "../../types/categories";
import { configuration } from "../../config/config";
import MonkeyIcon from "../Icons/MonkeyIcon";
import { useQuantityChange } from "../../hooks/useQuantityChange";

interface ProductDetailContentProps {
  product: Product;
}

export const ProductDetailContent = ({ product }: ProductDetailContentProps) => {
  const { showPrices } = useQuantityChange();
  
  const IngredientsText = useMemo(() => {
    return product.ingredients.map((ingredient, index, row) => {
      const formattedText = ingredient.descriptive_text.charAt(0).toUpperCase() + ingredient.descriptive_text.slice(1).toLowerCase();
      return `${formattedText}${index + 1 === row.length ? '.' : ','}`
    }).join(' ')
  }, [product.ingredients]);

  return (
    <div className="flex flex-col px-6 pt-4 h-full">
      {/* Header with monkey icon */}
      <div className="flex items-center justify-center gap-1 pb-4">
        <div className="">
          <MonkeyIcon className="w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 fill-white stroke-white" />
        </div>
        <div className="">
          <h2 className="font-bold text-lg md:text-2xl lg:text-3xl text-white font-cera-bold tracking-tighter whitespace-nowrap">
            Detalle
          </h2>
        </div>
      </div>

      {/* Product image */}
      <div className="h-48 md:h-64 w-full overflow-hidden rounded-lg md:rounded-2xl mb-4">
        {product.image ? (
          <img
            className="w-full h-full object-cover object-center"
            src={product.image}
            alt={product.name}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-center p-4"
            style={{ backgroundColor: '#E6E6E6' }}
          >
            <span 
              className="text-lg md:text-xl font-cera-bold leading-tight"
              style={{ color: '#CCCCCC' }}
            >
              Imagen no disponible
            </span>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-2xl md:text-3xl font-semibold font-cera-bold tracking-tighter leading-tight text-white py-2 text-left">
          {product.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase() : ''}
        </div>

        <div className="flex items-center justify-start gap-4 mb-2">
          <span className="text-lg md:text-xl font-cera-medium tracking-tighter text-white">
            Ingredientes
          </span>
        </div>

        <div className="mb-4 space-y-2 text-left">
          <section className="text-base md:text-lg text-white space-y-1 font-cera-light tracking-tighter leading-5">
            <p className="text-wrap">
              {IngredientsText}
            </p>
          </section>
        </div>

        {showPrices && (
          <div className="text-left flex flex-col gap-2 justify-start mb-4">
            <p className="text-lg md:text-xl font-extrabold leading-tight text-white font-cera-bold tracking-tighter">
              Precio neto: {product.price_list_lines[0]?.unit_price || 'N/A'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};