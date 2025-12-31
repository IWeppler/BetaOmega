"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/shared/ui/buttoncn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { TextInput } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IChangePassword, IUpdateUser } from "@/interfaces";
import {
  updateUserProfile,
  changePassword,
  uploadImageProfile,
} from "@/services/user.service";
import { toast } from "react-hot-toast";
import { useRef, ChangeEvent, useState } from "react";
import clsx from "clsx";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { MobileHeader } from "@/shared/components/MobileHeader";

// Esquema de validación para el cambio de contraseña
const ChangePasswordSchema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Las contraseñas deben coincidir"
  ),
});

export default function ProfilePage() {
  const { user, updateUserState } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("personal");

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImageProfile(file);
      if (result.success && "user" in result && result.user) {
        updateUserState(result.user);
        toast.success("Foto de perfil actualizada.");
      } else if ("error" in result) {
        toast.error(result.error || "No se pudo actualizar el perfil.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (values: IUpdateUser) => {
    const result = await updateUserProfile(values);
    if (result.success && "user" in result && result.user) {
      updateUserState(result.user);
      toast.success("Perfil actualizado correctamente");
    } else if ("error" in result) {
      toast.error(result.error || "No se pudo actualizar el perfil.");
    }
  };

  const handleChangePassword = async (
    values: IChangePassword,
    { resetForm }: { resetForm: () => void }
  ) => {
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    const result = await changePassword(payload);
    if (result.success) {
      toast.success("Contraseña actualizada correctamente");
      resetForm();
    } else if ("error" in result) {
      toast.error(result.error || "No se pudo cambiar la contraseña.");
    }
  };

  const imageUrl = user?.avatar_url
    ? `${user.avatar_url}`
    : "/default-avatar.jpg";

  return (
    <div className="h-[calc(100vh-52px)] overflow-y-auto">
      <div className="flex-1 flex flex-col min-h-screen ">
        <MobileHeader
          title="Mi perfil"
          subtitle="Gesiona tu perfil desde aqui."
        />
        <main className="flex-1 overflow-auto p-2 sm:p-6 bg-linear-to-b from-[#f9f7f5] to-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Image
                    src={imageUrl}
                    alt="Avatar de usuario"
                    width={96}
                    height={96}
                    className="rounded-full mb-4 object-cover"
                  />
                  <h2 className="text-xl font-semibold">{user.full_name}</h2>
                  <p className="text-muted-foreground capitalize">
                    {user.role}
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="outline"
                    className="mt-4 w-full focus:bg-neutral-950 focus:text-white cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Subiendo..." : "Cambiar Foto"}
                  </Button>{" "}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="personal"
              >
                {/* Hacemos la lista de pestañas flexible */}
                <TabsList className="flex flex-col sm:flex-row h-auto sm:h-10 sm:grid sm:w-full sm:grid-cols-2 gap-2">
                  <TabsTrigger
                    value="personal"
                    className={clsx(
                      "w-full sm:w-auto cursor-pointer",
                      activeTab === "personal"
                        ? "bg-neutral-950 text-white shadow-sm"
                        : "bg-white text-neutral-950"
                    )}
                  >
                    Información Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className={clsx(
                      "w-full sm:w-auto cursor-pointer",
                      activeTab === "security"
                        ? "bg-neutral-950 text-white shadow-sm"
                        : "bg-white text-neutral-950"
                    )}
                  >
                    Contraseña
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card className="bg-white shadow-md">
                    <CardHeader>
                      <CardTitle>Datos Personales</CardTitle>
                      <CardDescription>
                        Realiza cambios en tu perfil aquí. Haz clic en guardar
                        cuando termines.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Formik
                        initialValues={{
                          full_name: user.full_name || "",
                          phone_number: user.phone_number || "",
                        }}
                        onSubmit={handleUpdateProfile}
                      >
                        {({ isSubmitting }) => (
                          <Form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="full_name">Nombre</Label>
                                <Field
                                  as={TextInput}
                                  name="full_name"
                                  id="full_name"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <TextInput
                                name="email"
                                // id="email"
                                // value={user.email}
                                // disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone_number">Teléfono</Label>
                              <Field
                                as={TextInput}
                                name="phone_number"
                                id="phone_number"
                              />
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                              Guardar Cambios
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contraseña</CardTitle>
                      <CardDescription>
                        Cambia tu contraseña aquí.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* CORRECCIÓN: Nombres de campos en initialValues coinciden con el schema */}
                      <Formik
                        initialValues={{
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        }}
                        validationSchema={ChangePasswordSchema}
                        onSubmit={handleChangePassword}
                      >
                        {({ isSubmitting }) => (
                          <Form className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">
                                Contraseña Actual
                              </Label>
                              <Field
                                as={PasswordInput}
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                              />
                              <ErrorMessage
                                name="currentPassword"
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">
                                Nueva Contraseña
                              </Label>
                              <Field
                                as={PasswordInput}
                                type="password"
                                name="newPassword"
                                id="newPassword"
                              />
                              <ErrorMessage
                                name="newPassword"
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">
                                Confirmar Contraseña
                              </Label>
                              <Field
                                as={PasswordInput}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                              />
                              <ErrorMessage
                                name="confirmPassword"
                                component="p"
                                className="text-xs text-red-500"
                              />
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                              Actualizar Contraseña
                            </Button>
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
    </div>
  );
}
