"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { ILogin } from "@/interfaces";
import { Formik, Form } from "formik";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import * as yup from "yup";
import { useAuthStore } from "@/features/auth/store/authStore";
import toast from "react-hot-toast";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";

interface Props {
  onSuccess?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 4.81c1.62 0 3.09.56 4.23 1.64l3.18-3.18C17.45 1.5 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const LoginFormUI = ({ onSuccess }: Props) => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuthStore();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Correo electrónico no válido")
      .required("Campo requerido"),
    password: yup
      .string()
      .min(6, "Debe tener al menos 8 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values: ILogin) => {
    try {
      await login(values);
      toast.success("Has ingresado correctamente");

      if (onSuccess) {
        onSuccess();
        router.refresh();
      } else {
        router.refresh();
        router.push(routes.home);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con Google");
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">
            O continúa con email
          </span>
        </div>
      </div>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <TextInput
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="usuario@email.com"
            />

            <PasswordInput
              name="password"
              label="Contraseña"
              placeholder="Escribí tu contraseña"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex align-center justify-center bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            >
              {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
