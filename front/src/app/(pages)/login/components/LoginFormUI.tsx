"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { ILogin } from "@/interfaces";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PasswordInput } from "../../../../components/ui/PasswordInput";
import * as yup from "yup";
import { useAuthStore } from "@/app/Store/authStore";
import toast from "react-hot-toast";

export const LoginFormUI = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Correo electrónico no válido")
      .required("Campo requerido"),
    password: yup
      .string()
      .min(5, "Debe tener al menos 5 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values: ILogin) => {
    try {
      await login(values);
      toast.success("Has ingresado correctamente");
      router.push(routes.dashboard);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  };

  return (
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
          {/* EMAIL */}
          <label htmlFor="email">
            <p className="font-medium text-slate-700 pb-1">
              Correo electrónico
            </p>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="usuario@email.com"
              className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <ErrorMessage name="email">
              {(err) => <div className="text-sm text-red-500 mb-2">{err}</div>}
            </ErrorMessage>
          </label>

          {/* PASSWORD */}
          <PasswordInput
            name="password"
            label="Clave"
            placeholder="Escribí tu clave"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-8 font-medium text-white bg-black rounded-lg border-black inline-flex space-x-2 items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <span>Iniciar Sesión</span>
          </button>
        </Form>
      )}
    </Formik>
  );
};
