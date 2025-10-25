import { useSubordinates } from "../../hooks/useSubordinates";
import { useAuth } from "../../hooks/useAuth";
import { SpinnerLoading } from "../SpinnerLoading";
import { MenuCardSubordinate } from "./MenuCardSubordinate";
import { formatMenuDateShort } from "../../helpers/dates";

export const SubordinatesUser = () => {
  const { subordinates, isLoading, handleMakeOrder, handleMenuCardClick } = useSubordinates();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoading show={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-cera-bold text-green-100 mb-8">
          Usuarios de la empresa: {user.branch_fantasy_name || ''}
        </h1>
        
        {subordinates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base md:text-xl text-gray-500">
              <span className="font-medium font-cera-regular">¡ No hay usuarios delegados disponibles !</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subordinates.map((user, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-cera-bold text-gray-800 mb-2">
                    {user.nickname}
                  </h2>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-cera-regular">Email:</span>
                      <span className="text-sm text-gray-700 font-cera-medium">
                        {user.email || "No registrado"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-cera-regular">Sucursal:</span>
                      <span className="text-sm text-gray-700 font-cera-medium">
                        {user.branch_name}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-cera-regular">Dirección:</span>
                      <span className="text-sm text-gray-700 font-cera-medium">
                        {user.branch_address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-cera-bold text-gray-700 mb-2">Menús disponibles:</h3>
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
                            isCompleted={menu.has_order === 1}
                            onClick={() => handleMenuCardClick(
                              menu.id,
                              menu.publication_date,
                              menu.has_order,
                              menu.order_id,
                              user.nickname
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
                  onClick={() => handleMakeOrder(user.nickname)}
                  className="w-full bg-green-50 hover:bg-green-100 text-white font-cera-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Hacer Pedido
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};