"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import yacuchilData from "../yacuchil.json";


interface Oracion {
  source: string;
  id: string;
  text: string;
}


export default function SabiduriaOmniversal() {
  const [oracion, setOracion] = useState<Oracion | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * yacuchilData.length);
    setOracion(yacuchilData[randomIndex]);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-end text-white"
      style={{
        backgroundImage: "url('/ChatGPT3.png')",
      }}
    >
      {/* Degradado oscuro desde abajo */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none z-0" />

      {/* Versículo animado */}
      <motion.div
        className="relative z-10 mb-16 max-w-2xl text-center px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {oracion && (
          <>
            <p className="text-lg sm:text-xl font-semibold italic">
              “{oracion.text}”
            </p>
            <p className="text-sm text-white/70 mt-4 font-normal tracking-wider">
              - {oracion.source}, {oracion.id}
            </p>
          </>
        )}
      </motion.div>

      {/* Botones */}
      <motion.div
        className="mb-8 flex"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="relative z-10 flex gap-4">
          <Link
            href="/betaomega"
            className="px-6 py-3 rounded-lg border-2 border-white/50 text-white backdrop-blur-md hover:border-orange-500 hover:shadow-[0_0_15px_5px_rgba(255,159,16,0.4)] transition duration-300"
          >
            Explorar
          </Link>
          <Link
            href="/register"
            className="relative px-6 py-3 rounded-lg bg-orange-500 text-white font-medium transition duration-300 hover:bg-orange-600 hover:shadow-[0_0_15px_5px_rgba(255,159,16,0.4)]"
          >
            Registrarme
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
