import { BreadCrumbsNavigation } from "../BreadCrumbsNavigation";
import { CheckoutSideMenu } from "../CheckoutSideMenu";
import { Header } from "../Header";
interface Props {
  children?: React.ReactNode;
}

export const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className="">
      <Header />
      <BreadCrumbsNavigation />
      <CheckoutSideMenu />
      {children}
    </div>
  );
};
