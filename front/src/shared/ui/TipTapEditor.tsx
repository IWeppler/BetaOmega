"use client";

import React, { useState, useRef } from "react"; // Agregamos React para los tipos
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadPostImage } from "@/features/post/services/post.service";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { ButtonGhost } from "@/shared/ui/Button";
import { toast } from "react-hot-toast";

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
}

export const TiptapEditor = ({
  content,
  onChange,
  placeholder,
}: TiptapEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escribe algo interesante...",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  // Manejo de subida de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadPostImage(file);

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      toast.error("Error al subir la imagen");
    }

    setIsUploading(false);
    // Limpiar input para permitir subir el mismo archivo si es necesario
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
      {/* Área de Texto */}
      <div
        className="p-4 cursor-text"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Barra de Herramientas (Toolbar) */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 border-t border-slate-100">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Botón de Imagen */}
        <ButtonGhost
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </ButtonGhost>

        {/* Input oculto para archivo */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

// 1. Definimos la interfaz para los props del botón
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, isActive, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded transition-colors ${
      isActive
        ? "bg-slate-200 text-slate-900"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    {children}
  </button>
);
