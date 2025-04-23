import {
  ORDER_FILTER_DATES_TEXT,
  ORDER_FILTERS_DATES_VALUES,
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDERS_QUERY_PARAMS,
} from "../../../config/constant";

interface OrdersFiltersProps {
  changeFilter: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const OrdersFilters = ({changeFilter}: OrdersFiltersProps) => {
  
  return (
    <div className="gap-4 sm:flex sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
        Mis Pedidos
      </h2>
      <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
        <div>
          <label
            htmlFor="order-type"
            className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Select order type
          </label>
          <select
            id="order-type"
            className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            onChange={changeFilter}
            name={ORDERS_QUERY_PARAMS.ORDER_STATUS}
          >
            <option value="">Todas</option>
            {Object.entries(ORDER_STATUS).map(([key,]) => (
              <option key={key} value={key}>
                {ORDER_STATUS_TEXT[key as keyof typeof ORDER_STATUS_TEXT]}
              </option>
            ))}
          </select>
        </div>
        <span className="inline-block text-gray-500 dark:text-gray-400">
          {" "}
          de{" "}
        </span>
        <div>
          <label
            htmlFor="duration"
            className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Select duration
          </label>
          <select
            id="duration"
            name={ORDERS_QUERY_PARAMS.TIME_PERIOD}
            onChange={changeFilter}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          >
            <option value="">Selecciona una rango de tiempo</option>
            {Object.entries(ORDER_FILTER_DATES_TEXT).map(([key, text]) => (
              <option key={key} value={ORDER_FILTERS_DATES_VALUES[key as keyof typeof ORDER_FILTERS_DATES_VALUES]}>
                {text}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
