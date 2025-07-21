"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { IRegister } from "@/interfaces";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as yup from "yup";
import { register } from "@/services/auth.service";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";
import Select from "react-select";
// @ts-expect-error - No se ha creado el tipo para react-select-country-list
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { useEffect, useState } from "react";

export const RegisterFormUI = () => {
  const router = useRouter();
  const countries = useMemo(() => countryList().getData(), []);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const validationSchema = yup.object({
    first_name: yup
      .string()
      .max(20, "Debe tener 20 caracteres o menos")
      .required("Campo requerido"),
    last_name: yup
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
    country: yup.string().required("Campo requerido"),
    password: yup
      .string()
      .min(5, "Debe tener al menos 5 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values: IRegister) => {
    console.log("Intentando enviar datos:", values);
    const response = await register(values);

    if (response.success) {
      toast.success("Te has registrado correctamente");
      router.push(routes.login);
    } else {
      toast.error("Error al registrarse");
    }
  };

  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        country: "",
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

          {/* FIRST NAME */}
          <label htmlFor="first_name">
            <p className="font-medium text-slate-700 pb-1 mt-4">Nombre</p>
            <Field
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Tu nombre"
              className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <ErrorMessage name="first_name">
              {(err) => <div className="text-sm text-red-500 mt-1">{err}</div>}
            </ErrorMessage>
          </label>

          {/* LAST NAME */}
          <label htmlFor="last_name">
            <p className="font-medium text-slate-700 pb-1 mt-4">Apellido</p>
            <Field
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Tu apellido"
              className="w-full py-3 mb-1 border border-zinc-500 rounded-lg px-3 transition hover:outline-1 hover:outline-gray-600 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <ErrorMessage name="last_name">
              {(err) => <div className="text-sm text-red-500 mt-1">{err}</div>}
            </ErrorMessage>
          </label>

          {/* COUNTRY */}
          <label htmlFor="country">
            <p className="font-medium text-slate-700 pb-1 mt-4">País</p>
            <Field name="country">
              {({ form }: FieldProps<IRegister>) =>
                hasMounted ? (
                  <Select
                    id="country"
                    name="country"
                    options={countries}
                    onChange={(val) =>
                      form.setFieldValue(
                        "country",
                        val ? (val as { label: string }).label : ""
                      )
                    }
                    onBlur={() => form.setFieldTouched("country", true)}
                    placeholder="Seleccioná tu país"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                ) : null
              }
            </Field>
            <ErrorMessage name="country">
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
          <ErrorMessage name="password">
            {(err) => <div className="text-sm text-red-500 mt-1">{err}</div>}
          </ErrorMessage>

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
