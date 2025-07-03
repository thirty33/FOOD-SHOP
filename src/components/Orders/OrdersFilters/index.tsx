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

export const OrdersFilters = ({ changeFilter }: OrdersFiltersProps) => {
  return (
    <div className="flex flex-col gap-y-4 lg:grid lg:grid-cols-[1fr_1fr] lg:items-end">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-cera-bold text-green-100 tracking-tighter">Mis Pedidos</h2>
      <div className="grid grid-cols-[80fr_40fr_240fr] md:grid-cols-[80fr_40fr_200fr] lg:grid-cols-[80fr_40fr_240fr] h-full lg:h-[50px]">
        <select
          id="order-type"
          className="block w-full rounded-md border-gray-state-800 border-4 bg-white p-2 text-sm md:text-base lg:text-lg tracking-tighter text-gray-text-info font-cera-regular"
          onChange={changeFilter}
          name={ORDERS_QUERY_PARAMS.ORDER_STATUS}
        >
          <option value="">Todas</option>
          {Object.entries(ORDER_STATUS).map(([key]) => (
            <option key={key} value={key}>
              {ORDER_STATUS_TEXT[key as keyof typeof ORDER_STATUS_TEXT]}
            </option>
          ))}
        </select>
        <span className="flex justify-center items-center text-sm md:text-base lg:text-lg text-gray-text-info">
          de:
        </span>
        <select
          id="duration"
          name={ORDERS_QUERY_PARAMS.TIME_PERIOD}
          onChange={changeFilter}
          className="block w-full md:w-3/5 lg:w-full rounded-md border-gray-state-800 border-4 bg-white p-1 text-sm md:text-base lg:text-lg tracking-tight text-gray-text-info font-cera-regular"
        >
          <option value="">Selecciona una rango de tiempo</option>
          {Object.entries(ORDER_FILTER_DATES_TEXT).map(([key, text]) => (
            <option
              key={key}
              value={
                ORDER_FILTERS_DATES_VALUES[
                  key as keyof typeof ORDER_FILTERS_DATES_VALUES
                ]
              }
            >
              {text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
