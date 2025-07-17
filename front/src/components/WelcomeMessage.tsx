"use client";

import { useAuthStore } from "@/app/Store/authStore";
import { BookOpen } from "lucide-react";

export const WelcomeMessage = () => {
  const { user } = useAuthStore();

  return (
    <main className="flex-1 flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">
        ¡Bienvenido/a, {user?.name || "usuario"}!
      </h2>
      <p className="text-gray-600 max-w-md mt-2">
        Selecciona un módulo del menú lateral para comenzar tu viaje de
        aprendizaje.
      </p>
    </main>
  );
};
