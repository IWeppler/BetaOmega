"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthNavUI } from "./AuthNavbarUI";
import Link from "next/link";

export function NavClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 items-center font-brutal">
        <Link
          href="/#libros"
          className="text-brutal-red hover:text-brutal-violet"
        >
          LIBROS
        </Link>
        <Link
          href="/#cursos"
          className="text-brutal-blue hover:text-brutal-orange"
        >
          CURSOS
        </Link>
        <Link
          href="/#videos"
          className="text-brutal-green hover:text-brutal-red"
        >
          VIDEOS
        </Link>
        <AuthNavUI />
      </nav>

      {/* Mobile button */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-10 md:hidden">
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col justify-between p-6 font-brutal">

          {/* Menú centrado */}
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <Link
              href="/#libros"
              onClick={() => setIsMenuOpen(false)}
              className="text-brutal-red hover:text-brutal-violet text-xl"
            >
              LIBROS
            </Link>
            <Link
              href="/#cursos"
              onClick={() => setIsMenuOpen(false)}
              className="text-brutal-blue hover:text-brutal-orange text-xl"
            >
              CURSOS
            </Link>
            <Link
              href="/#videos"
              onClick={() => setIsMenuOpen(false)}
              className="text-brutal-green hover:text-brutal-red text-xl"
            >
              VIDEOS
            </Link>
            <AuthNavUI isMobile onLinkClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
