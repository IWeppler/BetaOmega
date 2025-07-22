"use client";

import { useAuthStore } from "@/app/Store/authStore";
import { useBookStore } from "@/app/Store/bookStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link"

export const WelcomeMessage = () => {
  const { user } = useAuthStore();
  const { books } = useBookStore();

  const firstBookSlug = books[0]?.slug;


  return (
    <main className="flex-1 flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50/50">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-blue-600" />
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold text-gray-900 mt-4"
      >
        ¡Bienvenido/a de nuevo, {user?.first_name || "Usuario"}!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-gray-600 max-w-md mt-2"
      >
        Estás listo para continuar tu viaje de aprendizaje. ¡Selecciona un módulo o empieza por el principio!
      </motion.p>

      {/* 3. Botón de Call to Action animado */}
      {firstBookSlug && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href={`/dashboard/${firstBookSlug}`} passHref>
            <Button className="mt-6 px-6 py-3 text-base font-semibold">
              Comenzar a Aprender
            </Button>
          </Link>
        </motion.div>
      )}
    </main>
  );
};
