"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { IRegister } from "@/interfaces";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as yup from "yup";
import { register } from "@/services/auth.service";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { FormikHelpers } from "formik";

export const RegisterFormUI = () => {
  const router = useRouter();
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
    phone_number: yup
      .string()
      .test("is-valid-phone", "El número de teléfono no es válido", (value) =>
        value ? isValidPhoneNumber(value) : false
      )
      .required("Campo requerido"),
    password: yup
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (
    values: Omit<IRegister, 'country'>, 
    { setFieldError }: FormikHelpers<IRegister>
  ) => {
    const payload = {
      ...values,
      country: 'Derivado del teléfono'
    };
    
    const response = await register(payload);

    if (response.success) {
      toast.success("Te has registrado correctamente");
      router.push(routes.login);
    } else {
      const errorMessage =
        "error" in response
          ? response.error || "Error desconocido"
          : "Error desconocido";
      if (errorMessage.toLowerCase().includes("email")) {
        setFieldError("email", errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };


  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        country: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
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

          <label htmlFor="phone_number">
            <p className="font-medium text-slate-700 pb-1 mt-4">
              Número de celular
            </p>
            <Field name="phone_number">
              {({ field, form }: FieldProps) => ( // Eliminamos el tipo genérico <IRegister>
                <PhoneInput
                  id="phone_number"
                  international
                  defaultCountry="AR"
                  placeholder="Tu número de teléfono"
                  value={form.values.phone_number} 
                  onChange={(value) => form.setFieldValue(field.name, value || '')}
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  onCountryChange={(countryCode) => form.setFieldValue('country', countryCode || '')}
                  className="phone-input-container"
                />
              )}
            </Field>
            <ErrorMessage name="phone_number">
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
