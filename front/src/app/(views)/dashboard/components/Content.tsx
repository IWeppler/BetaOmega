"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, Download, ShoppingCart } from "lucide-react"; // Import new icons
import { modules } from "@/app/modules/data";
import { useAuthStore } from "@/app/Store/authStore";
import Image from "next/image";

interface DashboardContentProps {
  selectedModule: (typeof modules)[0] | null;
}

export function Content({ selectedModule }: DashboardContentProps) {
  const [viewMode, setViewMode] = useState<"cover" | "content">("cover");
  const { user, loading } = useAuthStore();

  useEffect(() => {
    setViewMode("cover");
  }, [selectedModule]);

  if (loading) {
    return <div className="p-4">Cargando usuario...</div>;
  }

  if (!user) {
    return <div className="p-4 text-red-500">No se encontró el usuario.</div>;
  }

  const openBook = () => {
    setViewMode("content");
  };

  const closeBook = () => {
    setViewMode("cover");
  };

  // Component for the circular progress chart
  const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = 20; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <svg className="w-12 h-12" viewBox="0 0 50 50">
        <circle
          className="text-gray-300"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        <circle
          className="text-indigo-500"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
          transform="rotate(-90 25 25)" // Start from the top
        />
        <text
          x="25"
          y="25"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs font-semibold text-gray-700"
        >
          {progress}%
        </text>
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {" "}
      {/* Added flex-col to enable proper scrolling */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-gray-900">Dashboard Educativo</h1>
          {selectedModule && (
            <>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">{selectedModule.title}</span>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-[#f9f7f5] to-white">
        {selectedModule ? (
          <>
            {viewMode === "cover" && (
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                {/* Left Column - Divided into two sections */}
                <div className="space-y-6">
                  {" "}
                  {/* Added space-y for gap between sections */}
                  {/* Section 1: Title + Description */}
                  <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
                    <h1 className="text-3xl font-semibold text-[#333] tracking-wide mb-2">
                      {selectedModule.title}
                    </h1>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedModule.description}
                    </p>
                  </div>
                  {/* Section 2: Course Content (Chapters) + Progress */}
                  <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        Contenido del libro
                      </h2>
                      <div>
                        <CircularProgress progress={selectedModule.progress} />{" "}
                        {/* Circular progress chart */}
                        <Progress
                          value={selectedModule.progress}
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span>{selectedModule.chapters} capítulos</span>
                      <span className="border-l border-gray-300 h-4" />
                      <span>{selectedModule.duration}</span>
                      <span className="border-l border-gray-300 h-4" />
                      <span>{selectedModule.publishedYear}</span>
                    </div>

                    <ul className="space-y-3 text-gray-700 text-sm mb-6">
                      {Array.from({ length: selectedModule.chapters }).map(
                        (_, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0" />{" "}
                            {/* Added flex-shrink-0 */}
                            Capítulo {i + 1}: Tema {i + 1}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Right Column - Section 3: Book Cover + Buttons */}
                <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm flex flex-col items-center justify-center lg:justify-start">
                  <div className="w-full max-w-xs aspect-[3/4] rounded-lg overflow-hidden shadow-xl border border-gray-200 mb-6">
                    <Image
                      src={selectedModule.coverUrl || "/placeholder-book.png"}
                      alt="Tapa del libro"
                      className="object-cover w-full h-full"
                      width={400} 
                      height={500}
                    />
                  </div>
                  <div className="w-full space-y-3">
                    <Button
                      onClick={openBook}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      {selectedModule.progress > 0
                        ? "Continuar lectura"
                        : "Comenzar lectura"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar libro (PDF)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar libro físico
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "content" && (
              <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
                <Button
                  onClick={closeBook}
                  className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la portada
                </Button>
                <h1 className="text-3xl font-semibold text-[#333] tracking-wide mb-4">
                  {selectedModule.title} - Contenido
                </h1>
                {/* Placeholder for actual chapter content */}
                <div className="prose max-w-none">
                  {/* Here you would dynamically load and display the content of the current chapter */}
                  {/* For example: <MarkdownRenderer content={currentChapterContent} /> */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Este es el contenido del módulo &quot;{selectedModule.title}
                    &quot;. Aquí se mostraría el texto completo de los
                    capítulos, posiblemente cargando el contenido Markdown de la
                    base de datos.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Capítulo 1: Introducción
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">
                    Capítulo 2: Desarrollo
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  {/* You would likely add navigation for chapters here */}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                ¡Bienvenido/a, {user.name}!
              </h2>
              <p className="text-gray-600 max-w-md">
                Selecciona un módulo del menú lateral para comenzar tu viaje de
                aprendizaje en Sabiduría Omniversal Supina. Algunos módulos
                están bloqueados y se desbloquearán conforme avances en tu
                progreso.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
              <Card className="p-4 text-center border-gray-200">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">5 Módulos</h3>
                <p className="text-sm text-gray-500">Contenido especializado</p>
              </Card>
              <Card className="p-4 text-center border-gray-200">
                <BookOpen className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Progresivo</h3>
                <p className="text-sm text-gray-500">Desbloqueo por avance</p>
              </Card>
              <Card className="p-4 text-center border-gray-200">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Seguimiento</h3>
                <p className="text-sm text-gray-500">Progreso personalizado</p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
