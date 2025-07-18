import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Layout } from "../Layout";
import { OrderProvider } from "../../context/orderContext";
import { ROUTES } from "../../config/routes";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return (
    <>
      <OrderProvider>
        <Layout>{children}</Layout>
      </OrderProvider>
    </>
  );
};
