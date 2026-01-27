import { useMenus } from "../../hooks/useMenus";
import { SpinnerLoading } from "../SpinnerLoading";
import { formatMenuDate } from "../../helpers/dates";
import { PreviousOrderActions } from "../PreviousOrderActions";

const MenuCard: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  menuId: string | number;
  date: string;
  has_order: number;
  handleClick: (menuId: string | number, date: string) => void;
}> = ({ menuId, date, has_order, handleClick }) => {
  const isDisabled = has_order === 1;

  const onCardClick = () => {
    if (!isDisabled) {
      handleClick(menuId, date);
    }
  };

  const { year, dayNumber, dayName, monthName } = formatMenuDate(date);

  return (
    <div
      onClick={onCardClick}
      className={`bg-green-100 w-28 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 text-white transition-colors rounded-md md:rounded-xl pt-2 pb-8 overflow-hidden ${
        isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:bg-yellow-active'
      }`}
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
  const { menuItems, isLoading, handleMenuClick } = useMenus();

  return (
    <>
      <div className="mt-8 px-1 md:px-0 2xl:px-[21rem] lg:px-52">
        <div className="grid grid-cols-3 gap-y-3 gap-x-3 md:w-[600px] lg:w-[750px] xl:w-[900px] md:mx-auto place-items-center">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              {item.has_order !== 1 && (
                <div className="absolute top-4 md:top-6 left-2 md:left-3 z-10">
                  <PreviousOrderActions date={item.publication_date} compact />
                </div>
              )}
              <MenuCard
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                menuId={item.id}
                date={item.publication_date}
                has_order={item.has_order}
                handleClick={handleMenuClick}
              />
            </div>
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
