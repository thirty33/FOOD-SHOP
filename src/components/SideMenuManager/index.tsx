import { useOrder } from "../../hooks/useCurrentOrder";
import { SideModal } from "../SideModal";
import { CheckoutContent } from "../CheckoutContent";
import { ProductDetailContent } from "../ProductDetailContent";

export const SideMenuManager = () => {
  const { modalState, closeModal, isAtCategoriesRoute } = useOrder();

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
        />
      )}
    </SideModal>
  );
};