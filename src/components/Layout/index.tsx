import { useContext } from "react";
import { BreadCrumbsNavigation } from "../BreadCrumbsNavigation";
import { CheckoutSideMenu } from "../CheckoutSideMenu";
import { CustomModal } from "../customModal/customModal";
import { Header } from "../Header";
import { GlobalContext } from "../../context/globalContext";
import { OrderContext } from "../../context/orderContext";
interface Props {
  children?: React.ReactNode;
}

export const Layout = ({ children }: Props): JSX.Element => {
  const { showModal, setShowModal } = useContext(GlobalContext);
  const { currentOrder } = useContext(OrderContext);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="">
      <Header />
      <BreadCrumbsNavigation />
      <CheckoutSideMenu />
      <CustomModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        orderId={currentOrder?.id}
        initialComment={currentOrder?.user_comment}
      />
      {children}
    </div>
  );
};
