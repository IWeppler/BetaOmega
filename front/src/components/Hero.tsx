"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Sparkles, Star, Users } from "lucide-react";
import { routes } from "@/app/routes";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="bg-brutal-yellow min-h-[80dvh] border-b-4 border-brutal-black">
      <div className="h-full flex flex-col md:flex-row gap-12 items-stretch">

        {/* Columna izquierda */}
        <div className="w-full md:w-1/2 min-h-[80dvh] h-full md:pl-12 container mx-auto flex flex-col justify-center px-6 py-8">
          <h1 className="font-brutal font-normal text-5xl md:text-7xl text-brutal-black mb-8 leading-tight tracking-wider">
            SABIDURIA
            <span className="block text-brutal-red">OMNIVERSAL</span>
            <span className="block text-brutal-blue">SUPINA</span>
          </h1>

          <p className="text-brutal-black font-brutal-mono text-xl md:text-2xl mb-10 leading-relaxed">
            Descubre los secretos del omniverso y conecta con la sabiduría que proviene de YHWH
            a través de nuestro contenido.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              // variant="brutalist"
              className="bg-brutal-red text-brutal-white font-brutal font-normal tracking-wide text-xl px-8 py-6 border-3 border-brutal-black shadow-brutal-lg hover:bg-brutal-orange"
            >
              <Sparkles className="mr-2" size={24} />
              COMENZAR AHORA
            </Button>
            <Button className="bg-brutal-white text-brutal-black font-brutal font-normal tracking-wide text-xl px-8 py-6 border-3 border-brutal-black shadow-brutal-lg hover:bg-brutal-green">
              <Star className="mr-2" size={24} />
              EXPLORAR
            </Button>
          </div>

          {/*REDES SOCIALES: INSTAGRAM, YOUTUBE, TIKTOK, FACEBOOK*/}
          <div className="mt-8 bottom-0">
            <ul className="flex space-x-4 font-brutal text-xl text-brutal-black">
              <li>
                <Link href="https://instagram.com" target="_blank" className="hover:text-brutal-green">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com" target="_blank" className="hover:text-brutal-violet">
                  YouTube
                </Link>
              </li>
              <li>
                <Link href="https://tiktok.com" target="_blank" className="hover:text-brutal-orange">
                  TikTok
                </Link>
              </li>
              <li>
                <Link href="https://facebook.com" target="_blank" className="hover:text-brutal-blue">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
          
          </div>

        {/* Columna derecha */}
        <div className="w-full md:w-1/2 flex flex-col flex-grow border-t-4 md:border-t-0 md:border-l-4 border-brutal-black md:justify-between">
          {/* Tarjeta de estadísticas */}
          <div className="h-1/2 w-full bg-brutal-orange border-b-4 shadow-brutal-xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-brutal font-normal text-2xl text-brutal-black tracking-wide">
                  CONTENIDO EXCLUSIVO
                </h3>
                <Users size={32} className="text-brutal-black" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brutal-red border-2 border-brutal-black">
                  <span className="font-brutal font-normal text-brutal-white tracking-wide">
                    LIBROS
                  </span>
                  <span className="font-brutal font-normal text-brutal-white text-xl tracking-wide">
                    500+
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-brutal-blue border-2 border-brutal-black">
                  <span className="font-brutal font-normal text-brutal-white tracking-wide">
                    CURSOS
                  </span>
                  <span className="font-brutal font-normal text-brutal-white text-xl tracking-wide">
                    100+
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-brutal-green border-2 border-brutal-black">
                  <span className="font-brutal font-normal text-brutal-white tracking-wide">
                    VIDEOS
                  </span>
                  <span className="font-brutal font-normal text-brutal-white text-xl tracking-wide">
                    1000+
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Tarjeta de beneficios */}
          <div className="h-1/2 w-full bg-brutal-violet">
            <CardContent className="p-12">
              <h4 className="font-brutal font-normal text-xl text-brutal-white mb-6 tracking-wide">
                ÚNETE A LA COMUNIDAD
              </h4>

              <div className="space-y-3 mb-6 text-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brutal-orange mr-3"></div>
                  <span className="font-brutal-mono text-brutal-white">
                    Acceso a contenido premium
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brutal-yellow mr-3"></div>
                  <span className="font-brutal-mono text-brutal-white">
                    Comunidad global de estudiantes
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brutal-green mr-3"></div>
                  <span className="font-brutal-mono text-brutal-white">
                    Certificaciones espirituales
                  </span>
                </div>
              </div>

              <Link
                href={routes.register}
                className="w-full bg-brutal-orange text-brutal-white font-brutal text-xl py-3 px-8 border-3 rounded-md border-brutal-black shadow-brutal hover:bg-brutal-yellow hover:text-brutal-black cursor-pointer"
              >
                REGISTRARSE GRATIS
              </Link>
            </CardContent>
          </div>
        </div>
      </div>
      
    </section>
  );
};
