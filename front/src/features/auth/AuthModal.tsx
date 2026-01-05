"use client";

import { useEffect, Suspense } from "react"; // 1. Importamos Suspense
import { useUIStore } from "@/shared/store/uiStore";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { LoginFormUI } from "./LoginFormUI";
import { RegisterFormUI } from "./RegisterFormUI";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const AuthModalContent = () => {
  const { isAuthModalOpen, closeAuthModal, authView, openAuthModal } =
    useUIStore();

  const searchParams = useSearchParams(); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("action") === "login") {
      openAuthModal("login");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("action");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, openAuthModal, router, pathname]);

  const handleTabChange = (val: string) => {
    openAuthModal(val as "login" | "register");
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white">
        <div className="p-6 bg-slate-50 border-b border-slate-100 text-center">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Bienvenido a Beta & Omega
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Únete a la comunidad para acceder a todo el contenido.
          </p>
        </div>

        <div className="p-6">
          <Tabs
            value={authView}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginFormUI onSuccess={closeAuthModal} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterFormUI onSuccess={closeAuthModal} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AuthModal = () => {
  return (
    <Suspense fallback={null}>
      <AuthModalContent />
    </Suspense>
  );
};
