import { isAdminOrCafe } from "../../helpers/permissions";
import { useAuth } from "../../hooks/useAuth";
import { useCurrentList } from "../../hooks/useCurrentList";
import { OrderLines } from "./OrderLines";
import { OrdersFilters } from "./OrdersFilters";

export const Orders = () => {

  const { orders, isLoading, changeFilter } = useCurrentList();
  const { user } = useAuth();

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <OrdersFilters
            changeFilter={changeFilter}
          />
          <OrderLines
            showTotalPrice={isAdminOrCafe(user)}
            orders={orders}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};
