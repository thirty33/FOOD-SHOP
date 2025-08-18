import {
  ORDER_FILTER_DATES_TEXT,
  ORDER_FILTERS_DATES_VALUES,
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDERS_QUERY_PARAMS,
} from "../../../config/constant";
import { AsyncSearchInput } from "./AsyncSearchInput";
import { useAuth } from "../../../hooks/useAuth";

interface OrdersFiltersProps {
  changeFilter: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearch: (searchTerm: string) => void;
}

export const OrdersFilters = ({ changeFilter, onSearch }: OrdersFiltersProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-y-4 lg:grid lg:grid-cols-[1fr] lg:grid-rows-[1fr_1fr] lg:items-end">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-cera-bold text-green-100 tracking-tighter">Mis Pedidos</h2>
      <div className={`grid gap-y-2 md:gap-y-0 lg:gap-x-4 h-full lg:h-[50px] ${
        user.master_user 
          ? 'grid-cols-[5fr_1fr_5fr] md:grid-cols-[2fr_0.5fr_4fr] lg:grid-cols-[1fr_0.5fr_2fr_2fr]'
          : 'grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_auto_1fr]'
      }`}>
        <select
          id="order-type"
          className="block w-full rounded-md border-gray-state-800 border-4 bg-white p-2 text-[10px] md:text-base lg:text-lg tracking-tighter text-gray-text-info font-cera-regular"
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
        <span className="flex justify-center items-center text-[10px] md:text-base lg:text-lg text-gray-text-info">
          de:
        </span>
        <select
          id="duration"
          name={ORDERS_QUERY_PARAMS.TIME_PERIOD}
          onChange={changeFilter}
          className="block w-full md:w-3/5 lg:w-full rounded-md border-gray-state-800 border-4 bg-white p-1 text-[10px] md:text-base lg:text-lg tracking-tight text-gray-text-info font-cera-regular"
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
        {user.master_user && (
          <AsyncSearchInput
            name="search"
            placeholder="Buscar por usuario o sucursal..."
            onSearch={onSearch}
            debounceDelay={500}
            className="block w-full rounded-md border-gray-state-800 border-4 bg-white p-2 text-[10px] md:text-base lg:text-lg tracking-tighter text-gray-text-info font-cera-regular placeholder:text-gray-400"
          />
        )}
      </div>
    </div>
  );
};
