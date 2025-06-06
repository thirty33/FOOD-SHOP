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
      className="h-8 md:h-16 flex justify-center items-center align-center w-full text-white font-cera-bold tracking-tighte text-xs md:text-xl bg-green-100 hover:bg-green-900 focus:ring-4 focus:outline-none font-medium rounded-lg md:rounded-2xl text-center"
    >
      {!isLoading && buttonText}
      <SpinnerLoading show={isLoading} />
    </button>
  );
};
