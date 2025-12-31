"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { IRegister } from "@/interfaces";
import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { supabase } from "@/lib/supabaseClient";

// Componentes UI
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";

export const RegisterFormUI = () => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  // 1. Esquema actualizado: full_name único
  const validationSchema = yup.object({
    full_name: yup
      .string()
      .max(50, "Máximo 50 caracteres")
      .required("Requerido"),
    email: yup.string().email("Email inválido").required("Requerido"),
    phone_number: yup
      .string()
      .test("is-valid-phone", "Número inválido", (value) =>
        value ? isValidPhoneNumber(value) : false
      )
      .required("Requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  const handleSubmit = async (
    values: IRegister,
    { setFieldError }: FormikHelpers<IRegister>
  ) => {
    try {
      // 2. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setFieldError("email", "Este correo ya está registrado.");
          return;
        }
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: values.email,
          full_name: values.full_name,
          phone_number: values.phone_number,
          country: values.country || "AR",
          role: "user",
        });

        if (profileError) {
          console.error("Error creando perfil:", profileError);
        }

        toast.success("¡Cuenta creada exitosamente!");
        router.refresh();
        router.push(routes.home);
      }
    } catch (error) {
      let message = "Error al registrarse";
      if (error instanceof Error) message = error.message;
      else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    }
  };

  return (
    <>
      <style jsx global>{`
        .custom-phone-input .PhoneInputInput {
          background-color: transparent;
          border: none;
          outline: none;
          color: inherit; /* Hereda el neutral-900 */
        }
        .custom-phone-input .PhoneInputCountry {
          margin-right: 0.75rem; /* Ajuste visual para separar la bandera */
        }
      `}</style>

      <Formik
        initialValues={{
          full_name: "",
          email: "",
          phone_number: "",
          password: "",
          country: "AR",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-4">
            {/* NOMBRE COMPLETO (Unificado) */}
            <TextInput
              name="full_name"
              type="text"
              label="Nombre Completo"
              placeholder="Juan Pérez"
            />

            {/* EMAIL */}
            <TextInput
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="usuario@ejemplo.com"
            />

            <div className="w-full space-y-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Celular
              </label>

              <div
                className={`
                  custom-phone-input
                  relative w-full rounded-xl px-4 py-3 text-sm text-neutral-900 
                  bg-neutral-50 border transition-all duration-200
                  flex items-center
                  ${
                    errors.phone_number && touched.phone_number
                      ? "border-red-500 focus-within:border-red-500"
                      : "border-neutral-200 focus-within:bg-white focus-within:border-neutral-300 focus-within:ring-2 focus-within:ring-blue-500/30"
                  }
                `}
              >
                <PhoneInput
                  international
                  defaultCountry="AR"
                  placeholder="Tu número"
                  value={values.phone_number}
                  onChange={(value) => {
                    setFieldValue("phone_number", value || "");
                  }}
                  onCountryChange={(country) =>
                    setFieldValue("country", country)
                  }
                  // numberInputProps={{ className: "bg-transparent outline-none border-none w-full" }} // Alternativa si no usas style jsx
                />
              </div>

              <ErrorMessage
                name="phone_number"
                component="p"
                className="text-sm text-red-500 pt-0.5"
              />
            </div>

            {/* PASSWORD */}
            <PasswordInput
              name="password"
              label="Contraseña"
              placeholder="Crea una contraseña segura"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex align-center justify-center"
            >
              {isSubmitting ? "Registrando..." : "Registrarme"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
