import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../SpinnerLoading";
import { useUpdateUserComment } from "../../hooks/useUpdateUserComment";
import CloseButton from "../Icons/CloseButton";

interface FeedbackInputs {
  message: string;
}

const MIN_CHARACTERS = 5;

const schema = yup
  .object({
    message: yup
      .string()
      .required("El mensaje es obligatorio")
      .min(
        MIN_CHARACTERS,
        `el mensaje debe tener mínimo ${MIN_CHARACTERS} caracteres`
      )
      .max(240, "El mensaje no puede exceder 240 caracteres")
      .matches(
        /^[a-zA-Z0-9\s\.,\!\?\-áéíóúÁÉÍÓÚñÑüÜ]*$/,
        "El mensaje contiene caracteres no válidos"
      ),
  })
  .required();

interface CustomModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  orderId?: string | number;
  initialComment?: string | null;
}

const CustomModal = ({ isOpen = true, onClose, orderId, initialComment }: CustomModalProps) => {
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 240;
  const { updateUserComment, isLoading: isUpdating } = useUpdateUserComment();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FeedbackInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: initialComment || ""
    }
  });

  const watchedMessage = watch("message");

  useEffect(() => {
    setCharacterCount(watchedMessage?.length || 0);
  }, [watchedMessage]);

  useEffect(() => {
    if (isOpen) {
      if (initialComment) {
        setValue("message", initialComment);
        setCharacterCount(initialComment.length);
      } else {
        setValue("message", "");
        setCharacterCount(0);
      }
    }
  }, [isOpen, initialComment, setValue]);

  const onSubmit: SubmitHandler<FeedbackInputs> = async (data) => {
    if (!orderId) {
      console.error("Order ID is required");
      return;
    }

    try {
      await updateUserComment(orderId, data.message);
      
      reset();
      setCharacterCount(0);
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-xl max-h-full">
        {/* Modal content */}
        <div className="relative rounded-xl shadow-lg bg-green-100">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4">
            <CloseButton
              className="w-8 h-8 cursor-pointer absolute top-[-1rem] right-0"
              size="32"
              onClick={handleClose}
            />
          </div>

          {/* Modal body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-4">	
              {/* Textarea */}
              <div className="relative h-32 flex justify-center">

                <textarea
                  id="message"
                  rows={4}
                  className={`w-11/12 border rounded-xl resize-none py-3 px-4 focus:outline-none focus:border-transparent transition-colors text-gray-700 font-cera-light placeholder:text-gray-text-info placeholder:font-cera-light ${
                    errors.message
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                  placeholder="Deja comentarios acerca de tu pedido"
                  maxLength={maxCharacters}
                  {...register("message")}
                />

								
              </div>

							{/* Character counter */}
							<div className="flex flex-col justify-start items-start mt-2 ml-6">

								<div className="text-sm">
									<span className={`font-medium text-white`}>
										{characterCount}/{maxCharacters}
									</span>
									<span className="text-white ml-1">caracteres.</span>
								</div>

								<div className="text-sm text-wrap font-cera-light">
									{errors.message && (
										<span className="text-white font-medium">
											{errors.message.message}
										</span>
									)}
								</div>
							</div>

            </div>

            {/* Modal footer */}
            <div className="flex justify-end mr-6">
              {/* <button
                type="button"
                onClick={handleClose}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                disabled={isUpdating}
              >
                Cancelar
              </button> */}
              <button
                type="submit"
                disabled={
                  isUpdating ||
                  characterCount < MIN_CHARACTERS ||
                  characterCount > maxCharacters
                }
                className={`w-20 h-12 flex justify-center items-center px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-1000"
                }`}
              >
                {isUpdating ? (
                  <SpinnerLoading show={isUpdating} size={4} />
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { CustomModal };
