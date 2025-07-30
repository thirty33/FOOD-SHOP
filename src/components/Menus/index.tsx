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
      className="bg-green-100 w-28 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 text-white cursor-pointer hover:bg-yellow-active transition-colors rounded-md md:rounded-xl pt-2 pb-8 overflow-hidden"
    >
      <div className="w-full flex justify-end content-end font-cera-light tracking-normal text-xs md:text-lg lg:text-xl pt-1 md:leading-3 md:mt-2">
        <span className="mr-2 md:mr-3">
          {year}
        </span>
      </div>
      <div className="w-full flex justify-center font-cera-medium tracking-normal text-xs md:text-base lg:text-lg leading-6 md:leading-7">
        <span>
          {dayName}
        </span>
      </div>
      <div className="w-full flex justify-center font-cera-bold text-7xl md:text-8xl lg:text-8xl xl:text-9xl leading-[0.6] tracking-[-0.05em]">
        {dayNumber}
      </div>
      <div className="w-full flex justify-center font-cera-medium md:mt-1 mb-4 tracking-normal text-xs md:text-base lg:text-lg py-1">
        <span>
          de {monthName}
        </span>
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
      <div className="mt-8 px-1 md:px-0 2xl:px-[21rem] lg:px-52">
        <div className="grid grid-cols-3 gap-y-3 gap-x-3 md:w-[600px] lg:w-[750px] xl:w-[900px] md:mx-auto place-items-center">
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
