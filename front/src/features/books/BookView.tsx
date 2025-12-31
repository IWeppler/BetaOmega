"use client";

import { useState, useEffect, useRef } from "react";
import { IBook } from "@/interfaces";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ReactReader } from "react-reader";
import { useProgressStore } from "@/app/store/progressStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { supabase } from "@/lib/supabaseClient";
import { generateFullBookEpub } from "@/lib/epubGenerator";

// --- 1. DEFINICIÓN ROBUSTA DE TIPOS  ---
interface IRendition {
  display: (target?: string) => void;
  location: {
    start: { index: number; href: string };
    atEnd: boolean;
  };
  book: {
    spine: {
      length: number;
    };
  };
  themes: {
    default: (styles: object) => void;
  };
}

interface IPreparedChapter {
  id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

interface Props {
  book: IBook;
  startAtChapter: number;
  onClose: () => void;
}

export const BookReadingView = ({ book, startAtChapter, onClose }: Props) => {
  const chaptersList = book.book_content || [];

  // Hooks
  const { user } = useAuthStore();
  const { updateProgress, updateBookProgress } = useProgressStore();

  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<string | number>(0);

  const [loading, setLoading] = useState(true);
  const [currentChapterTitle, setCurrentChapterTitle] = useState("");
  const renditionRef = useRef<IRendition | null>(null);

  // 1. GENERAR EL EPUB
  useEffect(() => {
    let active = true;
    const buildBook = async () => {
      setLoading(true);
      try {
        const fullChapters: IPreparedChapter[] = await Promise.all(
          chaptersList.map(async (ch) => {
            let content = ch.md_content;
            if (!content) {
              const { data } = await supabase
                .from("book_content")
                .select("md_content")
                .eq("id", ch.id)
                .single();
              content = data?.md_content || "# Sin contenido";
            }
            return {
              id: String(ch.id),
              chapter_number: ch.chapter_number,
              title: ch.title,
              md_content: content,
            };
          })
        );

        const bookBuffer = await generateFullBookEpub(book.title, fullChapters);

        // Creamos un Blob con el tipo MIME correcto
        const blob = new Blob([bookBuffer as ArrayBuffer], {
          type: "application/epub+zip",
        });

        // Generamos una URL temporal interna del navegador
        const url = URL.createObjectURL(blob);

        if (active) setEpubUrl(url);
      } catch (e) {
        console.error("Error generando libro:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    buildBook();

    return () => {
      active = false;
      if (epubUrl) URL.revokeObjectURL(epubUrl);
    };
  }, [book.id]);

  // 2. NAVEGACIÓN "REACTIVA" (Sin rendition.display manual)
  useEffect(() => {
    // CAMBIO 3: Verificar epubData
    if (!loading && epubUrl) {
      const targetIndex = startAtChapter > 0 ? startAtChapter - 1 : 0;
      const targetHref = `ch_${targetIndex}.xhtml`;
      setLocation(targetHref);
    }
  }, [startAtChapter, loading, epubUrl]);

  // 3. DETECCIÓN DE PROGRESO Y FINAL
  const onLocationChange = async (loc: string | number) => {
    setLocation(loc);

    if (!renditionRef.current || !user) return;

    const currentLocation = renditionRef.current.location;
    const currentChapterIndex = currentLocation.start.index;
    const totalChapters = renditionRef.current.book.spine.length;

    // Actualizar título visualmente
    const visualChapter = currentChapterIndex + 1;
    const currentChapterObj = chaptersList.find(
      (c) => c.chapter_number === visualChapter
    );
    if (currentChapterObj) setCurrentChapterTitle(currentChapterObj.title);

    // Lógica de completado
    const isLastChapter = currentChapterIndex === totalChapters - 1;
    const isAtEndOfPage = currentLocation.atEnd;

    if (isLastChapter && isAtEndOfPage) {
      console.log("🏆 FIN DEL LIBRO DETECTADO");
      await updateBookProgress({
        user_id: user.id,
        book_id: book.id,
        chapter_number: totalChapters,
        current_chapter: totalChapters,
        current_page: 0,
        is_completed: true,
      });
    } else {
      // Guardado parcial
      await updateProgress(book.id, visualChapter, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fcfcfc] flex flex-col h-screen w-screen overflow-hidden">
      {/* HEADER */}
      <div className="h-14 border-b px-4 flex items-center justify-between bg-white shadow-sm z-20 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Volver
        </button>
        <span className="font-bold text-sm truncate max-w-[200px] text-slate-800">
          {currentChapterTitle || `Capítulo ${startAtChapter}`}
        </span>
        <div className="w-16"></div>
      </div>

      {/* LECTOR */}
      <div className="flex-1 relative w-full bg-[#fcfcfc] overflow-hidden">
        {loading || !epubUrl ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-sm text-slate-500">
              Generando libro...
            </span>
          </div>
        ) : (
          <div className="absolute inset-0">
            <style>{`.react-reader-default-arrow { display: none !important; }`}</style>

            <ReactReader
              url={epubUrl}
              title={book.title}
              location={location}
              locationChanged={onLocationChange}
              epubInitOptions={{
                openAs: "epub",
              }}
              epubOptions={{
                flow: "paginated",
                manager: "default",
                width: "100%",
                height: "100%",
                allowScriptedContent: true,
              }}
              getRendition={(rendition) => {
                renditionRef.current = rendition as unknown as IRendition;
                rendition.themes.default({
                  p: {
                    "font-family": "Helvetica, Arial, sans-serif",
                    "font-size": "18px",
                    "line-height": "1.6",
                    "text-align": "justify",
                  },
                  img: { "max-width": "100%" },
                });
              }}
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="h-10 border-t bg-white flex items-center justify-center px-6 z-20 shrink-0">
        <span className="text-xs text-gray-400 font-mono">
          {currentChapterTitle}
        </span>
      </div>
    </div>
  );
};
