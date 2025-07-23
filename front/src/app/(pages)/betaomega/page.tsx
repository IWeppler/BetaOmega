"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const Betaomega = () => {
  return (
    // TooltipProvider debe envolver los componentes que usan Tooltip
    <TooltipProvider>
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        {/* Columna izquierda (sin cambios) */}
        <div className="bg-green flex items-center justify-center overflow-hidden">
          <motion.div
            className="flex flex-col items-center justify-center gap-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/BETABCO.png"
              alt="Beta"
              width={100}
              height={80}
              priority
            />
            <Link
              href="/dashboard"
              className="text-white text-xl transition-all duration-300 ease-in-out hover:scale-110 hover:tracking-wider hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]"
            >
              Beta
            </Link>
          </motion.div>
        </div>

        {/* Columna derecha (modificada) */}
        {/* 2. Aplicamos estilos para deshabilitar visualmente la columna */}
        <div className="bg-red-800 flex items-center justify-center overflow-hidden opacity-50 cursor-not-allowed">
          <motion.div
            className="flex flex-col items-center justify-center gap-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/OMEGABCO.png"
              alt="Omega"
              width={170}
              height={80}
              priority
            />
            <Tooltip>
              <TooltipTrigger>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white text-xl">Omega</span>
                  <Badge variant="outline" className="text-white border-white">
                    Próximamente
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Esta sección estará disponible pronto.</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Betaomega;