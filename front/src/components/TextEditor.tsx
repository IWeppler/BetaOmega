"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Heading4, List, ListOrdered, Quote, Image as ImageIcon, Underline as UnderlineIcon
} from 'lucide-react';
import { uploadContentImage } from '@/services/content.service';
import Underline from '@tiptap/extension-underline';
import type { Editor } from '@tiptap/react';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const result = await uploadContentImage(file);
      if (result.success && result.url) {
        const imageUrl = result.url;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } else {
        toast.error("Error al subir la imagen.");
      }
    }
  };

  if (!editor) return null;

    const buttonClass = "p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer";
    const activeClass = "is-active bg-gray-200 text-black";

    return (
      <div className="border border-gray-200 rounded-t-lg p-2 flex items-center flex-wrap gap-1 bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}><Strikethrough className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${buttonClass} ${editor.isActive('underline') ? activeClass : ''}`}><UnderlineIcon className="w-4 h-4" /></button>
        
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}><Heading3 className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 4 }) ? activeClass : ''}`}><Heading4 className="w-4 h-4" /></button>
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}><Quote className="w-4 h-4" /></button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={buttonClass}><ImageIcon className="w-4 h-4" /></button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        </div>

    );
  };

    export const RichTextEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {

      const editor = useEditor({
        extensions: [
          StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
        Image,
        Underline,

      ],
        content: content,
        editorProps: {
          attributes: {
            class: 'prose max-w-none p-4 border border-t-0 border-gray-200 rounded-b-lg min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none bg-white',
          },
        },
        immediatelyRender: false, // IMPORTANTE: Esto evita que el editor se renderice en el servidor
        onUpdate({ editor }) {
          onChange(editor.getHTML());
        },
        onCreate({ editor }) {
          console.log('Editor creado:', editor.getJSON());
        },        
      });
    
      return (
        <div>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      );
    };