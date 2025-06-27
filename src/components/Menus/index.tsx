import { useNavigate } from "react-router-dom";
import { useMenus } from "../../hooks/useMenus";
import { SpinnerLoading } from "../SpinnerLoading";
import { ROUTES } from "../../config/routes";

const MenuCard: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  menuId: string | number;
  setSelectedMenu: (id: string | number) => void;
  date: string;
}> = ({ menuId, setSelectedMenu, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedMenu(menuId);
    navigate(`${ROUTES.GET_CATEGORY_ROUTE(menuId)}?date=${date}`);
  };

  // Función para extraer y formatear la fecha usando la zona horaria de Santiago
  const formatDate = (dateString: string) => {
    // Crear la fecha usando la zona horaria de Santiago
    const date = new Date(dateString + "T12:00:00");

    // Obtener la zona horaria desde las variables de entorno
    const timezone = import.meta.env.VITE_TIMEZONE || "America/Santiago";

    // Formatear usando la zona horaria específica
    const year = date.toLocaleDateString("es-CL", {
      year: "numeric",
      timeZone: timezone,
    });

    const dayNumber = date.toLocaleDateString("es-CL", {
      day: "numeric",
      timeZone: timezone,
    });

    const dayName = date.toLocaleDateString("es-CL", {
      weekday: "long",
      timeZone: timezone,
    });

    const monthName = date.toLocaleDateString("es-CL", {
      month: "long",
      timeZone: timezone,
    });

    // Capitalizar la primera letra del día de la semana
    const capitalizedDayName =
      dayName.charAt(0).toUpperCase() + dayName.slice(1);

    return {
      year: parseInt(year),
      dayNumber: parseInt(dayNumber),
      dayName: capitalizedDayName,
      monthName,
    };
  };

  const { year, dayNumber, dayName, monthName } = formatDate(date);

  return (
    <div
      onClick={handleClick}
      className="bg-green-100 size-40 md:size-48 lg:size-60 text-white cursor-pointer hover:bg-yellow-active transition-colors rounded-md md:rounded-xl"
    >
      <div className="w-full flex justify-end content-end font-cera-light tracking-normal text-sm md:text-lg pt-1 md:leading-3 md:mt-2">
        <span className="mr-2 md:mr-3">{year}</span>
      </div>
      <div className="w-full flex justify-center font-cera-medium tracking-normal text-sm md:text-lg leading-9 md:leading-10">
        <span>{dayName}</span>
      </div>
      <div className="w-full flex justify-center font-cera-bold text-9xl md:text-[9rem] lg:text-[13rem] leading-[0.6] tracking-normal">
        {dayNumber}
      </div>
      <div className="w-full flex justify-center font-cera-medium md:mt-3 tracking-normal text-sm md:text-lg">
        <span>de {monthName}</span>
      </div>
    </div>
  );
};

export const Menus = (): JSX.Element => {
  const { menuItems, isLoading, setSelectedMenu } = useMenus();

  const handleSelected = (id: number | string) => {
    const menuSelected = menuItems.find((item) => item.id === id);
    if (menuSelected) setSelectedMenu(menuSelected);
  };

  return (
    <>
      <div className="lg:px-96 mt-8">
        <div className="grid grid-cols-[160px_160px] md:grid-cols-[198px_198px_198px] gap-x-5 gap-y-5 lg:grid-cols-[240px_240px_240px] justify-center justify-items-center">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              menuId={item.id}
              setSelectedMenu={handleSelected}
              date={item.publication_date}
            />
          ))}
        </div>
        {menuItems.length === 0 && !isLoading && (
          <div
            className="p-4 mb-4 mx-4 text-sm text-center text-green-100 rounded-lg bg-blue-50"
            role="alert"
          >
            <span className="font-medium font-cera-regular">¡ No hay menús disponibles !</span> para
            el día de hoy.
          </div>
        )}
        <div className="flex justify-center m-4">
          <SpinnerLoading show={isLoading} size={8} />
        </div>
      </div>
    </>
  );
};
