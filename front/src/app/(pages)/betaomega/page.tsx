"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Betaomega = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); 
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize); 
    
    const timer = setTimeout(() => setShowLinks(true), 1000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      
      {/* Columna izquierda */}
      <div className="bg-green flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={isDesktop ? { x: -300, opacity: 0 } : { y: 50, opacity: 0 }}
          animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/BETABCO.png"
            alt="Beta"
            width={100}
            height={80}
            className="mb-4"
          />
        </motion.div>

        {showLinks && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="text-white text-xl transition-all duration-300 ease-in-out hover:scale-110 hover:tracking-wider hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]"
            >
              Beta
            </Link>
          </motion.div>
        )}
      </div>

      {/* Columna derecha */}
      <div className="bg-red flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={isDesktop ? { x: 300, opacity: 0 } : { y: 50, opacity: 0 }}
          animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/OMEGABCO.png"
            alt="Omega"
            width={170}
            height={80}
            className="mb-4"
          />
        </motion.div>

        {showLinks && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link
              href="/omega"
              className="text-white text-xl transition-all duration-300 ease-in-out hover:scale-110 hover:tracking-wider hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]"
            >
              Omega
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Betaomega;