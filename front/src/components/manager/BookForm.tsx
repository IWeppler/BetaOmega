"use client";

import { useEffect, useState } from 'react';
import { getBookById, createBookContent } from '@/services/book.service';
import { IBook, IBookContent } from '@/interfaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import('@/components/TextEditor').then(mod => mod.RichTextEditor), { 
  ssr: false,
  loading: () => <p>Cargando editor...</p> 
});

interface EditBookFormProps {
  bookId: string;
}

export function EditBookForm({ bookId }: EditBookFormProps) {
  const [book, setBook] = useState<IBook | null>(null);
  const [chapters, setChapters] = useState<IBookContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!bookId) {
      setLoading(false);
      return;
    }

    const loadBook = async () => {
      const fetchedBook = await getBookById(bookId); 
      if (fetchedBook) {
        setBook(fetchedBook);
        setChapters(fetchedBook.contents || []);
      }
      setLoading(false);
    };

    loadBook();
  }, [bookId]);

  const handleAddChapter = async () => {
    if (!book || !newChapterTitle || !newChapterContent) {
      toast.error("El título y el contenido del capítulo no pueden estar vacíos.");
      return;
    }

    const result = await createBookContent({
      book_id: book.id,
      chapter_number: chapters.length + 1,
      title: newChapterTitle,
      md_content: newChapterContent,
    });

    if (result.success && result.content) {
      toast.success("Capítulo añadido con éxito.");
      setChapters([...chapters, result.content]);
      setNewChapterTitle('');
      setNewChapterContent('<p></p>');
      setEditorKey(prev => prev + 1);
    } else {
      toast.error(`Error al añadir capítulo: ${result.error}`);
    }
  };

  if (loading) return <p>Cargando libro...</p>;
  if (!book) return <p>Libro no encontrado.</p>;

  return (
    <div className="flex-1 p-6 space-y-6 h-full">
      <h1 className="text-2xl font-bold">Editando: {book.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Capítulos</CardTitle>
          <CardDescription>Lista de capítulos existentes. Actualmente hay {chapters.length} de {book.total_chapters}.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {chapters.map((ch) => (
              <li key={`${ch.book_id}-${ch.chapter_number}`}>
                Capítulo {ch.chapter_number}: {ch.title}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {chapters.length < book.total_chapters && (
        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Capítulo ({chapters.length + 1})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chapterTitle">Título del Capítulo</Label>
              <Input id="chapterTitle" value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <RichTextEditor content={newChapterContent} onChange={setNewChapterContent} key={editorKey} />
            </div>
            <Button onClick={handleAddChapter}>Guardar Capítulo</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
