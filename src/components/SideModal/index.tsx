import { ReactNode } from "react";
import { CHECKOUT_SIDE_MENU_CLASS } from "../../config/constant";
import CloseButton from "../Icons/CloseButton";

interface SideModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isAtCategoriesRoute: boolean;
}

export const SideModal = ({ children, isOpen, onClose, isAtCategoriesRoute }: SideModalProps) => {
  return (
    <aside
      className={`${
        isOpen && isAtCategoriesRoute ? "flex" : "hidden"
      } ${CHECKOUT_SIDE_MENU_CLASS} flex-col fixed rounded-t-3xl z-50 bg-green-100`}
    >
      <CloseButton
        className="w-8 h-8 md:w-12 md:h-12 cursor-pointer z-10 absolute top-[-1rem] md:top-[-1.5rem] right-2"
        color="white"
        width="8"
        height="8"
        onClick={onClose}
      />
      {children}
    </aside>
  );
};