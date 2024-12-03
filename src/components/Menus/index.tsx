import { Link } from "react-router-dom";
import { useMenus } from "../../hooks/useMenus";
import { SpinnerLoading } from "../SpinnerLoading";
import { ROUTES } from "../../config/routes";
import MenuImage from "../../assets/images/menuImage.webp";

const MenuCard: React.FC<{
  title: string;
  description: string;
  imageUrl: string;
  menuId: string | number;
}> = ({ title, menuId }) => {
  return (
    <Link
      to={{ pathname: ROUTES.GET_CATEGORY_ROUTE(menuId) }}
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src={MenuImage}
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p> */}
      </div>
    </Link>
  );
};

export const Menus = (): JSX.Element => {
  const { menuItems, isLoading } = useMenus();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            menuId={item.id}
          />
        ))}
      </div>
      {menuItems.length === 0 && !isLoading && (
        <div
          className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <span className="font-medium">No hay Menús disponibles!</span> para el
          día de hoy.
        </div>
      )}
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
    </>
  );
};
