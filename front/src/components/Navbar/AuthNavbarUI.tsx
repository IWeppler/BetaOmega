"use client";

import Link from "next/link";
import { routes } from "@/app/routes";
import { useAuth } from "../../app/context/authContext";

export function AuthNavUI({ isMobile = false, onLinkClick,}: {isMobile?: boolean; onLinkClick?: () => void;}) {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();  // esto ya llama al backend, borra el usuario del contexto y redirige
    if (onLinkClick) onLinkClick();
  };

  return (
      <div className={`flex ${isMobile ? 'flex-col items-center space-y-3' : 'flex-row gap-3 items-center justify-center'}`}>
      {!user ? (
        <Link
          href={routes.register}
          onClick={onLinkClick}
          className="bg-brutal-violet text-white font-brutal text-xl px-4 py-2 border-3 border-brutal-black rounded-md shadow-brutal hover:bg-brutal-blue cursor-pointer"
        > 
          REGISTRARSE
        </Link>
      ) : (
        <>
          <Link href={routes.dashboard} onClick={onLinkClick} className="text-brutal-orange hover:text-brutal-black font-brutal text-xl">
            PERFIL
          </Link>
          <button
            onClick={handleLogout}
            className="bg-brutal-violet text-white font-brutal text-xl px-4 py-2 border-3 border-brutal-black rounded-md shadow-brutal hover:bg-brutal-red cursor-pointer"
          >
            CERRAR SESIÓN
          </button>
        </>
      )}
    </div>
  );
}
