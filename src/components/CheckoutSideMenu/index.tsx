import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import "./styles.css";
import { CartItem } from "../Cart";
import { useOrder } from "../../hooks/useCurrentOrder";
import { SpinnerLoading } from "../SpinnerLoading";

export const CheckoutSideMenu = () => {
  const { cartProducts, currentOrder, isLoading } = useOrder();

  const handleDelete = (id: number) => {};

  const handleCheckout = () => {};

  const totalPrice = (products: Array<{ [key: string]: any }>) => {
    let sum = 0;
    products.forEach((product) => (sum += product.price));
    return sum;
  };

  return (
    <aside
      className={`${
        true ? "flex" : "hidden"
      } checkout-side-menu flex-col fixed right-0 border border-black rounded-lg bg-white z-50`}
    >
      <div className="flex justify-between items-center p-6">
        <h2 className="font-bold text-2xl">Mi Orden</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => {}}
          ></XMarkIcon>
        </div>
      </div>
      <div className="px-6 overflow-y-scroll flex flex-col gap-y-4 ">
        {currentOrder &&
          currentOrder.order_lines.map((line) => (
            <CartItem
              key={line.id}
              name={line.product.name}
              price={line.total_price}
              quantity={line.quantity}
              image={line.product.image}
            />
          ))}
      </div>
      {(!currentOrder || currentOrder.order_lines.length === 0) && !isLoading ? (
        <div
          className="p-4 m-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <span className="font-medium">
            No hay orden disponible para el día de hoy!
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center m-4">
        <SpinnerLoading show={isLoading} size={8} />
      </div>
      <div className="px-6 mb-6">
        <p className="flex justify-between items-center mb-2 p-4">
          <span className="font-bold text-2xl">Total:</span>
          <span className="font-medium text-2xl">
            ${totalPrice(cartProducts)}
          </span>
        </p>
        <Link to="/">
          <button
            className="bg-black py-3 text-white w-full rounded-lg"
            onClick={() => handleCheckout()}
          >
            Ir a carrito
          </button>
        </Link>
      </div>
    </aside>
  );
};
