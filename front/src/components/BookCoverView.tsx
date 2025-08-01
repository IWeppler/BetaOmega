"use client";

import { IBook } from "@/interfaces";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useProgressStore } from "@/app/Store/progressStore";
import { clsx } from "clsx";

interface BookCoverViewProps {
  book: IBook;
  onStartReading: () => void;
  onChapterSelect: (chapterNumber: number) => void;
}

export const BookCoverView = ({ book, onStartReading, onChapterSelect }: BookCoverViewProps) => {
  const { progressMap } = useProgressStore();
  const bookProgress = progressMap.get(book.id);
  const lastReadChapter = bookProgress?.chapter_number || 0;

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
            <h2 className="text-xl font-semibold text-gray-800">Contenido del libro</h2>
            <div className="text-right">
              <span className="font-bold text-indigo-600">{bookProgress?.progress || 0}%</span>
              <Progress value={bookProgress?.progress || 0} className="h-2 mt-1 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{book.total_chapters} capítulos</span>
          </div>
          <ul className="space-y-1 text-gray-700 text-sm">
            {book.contents.map((chapter) => {
              const isChapterRead = chapter.chapter_number <= lastReadChapter;
              return (
                <li
                  key={`${chapter.book_id}-${chapter.chapter_number}`}
                  onClick={() => onChapterSelect(chapter.chapter_number)}
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {isChapterRead ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0" />
                  )}
                  <span className={clsx(isChapterRead && "text-gray-500 line-through")}>
                    Capítulo {chapter.chapter_number}: {chapter.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Columna Derecha */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs aspect-[3/4] rounded-lg overflow-hidden shadow-xl border border-gray-200 mb-6">
          <Image
            src={book.cover_url}
            alt={`Tapa de ${book.title}`}
            className="object-cover w-full h-full"
            width={400}
            height={500}
            priority
          />
        </div>
        <div className="w-full max-w-xs space-y-3">
          <Button onClick={onStartReading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <BookOpen className="h-5 w-5 mr-2" />
            {(bookProgress?.progress || 0) > 0 ? "Continuar lectura" : "Comenzar lectura"}
          </Button>
        </div>
      </div>
    </div>
  );
};