import { LoginForm } from "../components/LoginForm";
import { Menus } from "../components/Menus";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ROUTES } from "../config/routes";
import { Categories } from "../components/Categories";
import { Products } from "../components/Products";
import { ProductDetail } from "../components/ProductDetail";
import { Cart } from "../components/Cart";
import { Checkout } from "../components/Checkout";
import { OrderSummary } from "../components/OrderSummary";
import { Orders } from "../components/Orders";
import { CategoriesProducts } from "../components/CategoriesProducts";

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
          {/* <Categories /> */}
          <CategoriesProducts />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.PRODUCTS_ROUTE,
      element: (
        <ProtectedRoute>
          <Products />
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
    }
  ]);

  return routes;
};
