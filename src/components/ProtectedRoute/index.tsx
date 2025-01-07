import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Layout } from "../Layout";

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
      <Layout>{children}</Layout>
    </>
  );
};
