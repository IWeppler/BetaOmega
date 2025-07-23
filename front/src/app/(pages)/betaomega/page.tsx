"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
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
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      {/* Columna izquierda */}
      <div className="bg-green flex items-center justify-center overflow-hidden">
        {/* Un solo <motion.div> para agrupar imagen y link */}
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

      {/* Columna derecha */}
      <div className="bg-red flex items-center justify-center overflow-hidden">
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
          <Link
            href="/omega"
            className="text-white text-xl transition-all duration-300 ease-in-out hover:scale-110 hover:tracking-wider hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]"
          >
            Omega
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Betaomega;
