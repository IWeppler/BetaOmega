"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { IRegister } from "@/interfaces";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { registerAction } from "@/services/form";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";

export const RegisterFormUI = () => {
  const router = useRouter();

  const validationSchema = yup.object({
    name: yup
      .string()
      .max(20, "Debe tener 20 caracteres o menos")
      .required("Campo requerido"),
    email: yup
      .string()
      .email("Correo electrónico no válido")
      .required("Campo requerido"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(10, "Debe tener al menos 10 dígitos")
      .required("Campo requerido"),
    password: yup
      .string()
      .min(5, "Debe tener al menos 5 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values: IRegister) => {
    try {
      await registerAction(values);
      toast.success("Has ingresado correctamente");
      router.push(routes.login);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        phone: "",
        password: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <Form>
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
              {(err) => <div className="text-sm text-red-500">{err}</div>}
            </ErrorMessage>
          </label>

          {/* NOMBRE */}
          <label htmlFor="name">
            <p className="font-medium text-slate-700 pb-1 mt-4">
              Nombre y Apellido
            </p>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <ErrorMessage name="name">
              {(err) => <div className="text-sm text-red-500 mt-1">{err}</div>}
            </ErrorMessage>
          </label>

          {/* PHONE */}
          <label htmlFor="phone">
            <p className="font-medium text-slate-700 pb-1 mt-4">
              Numero de celular
            </p>
            <Field
              id="phone"
              name="phone"
              type="tel"
              placeholder="+54 (011) 1111-1111"
              className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <ErrorMessage name="phone">
              {(err) => <div className="text-sm text-red-500 mt-1">{err}</div>}
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
            className="w-full py-3 mt-8 font-medium text-white bg-black rounded-lg border-black inline-flex space-x-2 items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Registrarme</span>
          </button>
        </Form>
      )}
    </Formik>
  );
};
