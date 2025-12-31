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
      .min(6, "Debe tener al menos 8 caracteres")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values: ILogin) => {
    try {
      await login(values);
      toast.success("Has ingresado correctamente");
      router.refresh();
      router.push(routes.home);
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
          <TextInput
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="usuario@email.com"
          />

          {/* PASSWORD */}
          <PasswordInput
            name="password"
            label="Contraseña"
            placeholder="Escribí tu contraseña"
          />

          {/* BOTÓN */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex align-center justify-center"
          >
            Iniciar Sesión
          </Button>
        </Form>
      )}
    </Formik>
  );
};
