import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Layout } from "../Layout";
import { OrderProvider } from "../../context/orderContext";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <OrderProvider>
        <Layout>{children}</Layout>
      </OrderProvider>
    </>
  );
};
