"use client";

import { useEffect } from "react";
import { IBook } from "@/interfaces";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/Button";
import { Progress } from "@/shared/ui/progress";
import { BookOpen, CheckCircle, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useProgressStore } from "@/app/store/progressStore";
import { useAuthStore } from "@/app/store/authStore";
import { clsx } from "clsx";

interface BookCoverViewProps {
  book: IBook;
  onStartReading: () => void;
  onChapterSelect: (chapterNumber: number) => void;
}

export const BookCoverView = ({
  book,
  onStartReading,
  onChapterSelect,
}: BookCoverViewProps) => {
  const { user } = useAuthStore();
  const { progressMap, getUserProgress } = useProgressStore();

  // Cargar progreso si no existe
  useEffect(() => {
    if (user?.id && progressMap.size === 0) {
      getUserProgress(user.id);
    }
  }, [user?.id, getUserProgress, progressMap.size]);

  // Obtener datos del store
  const bookProgress = progressMap.get(book.id);

  // Variables de estado
  const currentChapter = bookProgress?.current_chapter || 1;
  const isCompleted = bookProgress?.is_completed || false;
  const totalChapters = book.total_chapters || book.book_content?.length || 1;

  let calculatedProgress = 0;

  if (isCompleted) {
    calculatedProgress = 100;
  } else {
    const completedCount = Math.max(0, currentChapter - 1);
    calculatedProgress = Math.floor((completedCount / totalChapters) * 100);
  }

  const handleMainAction = () => {
    if (isCompleted) {
      // Si ya terminó, el botón dice "Volver a leer" -> lleva al 1
      onChapterSelect(1);
    } else if (calculatedProgress > 0 || currentChapter > 1) {
      // Si hay progreso, "Continuar lectura" -> lleva al capítulo donde te quedaste
      onChapterSelect(currentChapter);
    } else {
      // Si es nuevo -> Iniciar
      onStartReading();
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      {/* Columna Izquierda */}
      <div className="space-y-6">
        <Card className="p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-[#333] tracking-wide mb-2">
            {book.title}
          </h1>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </Card>

        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contenido del libro
            </h2>
            <div className="text-right">
              <span
                className={clsx(
                  "font-bold",
                  isCompleted ? "text-green-600" : "text-slate-800"
                )}
              >
                {calculatedProgress}%
              </span>
              <Progress
                value={calculatedProgress}
                className="h-2 mt-1 w-24 bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{totalChapters} capítulos</span>
            {isCompleted && (
              <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" /> Completado
              </span>
            )}
          </div>

          <ul className="space-y-1 text-gray-700 text-sm">
            {book.book_content?.map((chapter) => {
              // 1. LEÍDO: Si el libro está completado O este capítulo es anterior al actual
              const isRead =
                isCompleted || chapter.chapter_number < currentChapter;

              // 2. ACTUAL: El que estás leyendo ahora (Marcador)
              const isCurrent =
                !isCompleted && chapter.chapter_number === currentChapter;

              return (
                <li
                  key={`${book.id}-${chapter.chapter_number}`}
                  onClick={() => onChapterSelect(chapter.chapter_number)}
                  className={clsx(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200",
                    isCurrent
                      ? "bg-blue-50 border border-blue-100 shadow-sm translate-x-1"
                      : "hover:bg-gray-50 hover:translate-x-1"
                  )}
                >
                  {/* Icono del estado */}
                  {isRead ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  ) : isCurrent ? (
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <span className="absolute w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}

                  {/* Texto */}
                  <span
                    className={clsx(
                      "transition-colors",
                      isRead &&
                        "text-gray-400 line-through decoration-gray-300",
                      isCurrent && "font-bold text-slate-800",
                      !isRead && !isCurrent && "text-gray-600"
                    )}
                  >
                    <span className="font-semibold mr-1">
                      Capítulo {chapter.chapter_number}:
                    </span>
                    {chapter.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Columna Derecha (Cover y Botón) */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs aspect-3/4 rounded-lg overflow-hidden shadow-xl border border-gray-200 mb-6 relative group">
          <Image
            src={book.cover_url}
            alt={`Tapa de ${book.title}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            width={400}
            height={500}
            priority
          />
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Button
            onClick={handleMainAction}
            className={clsx(
              "w-full h-12 flex items-center justify-center text-base font-medium transition-all shadow-md hover:shadow-lg",
              isCompleted
                ? "bg-green-600 hover:bg-green-700 text-white"
                : calculatedProgress > 0
                ? "bg-blue-600 hover:bg-blue-800 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            )}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="h-5 w-5 mr-2" />
                Volver a leer
              </>
            ) : calculatedProgress > 0 ? (
              <>
                <BookOpen className="h-5 w-5 mr-2" />
                Continuar lectura
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5 mr-2" />
                Comenzar lectura
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
