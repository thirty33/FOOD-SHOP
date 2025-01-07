import { BreadCrumbsNavigation } from "../BreadCrumbsNavigation";
import { CheckoutSideMenu } from "../CheckoutSideMenu";
import { Header } from "../Header";

interface Props {
  children?: React.ReactNode;
}

export const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className="px-4 lg:px-6 py-2.5">
      <Header />
      <BreadCrumbsNavigation />
      <CheckoutSideMenu />
      {children}
    </div>
  );
};
