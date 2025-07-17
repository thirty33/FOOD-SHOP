import { useOrder } from "../../hooks/useCurrentOrder";
import { SideModal } from "../SideModal";
import { CheckoutContent } from "../CheckoutContent";
import { ProductDetailContent } from "../ProductDetailContent";

export const SideMenuManager = () => {
  const { modalState, closeModal, isAtCategoriesRoute, setShowSideCart } = useOrder();

  const handleAddToCart = (id: string | number, quantity: number) => {
    // This will be passed to ProductDetailContent
    // When user adds to cart from detail view, switch to cart view
    setShowSideCart(true);
  };

  return (
    <SideModal 
      isOpen={modalState.isOpen} 
      onClose={closeModal}
      isAtCategoriesRoute={isAtCategoriesRoute()}
    >
      {modalState.type === 'cart' && <CheckoutContent />}
      {modalState.type === 'productDetail' && modalState.selectedProduct && (
        <ProductDetailContent 
          product={modalState.selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </SideModal>
  );
};