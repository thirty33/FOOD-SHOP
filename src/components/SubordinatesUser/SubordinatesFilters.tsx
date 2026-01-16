import { AsyncSearchInput } from "../Orders/OrdersFilters/AsyncSearchInput";
import { ORDER_STATUS, ORDER_STATUS_TEXT, ROLES_TYPES, PERMISSION_TYPES } from "../../config/constant";

export interface SubordinatesFiltersValues {
  company_search: string;
  branch_search: string;
  user_search: string;
  user_role: string;
  user_permission: string;
  start_date: string;
  end_date: string;
  order_status: string;
}

interface SubordinatesFiltersProps {
  filters: SubordinatesFiltersValues;
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
}

export const SubordinatesFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: SubordinatesFiltersProps) => {
  const handleSearchChange = (name: string) => (value: string) => {
    onFilterChange(name, value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const hasActiveFilters =
    filters.company_search !== "" ||
    filters.branch_search !== "" ||
    filters.user_search !== "" ||
    filters.user_role !== "" ||
    filters.user_permission !== "" ||
    filters.start_date !== "" ||
    filters.end_date !== "" ||
    filters.order_status !== "";

  const inputClassName =
    "block w-full rounded-md border-gray-300 border-2 bg-white p-2 text-xs md:text-sm text-gray-700 font-cera-regular placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500";

  const selectClassName =
    "block w-full rounded-md border-gray-300 border-2 bg-white p-2 text-xs md:text-sm text-gray-700 font-cera-regular focus:border-green-500 focus:ring-green-500";

  const labelClassName = "block text-xs font-cera-medium text-gray-600 mb-1";

  const sectionTitleClassName = "text-xs font-cera-bold text-gray-500 uppercase tracking-wide mb-2";

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-cera-bold text-gray-700">Filtros</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-red-600 hover:text-red-800 font-cera-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Company/Branch Filters Column */}
        <div>
          <h4 className={sectionTitleClassName}>Empresa / Sucursal</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="company_search" className={labelClassName}>
                Empresa
              </label>
              <AsyncSearchInput
                name="company_search"
                placeholder="Buscar empresa..."
                value={filters.company_search}
                onSearch={handleSearchChange("company_search")}
                debounceDelay={500}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="branch_search" className={labelClassName}>
                Sucursal
              </label>
              <AsyncSearchInput
                name="branch_search"
                placeholder="Buscar sucursal..."
                value={filters.branch_search}
                onSearch={handleSearchChange("branch_search")}
                debounceDelay={500}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="user_search" className={labelClassName}>
                Usuario
              </label>
              <AsyncSearchInput
                name="user_search"
                placeholder="Buscar usuario..."
                value={filters.user_search}
                onSearch={handleSearchChange("user_search")}
                debounceDelay={500}
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        {/* User Role/Permission Filters */}
        <div>
          <h4 className={sectionTitleClassName}>Rol / Permiso</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="user_role" className={labelClassName}>
                Rol
              </label>
              <select
                id="user_role"
                name="user_role"
                value={filters.user_role}
                onChange={handleSelectChange}
                className={selectClassName}
              >
                <option value="">Todos los roles</option>
                {Object.entries(ROLES_TYPES).map(([key, value]) =>
                  value !== null && (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label htmlFor="user_permission" className={labelClassName}>
                Permiso
              </label>
              <select
                id="user_permission"
                name="user_permission"
                value={filters.user_permission}
                onChange={handleSelectChange}
                className={selectClassName}
              >
                <option value="">Todos los permisos</option>
                {Object.entries(PERMISSION_TYPES).map(([key, value]) =>
                  value !== null && (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Menu Filters Column */}
        <div>
          <h4 className={sectionTitleClassName}>Menú</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="start_date" className={labelClassName}>
                Fecha desde
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={filters.start_date}
                onChange={handleDateChange}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="end_date" className={labelClassName}>
                Fecha hasta
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={filters.end_date}
                onChange={handleDateChange}
                min={filters.start_date || undefined}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="order_status" className={labelClassName}>
                Estado de pedido
              </label>
              <select
                id="order_status"
                name="order_status"
                value={filters.order_status}
                onChange={handleSelectChange}
                className={selectClassName}
              >
                <option value="">Todos los estados</option>
                {Object.entries(ORDER_STATUS).map(([key]) => (
                  <option key={key} value={key}>
                    {ORDER_STATUS_TEXT[key as keyof typeof ORDER_STATUS_TEXT]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};