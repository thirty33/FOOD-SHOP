import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ROUTES } from "../config/routes";
import { CategoryFilterProvider } from "../context/CategoryFilterContext";
import { SubordinatesFiltersProvider } from "../context/SubordinatesFiltersContext";
import { NavigationParamsProvider } from "../context/NavigationParamsContext";
import { SpinnerLoading } from "../components/SpinnerLoading";

// Lazy load all route components
const LoginForm = lazy(() => import("../components/LoginForm").then(module => ({ default: module.LoginForm })));
const Menus = lazy(() => import("../components/Menus").then(module => ({ default: module.Menus })));
const ProductDetail = lazy(() => import("../components/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import("../components/Cart").then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import("../components/Checkout").then(module => ({ default: module.Checkout })));
const OrderSummary = lazy(() => import("../components/OrderSummary").then(module => ({ default: module.OrderSummary })));
const Orders = lazy(() => import("../components/Orders").then(module => ({ default: module.Orders })));
const CategoriesProducts = lazy(() => import("../components/CategoriesProducts").then(module => ({ default: module.CategoriesProducts })));
const CategoryGroupFilters = lazy(() => import("../components/CategoryGroupFilters").then(module => ({ default: module.CategoryGroupFilters })));
const PreviousOrderActions = lazy(() => import("../components/PreviousOrderActions").then(module => ({ default: module.PreviousOrderActions })));
const SubordinatesUser = lazy(() => import("../components/SubordinatesUser").then(module => ({ default: module.SubordinatesUser })));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <SpinnerLoading show={true} size={12} />
  </div>
);

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
          <CategoryFilterProvider>
            <PreviousOrderActions />
            <CategoryGroupFilters />
            <CategoriesProducts />
          </CategoryFilterProvider>
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

  return (
    <NavigationParamsProvider>
      <SubordinatesFiltersProvider>
        <Suspense fallback={<LoadingFallback />}>
          {routes}
        </Suspense>
      </SubordinatesFiltersProvider>
    </NavigationParamsProvider>
  );
};
