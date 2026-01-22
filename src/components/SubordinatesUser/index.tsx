import { useSubordinates } from "../../hooks/useSubordinates";
import { useAuth } from "../../hooks/useAuth";
import { SpinnerLoading } from "../SpinnerLoading";
import { Pagination } from "../Pagination";
import { MenuCardSubordinate } from "./MenuCardSubordinate";
import { SubordinatesFilters } from "./SubordinatesFilters";
import { formatMenuDateShort } from "../../helpers/dates";

export const SubordinatesUser = () => {
  const {
    subordinates,
    isLoading,
    pagination,
    filters,
    handlePageChange,
    handleMakeOrder,
    handleMenuCardClick,
    handleFilterChange,
    handleClearFilters,
  } = useSubordinates();
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-cera-bold text-green-100 mb-4">
          Usuarios de la empresa: {user.branch_fantasy_name || ''}
        </h1>

        {user.super_master_user && (
          <SubordinatesFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoading show={true} />
          </div>
        ) : subordinates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base md:text-xl text-gray-500">
              <span className="font-medium font-cera-regular">¡ No hay usuarios delegados disponibles !</span>
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subordinates.map((user, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-2">
                    <h2 className="text-base font-cera-bold text-gray-800 mb-1 truncate" title={user.nickname}>
                      {user.nickname}
                    </h2>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-xs text-gray-500 font-cera-regular shrink-0">Email:</span>
                        <span className="text-xs text-gray-700 font-cera-medium truncate">
                          {user.email || "No registrado"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-xs text-gray-500 font-cera-regular shrink-0">Empresa:</span>
                        <span className="text-xs text-gray-700 font-cera-medium truncate">
                          {user.company_name || "No registrada"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-xs text-gray-500 font-cera-regular shrink-0">Sucursal:</span>
                        <span className="text-xs text-gray-700 font-cera-medium truncate">
                          {user.branch_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-xs text-gray-500 font-cera-regular shrink-0">Dirección:</span>
                        <span className="text-xs text-gray-700 font-cera-medium truncate">
                          {user.branch_address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-xs font-cera-bold text-gray-700 mb-1">Menús disponibles:</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                      {user.available_menus && user.available_menus.length > 0 ? (
                        user.available_menus.map((menu) => {
                          const { dayName, dayNumber, month } = formatMenuDateShort(menu.publication_date);
                          return (
                            <MenuCardSubordinate
                              key={menu.id}
                              dayName={dayName}
                              dayNumber={dayNumber}
                              month={month}
                              orderStatus={menu.order_status}
                              onClick={() => handleMenuCardClick(
                                menu.id,
                                menu.publication_date,
                                menu.has_order,
                                menu.order_id,
                                user.nickname,
                                user.role
                              )}
                            />
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-500 font-cera-regular">No hay menús disponibles</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMakeOrder(user.nickname, user.role)}
                    className="w-full bg-green-50 hover:bg-green-100 text-white font-cera-bold text-sm py-1.5 px-3 rounded-lg transition-colors"
                  >
                    Hacer Pedido
                  </button>
                </div>
              ))}
            </div>

            {pagination.lastPage > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.lastPage}
                  onPageChange={handlePageChange}
                  previousLabel="Anterior"
                  nextLabel="Siguiente"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};