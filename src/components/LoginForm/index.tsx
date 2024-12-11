import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import { SuccessResponse, UserInputs } from "../../types/user";
import { ActionButton } from "../ActionButton";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

const schema = yup
  .object({
    email: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("El correo electrónico debe ser válido"),
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /[a-z]/,
        "La contraseña debe contener al menos una letra minúscula"
      )
      .matches(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra mayúscula"
      )
      .matches(/[0-9]/, "La contraseña debe contener al menos un número")
      .matches(
        /[@$!%*?&#]/,
        "La contraseña debe contener al menos un carácter especial"
      ),
  })
  .required();

export const LoginForm = () => {

  const { setShowHeader, authUser, isLoading, setToken } = useAuth();
  const { enqueueSnackbar } = useNotification();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Pick<UserInputs, "password" | "email">>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<
    Pick<UserInputs, "email" | "password">
  > = async (data) => {
    try {
      const response = await authUser({ ...data, device_name: "app" });
      setShowHeader(true);
      setToken((response as SuccessResponse).data.token);
      navigate(ROUTES.MENUS);
    } catch (error) {
      setError("email", {
        type: "manual",
        message: (error as Error).message,
      });
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-64 h-auto mr-2"
            src="https://deliciusfood.cl/wp-content/uploads/2022/09/logo-delicius.svg"
            alt="logo"
          />
          {/* Flowbite */}
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Inicia sesión en tu cuenta
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tu correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="nombre@empresa.com"
                  {...register("email")}
                  defaultValue=""
                />
                {errors.email && (
                  <span className="text-red-600">{errors.email.message}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password")}
                  defaultValue=""
                />
                {errors.password && (
                  <span className="text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required={false}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Recuérdame
                    </label>
                  </div>
                </div>
                {/* <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  ¿Olvidaste tu contraseña?
                </a> */}
              </div>
              <ActionButton
                isLoading={isLoading}
                type="submit"
                buttonText="Iniciar sesión"
                disable={isLoading}
              />
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                ¿No tienes una cuenta?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Regístrate
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
