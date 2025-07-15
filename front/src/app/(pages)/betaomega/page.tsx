import React from "react";
import Image from "next/image";
import Link from "next/link";

const Betaomega = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Columna izquierda */}
      <div className="bg-green flex flex-col items-center justify-center">
        <Image src="/BETABCO.png" alt="Beta" width={100} height={80} />
        <Link
          href="/dashboard"
          className="text-white text-xl mt-6 transition-all duration-300 ease-in-out hover:[text-shadow:_0_0_8px_rgba(255, 255, 255, 0.9)] hover:scale-110"
        >
          Beta
        </Link>
      </div>

      {/* Columna derecha */}
      <div className="bg-red flex flex-col items-center justify-center">
        <Image src="/OMEGABCO.png" alt="Omega" width={170} height={80} />
        <Link
          href="/omega"
          className="text-white text-xl mt-6 transition-all duration-300 ease-in-out hover:[text-shadow:_0_0_8px_rgba(255, 255, 255, 0.9)] hover:scale-110"
        >
          Omega
        </Link>
      </div>
    </div>
  );
};

export default Betaomega;
