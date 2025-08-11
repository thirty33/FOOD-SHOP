import { LoginForm } from "../components/LoginForm";
import { Menus } from "../components/Menus";
import { useRoutes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ROUTES } from "../config/routes";
import { ProductDetail } from "../components/ProductDetail";
import { Cart } from "../components/Cart";
import { Checkout } from "../components/Checkout";
import { OrderSummary } from "../components/OrderSummary";
import { Orders } from "../components/Orders";
import { CategoriesProducts } from "../components/CategoriesProducts";
import { SubordinatesUser } from "../components/SubordinatesUser";

export const AppRouter = () => {
  
  const routes = useRoutes([
    {
      path: ROUTES.MENUS,
      element: (
        <ProtectedRoute>
          <Menus />
        </ProtectedRoute>
      ),
    },
    { path: ROUTES.LOGIN, element: <LoginForm /> },
    {
      path: ROUTES.CATEGORY_ROUTE,
      element: (
        <ProtectedRoute>
          <CategoriesProducts />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.PRODUCT_DETAIL_ROUTE,
      element: (
        <ProtectedRoute>
          <ProductDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.CART_ROUTE,
      element: (
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.CHECKOUT_ROUTE,
      element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.ORDER_SUMMARY_ROUTE,
      element: (
        <ProtectedRoute>
          <OrderSummary />
        </ProtectedRoute>
      )
    },
    {
      path: ROUTES.GET_ORDERS_ROUTE,
      element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      )
    },
    {
      path: ROUTES.SUBORDINATES_USER,
      element: (
        <ProtectedRoute>
          <SubordinatesUser />
        </ProtectedRoute>
      )
    }
  ]);

  return routes;
};
