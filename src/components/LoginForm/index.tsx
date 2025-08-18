import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import { SuccessResponse, UserInputs } from "../../types/user";
import { ActionButton } from "../ActionButton";
import { useNotification } from "../../hooks/useNotification";
import { configuration } from "../../config/config";
import { textMessages } from "../../config/textMessages";
import { useEffect, useState } from "react";
import EyeOpenIcon from "../Icons/EyeOpenIcon";
import EyeClosedIcon from "../Icons/EyeClosedIcon";
import { useManageInitNavigation } from "../../hooks/useManageInitNavigation";

const schema = yup
  .object({
    email: yup.string().required("El correo electrónico es obligatorio"),
    password: yup
      .string()
      .required("La contraseña es obligatoria")
  })
  .required();

export const LoginForm = () => {
  const { setShowHeader, authUser, isLoading, setToken, setUser } = useAuth();
  const { enqueueSnackbar } = useNotification();
  const { handleInitialNavigation } = useManageInitNavigation();
  const [showPassword, setShowPassword] = useState(false);

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
      setUser(
        response.data.role, 
        response.data.permission, 
        response.data.master_user,
        response.data.nickname,
        response.data.name
      );
      
      const user = {
        role: response.data.role,
        permission: response.data.permission,
        master_user: response.data.master_user,
        nickname: response.data.nickname,
        name: response.data.name
      };
      
      handleInitialNavigation(user);
    } catch (error) {
      setError("email", {
        type: "manual",
        message: (error as Error).message,
      });
      const errorMessage = `${(error as Error).message}. Si tiene algún problema comuníquese a través del número ${configuration.support.phone} o del correo ${configuration.support.email}`;
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: configuration.toast.duration });
    }
  };

  useEffect(() => {
    if (errors.email) {
      const errorMessage = `${errors.email.message}. Si tiene algún problema comuníquese a través del número ${configuration.support.phone} o del correo ${configuration.support.email}`;
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: configuration.toast.duration });
    }
    if (errors.password) {
      const errorMessage = `${errors.password.message}. Si tiene algún problema comuníquese a través del número ${configuration.support.phone} o del correo ${configuration.support.email}`;
      enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: configuration.toast.duration });
    }
  }, [errors, enqueueSnackbar]);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center p-8 md:p-0">
      <div className="w-full max-w-md">
        <div className="bg-green-50 rounded-3xl shadow-lg overflow-hidden p-8">
          {/* Logo */}
          <div className="text-center mb-2">
            <img
              className="w-551 y-221 h-auto mx-auto"
              src={configuration.company.logo}
              alt={configuration.company.name}
            />
          </div>

          {/* Title */}
          <h1 className="text-white font-cera-bold text-[1.2rem] md:text-[32px] text-center tracking-tighter mb-2">
            {textMessages.LOGIN_FORM.TITLE}
          </h1>

          <form
            className="space-y-2 md:space-y-4 px-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Input */}
            <div>
              <input
                type="text"
                id="email"
                className="w-full h-8 md:h-16 py-4 md:py-0 px-3 md:px-6 bg-white border-0 rounded-lg md:rounded-2xl text-[#333333] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-green-100 shadow-sm font-cera-regular text-xs md:text-xl tracking-tighter"
                placeholder={textMessages.LOGIN_FORM.EMAIL_PLACEHOLDER}
                {...register("email")}
                defaultValue=""
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={textMessages.LOGIN_FORM.PASSWORD_PLACEHOLDER}
                className="w-full h-8 md:h-16 py-4 md:py-0 px-3 md:px-6 pr-10 md:pr-14 bg-white border-0 rounded-lg md:rounded-2xl text-[#333333] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-green-100 shadow-sm font-cera-regular text-xs md:text-xl tracking-tighter"
                {...register("password")}
                defaultValue=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4"
              >
                {showPassword ? (
                  <EyeClosedIcon
                    size="16"
                    className="md:w-6 md:h-6 text-gray-400 hover:text-gray-600"
                  />
                ) : (
                  <EyeOpenIcon
                    size="16"
                    className="md:w-6 md:h-6 text-gray-400 hover:text-gray-600"
                  />
                )}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center content-center justify-start text-start">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 md:w-5 md:h-5 text-green-100 bg-white border-gray-300 rounded focus:ring-green-100 default:ring-green-100 accent-green-100"
              />
              <label
                htmlFor="remember"
                className="ml-1 md:ml-2 text-xs md:text-lg font-cera-regular text-white"
              >
                {textMessages.LOGIN_FORM.REMEMBER_ME}
              </label>
            </div>

            {/* Submit Button */}
            <div className="">
              <ActionButton
                isLoading={isLoading}
                type="submit"
                buttonText={textMessages.LOGIN_FORM.SUBMIT_BUTTON}
                disable={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
