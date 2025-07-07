"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, Clock, CheckCircle, Star, Calendar } from "lucide-react";
import { modules } from "@/app/modules/data";
import { useAuth } from "@/app/context/authContext";

interface DashboardContentProps {
  selectedModule: (typeof modules)[0] | null;
}

export function Content({ selectedModule }: DashboardContentProps) {
  const [viewMode, setViewMode] = useState<"cover" | "content">("cover");
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Cargando usuario...</div>;
  }

  if (!user) {
    return <div className="p-4 text-red-500">No se encontró el usuario.</div>;
  }

  const openBook = () => {
    setViewMode("content");
  };

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <SidebarTrigger className="-ml-1" />
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

      <main className="flex-1 overflow-auto p-6">
        {selectedModule ? (
          <div className="max-w-4xl mx-auto">
            {viewMode === "cover" ? (
              // Vista de portada del libro (estilo Google Books)
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Portada del libro */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-64 h-80 bg-gradient-to-br ${selectedModule.coverColor} rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300`}
                    >
                      <div className="p-6 h-full flex flex-col justify-between text-white">
                        <div>
                          <div className="text-xs opacity-75 mb-2">
                            SABIDURÍA OMNIVERSAL
                          </div>
                          <h2 className="text-xl font-bold leading-tight mb-4">
                            {selectedModule.title}
                          </h2>
                          <div className="text-sm opacity-90">
                            por {selectedModule.author}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(selectedModule.rating)
                                    ? "fill-yellow-300 text-yellow-300"
                                    : "text-white/50"
                                }`}
                              />
                            ))}
                            <span className="text-xs ml-1">
                              {selectedModule.rating}
                            </span>
                          </div>
                          <div className="text-xs opacity-75">
                            {selectedModule.publishedYear}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Sombra del libro */}
                    <div className="absolute -bottom-2 -right-2 w-64 h-80 bg-black/20 rounded-lg -z-10"></div>
                  </div>
                </div>

                {/* Información del libro */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">
                      {selectedModule.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      por {selectedModule.author}
                    </p>
                    <p className="text-base leading-relaxed text-gray-700">
                      {selectedModule.description}
                    </p>
                  </div>

                  {/* Detalles del libro */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-medium text-gray-900">
                        {selectedModule.duration}
                      </div>
                      <div className="text-xs text-gray-500">Duración</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-sm font-medium text-gray-900">
                        {selectedModule.chapters}
                      </div>
                      <div className="text-xs text-gray-500">Capítulos</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                      <div className="text-sm font-medium text-gray-900">
                        {selectedModule.rating}
                      </div>
                      <div className="text-xs text-gray-500">Calificación</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-medium text-gray-900">
                        {selectedModule.publishedYear}
                      </div>
                      <div className="text-xs text-gray-500">Publicado</div>
                    </div>
                  </div>

                  {/* Progreso */}
                  {selectedModule.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          Progreso de lectura
                        </span>
                        <span className="text-gray-500">
                          {selectedModule.progress}%
                        </span>
                      </div>
                      <Progress
                        value={selectedModule.progress}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    <Button
                      onClick={openBook}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      {selectedModule.progress > 0
                        ? "Continuar leyendo"
                        : "Comenzar a leer"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Información adicional */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Sobre este libro
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Este módulo forma parte del programa integral de Sabiduría
                      Omniversal Supina, diseñado para guiarte en un viaje de
                      autodescubrimiento y crecimiento espiritual. Cada capítulo
                      incluye ejercicios prácticos y reflexiones profundas.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Vista de contenido del libro
              <div className="space-y-6">
                {/* Header del contenido */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => setViewMode("cover")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ← Volver a la portada
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedModule.title}
                    </h1>
                    <p className="text-gray-600">por {selectedModule.author}</p>
                  </div>
                </div>

                {/* Progreso */}
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progreso de lectura
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedModule.progress}%
                      </span>
                    </div>
                    <Progress value={selectedModule.progress} className="h-2" />
                  </CardContent>
                </Card>

                {/* Contenido del libro */}
                <Card className="border-gray-200">
                  <CardContent className="p-8">
                    <div className="prose prose-gray max-w-none">
                      <div
                        className="whitespace-pre-wrap leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: selectedModule.content
                            .replace(/\n/g, "<br/>")
                            .replace(/#{1,6}\s/g, "<strong>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          // Vista de bienvenida
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
                aprendizaje espiritual. Algunos módulos están bloqueados y se
                desbloquearán conforme avances en tu progreso.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
              <Card className="p-4 text-center border-gray-200">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">5 Módulos</h3>
                <p className="text-sm text-gray-500">Contenido especializado</p>
              </Card>
              <Card className="p-4 text-center border-gray-200">
                <CheckCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Progresivo</h3>
                <p className="text-sm text-gray-500">Desbloqueo por avance</p>
              </Card>
              <Card className="p-4 text-center border-gray-200">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Seguimiento</h3>
                <p className="text-sm text-gray-500">Progreso personalizado</p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </SidebarInset>
  );
}
