"use client";

import { useAuthStore } from "@/app/Store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IChangePassword } from "@/interfaces";
import { IUpdateUser } from "@/interfaces";
import { updateUserProfile } from "@/services/user.service";
import { toast } from "react-hot-toast";
import { changePassword } from "@/services/user.service";

// TODO: Crear los servicios en `user.service.ts` para llamar a la API


// Esquema de validación para el cambio de contraseña
const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('La contraseña actual es requerida'),
  newPassword: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('La nueva contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
    .required('Debes confirmar la contraseña'),
});


export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  const handleUpdateProfile = async (values: IUpdateUser) => {
    console.log("Actualizando perfil:", values);
    await updateUserProfile(values);
    toast.success("Perfil actualizado correctamente");
  };
  
  const handleChangePassword = async (values: IChangePassword, { resetForm }: { resetForm: () => void }) => {
    console.log("Cambiando contraseña:", values);
    await changePassword(values);
    toast.success("Contraseña actualizada correctamente");
    resetForm();
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h1 className="font-semibold text-gray-900">Ajustes de la Cuenta</h1>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">Perfil</span>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-[#f9f7f5] to-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Resumen del Perfil */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Image
                src={user.profile_image_url || "/user2.png"}
                alt="Avatar de usuario"
                width={96}
                height={96}
                className="rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
              <p className="text-muted-foreground capitalize">{user.role}</p>
              <Button variant="outline" className="mt-4 w-full">Cambiar Foto</Button>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Pestañas de Edición */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="security">Contraseña</TabsTrigger>
            </TabsList>

            {/* Pestaña de Datos Personales */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                  <CardDescription>Realiza cambios en tu perfil aquí. Haz clic en guardar cuando termines.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Formik
                    initialValues={{
                      first_name: user.first_name || '',
                      last_name: user.last_name || '',
                      phone_number: user.phone_number || '',
                    }}
                    onSubmit={handleUpdateProfile}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre</Label>
                            <Field as={Input} name="first_name" id="first_name" />
                            <ErrorMessage name="first_name" component="p" className="text-xs text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido</Label>
                            <Field as={Input} name="last_name" id="last_name" />
                            <ErrorMessage name="last_name" component="p" className="text-xs text-red-500" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user.email} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Teléfono</Label>
                          <Field as={Input} name="phone_number" id="phone_number" />
                          <ErrorMessage name="phone_number" component="p" className="text-xs text-red-500" />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>Guardar Cambios</Button>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Seguridad */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Contraseña</CardTitle>
                  <CardDescription>Cambia tu contraseña aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Formik
                    initialValues={{ old_password: '', new_password: '', confirm_password: '' }}
                    validationSchema={ChangePasswordSchema}
                    onSubmit={handleChangePassword}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="old_password">Contraseña Actual</Label>
                          <Field as={Input} type="password" name="old_password" id="old_password" />
                          <ErrorMessage name="old_password" component="p" className="text-xs text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">Nueva Contraseña</Label>
                          <Field as={Input} type="password" name="new_password" id="new_password" />
                          <ErrorMessage name="new_password" component="p" className="text-xs text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
                          <Field as={Input} type="password" name="confirm_password" id="confirm_password" />
                          <ErrorMessage name="confirm_password" component="p" className="text-xs text-red-500" />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>Actualizar Contraseña</Button>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </main>
    </div>
  );
}
