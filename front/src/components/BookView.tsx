import { useEffect, useState } from "react";
import { IBook } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useProgressStore } from "@/app/Store/progressStore";
import { useAuthStore } from "@/app/Store/authStore";

interface BookReadingViewProps {
  book: IBook;
  onClose: () => void;
  startAtChapter: number;
}

export const BookReadingView = ({
  book,
  onClose,
  startAtChapter,
}: BookReadingViewProps) => {
  const { user } = useAuthStore();
  const { progressMap, updateBookProgress } = useProgressStore();

  const initialChapter = progressMap.get(book.id)?.chapter_number || 1;
  const [currentChapterNumber, setCurrentChapterNumber] =
    useState(initialChapter);

  useEffect(() => {
    setCurrentChapterNumber(startAtChapter);
  }, [startAtChapter]);

  const handleProgressUpdate = (newChapter: number) => {
    if (!user) return;
    updateBookProgress({
      user_id: user.id,
      book_id: book.id,
      current_chapter: newChapter,
    });
  };

  const goToNextChapter = () => {
    const nextChapter = Math.min(currentChapterNumber + 1, book.total_chapters);
    setCurrentChapterNumber(nextChapter);
    handleProgressUpdate(nextChapter);
  };

  const goToPrevChapter = () => {
    const prevChapter = Math.max(currentChapterNumber - 1, 1);
    setCurrentChapterNumber(prevChapter);
    handleProgressUpdate(prevChapter);
  };

  const currentChapter = book.contents.find(
    (c) => c.chapter_number === currentChapterNumber
  );

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full sm:w-auto hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la portada
        </Button>
        <span className="text-center text-sm text-gray-500 sm:text-base">
          Capítulo {currentChapterNumber} de {book.total_chapters}
        </span>
      </div>

      <article className="prose prose-sm sm:prose max-w-none mb-8">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {currentChapter?.md_content || "Contenido no encontrado."}
        </ReactMarkdown>
      </article>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center border-t pt-4 gap-4">
        {/* Botón ANTERIOR — PRIMERO en el código, a la izquierda en desktop */}
        <Button
          onClick={goToPrevChapter}
          disabled={currentChapterNumber <= 1}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {/* Botón SIGUIENTE — SEGUNDO en el código, arriba en mobile y a la derecha en desktop */}
        <Button
          onClick={goToNextChapter}
          disabled={currentChapterNumber >= book.total_chapters}
          variant="default"
          className="w-full sm:w-auto"
        >
          Siguiente
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
