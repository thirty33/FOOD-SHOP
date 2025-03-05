import { SpinnerLoading } from "../SpinnerLoading";

interface Props {
  isLoading: boolean;
  type: "submit" | "button" | "reset";
  buttonText: string;
  disable: boolean;
}

export const ActionButton = ({
  isLoading,
  type,
  buttonText,
  disable,
}: Props) => {
  return (
    <button
      disabled={disable}
      type={type}
      className="flex justify-center align-center w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
    >
      {!isLoading && buttonText}
      <SpinnerLoading show={isLoading} />
    </button>
  );
};
