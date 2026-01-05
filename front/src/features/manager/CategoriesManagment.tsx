"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ICategory, IGlossaryTerm } from "@/interfaces";
import { Button, ButtonGhost } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Edit2, Check, X, Book, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

// --- COLORES PARA CATEGORÍAS (Igual que antes) ---
const PREDEFINED_COLORS = [
  "bg-red-200 text-red-800 border-red-400",
  "bg-green-200 text-green-800 border-green-400",
  "bg-blue-200 text-blue-800 border-blue-400",
  "bg-purple-200 text-purple-800 border-purple-400",
  "bg-yellow-200 text-yellow-800 border-yellow-400",
  "bg-indigo-200 text-indigo-800 border-indigo-400",
  "bg-pink-200 text-pink-800 border-pink-400",
  "bg-orange-200 text-orange-800 border-orange-400",
];

interface Props {
  initialCategories: ICategory[];
  initialTerms: IGlossaryTerm[];
}

export const CategoriesManagement = ({
  initialCategories,
  initialTerms,
}: Props) => {
  const router = useRouter();

  // --- ESTADOS ---
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [terms, setTerms] = useState<IGlossaryTerm[]>(initialTerms);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGICA DE CATEGORIAS ---
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatColor, setEditCatColor] = useState("");

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return toast.error("Nombre requerido");
    setIsSubmitting(true);
    const randomColor =
      PREDEFINED_COLORS[Math.floor(Math.random() * PREDEFINED_COLORS.length)];

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCatName, color_class: randomColor })
        .select()
        .single();
      if (error) throw error;
      setCategories((prev) => [...prev, data as ICategory]);
      setNewCatName("");
      toast.success("Categoría creada");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al crear categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCatName.trim()) return toast.error("Nombre requerido");
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editCatName, color_class: editCatColor })
        .eq("id", editingCatId);
      if (error) throw error;
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCatId
            ? { ...c, name: editCatName, color_class: editCatColor }
            : c
        )
      );
      setEditingCatId(null);
      toast.success("Categoría actualizada");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Borrar categoría?")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar");
    }
  };

  // --- LOGICA DE DICCIONARIO (GLOSARIO) ---
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");

  // Edición Diccionario
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");

  const handleCreateTerm = async () => {
    if (!newTerm.trim() || !newDefinition.trim())
      return toast.error("Completa ambos campos");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("glossary_terms")
        .insert({ term: newTerm, definition: newDefinition })
        .select()
        .single();
      if (error) throw error;
      setTerms((prev) => [...prev, data as IGlossaryTerm]);
      setNewTerm("");
      setNewDefinition("");
      toast.success("Término agregado al diccionario");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al agregar término");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTerm = async () => {
    if (!editTerm.trim() || !editDefinition.trim())
      return toast.error("Completa ambos campos");
    try {
      const { error } = await supabase
        .from("glossary_terms")
        .update({ term: editTerm, definition: editDefinition })
        .eq("id", editingTermId);
      if (error) throw error;
      setTerms((prev) =>
        prev.map((t) =>
          t.id === editingTermId
            ? { ...t, term: editTerm, definition: editDefinition }
            : t
        )
      );
      setEditingTermId(null);
      toast.success("Término actualizado");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar");
    }
  };

  const handleDeleteTerm = async (id: number) => {
    if (!confirm("¿Borrar término del diccionario?")) return;
    try {
      const { error } = await supabase
        .from("glossary_terms")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setTerms((prev) => prev.filter((t) => t.id !== id));
      toast.success("Término eliminado");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> Categorías de Posts
          </TabsTrigger>
          <TabsTrigger value="dictionary" className="flex items-center gap-2">
            <Book className="w-4 h-4" /> Diccionario
          </TabsTrigger>
        </TabsList>

        {/* ==============================================
            PESTAÑA 1: CATEGORÍAS (SOLO POSTS)
           ============================================== */}
        <TabsContent
          value="categories"
          className="space-y-6 mt-6 animate-in fade-in duration-300"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crear Categoría</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 items-end">
              <div className="flex-1">
                <TextInput
                  name="newCatName"
                  label="Nombre"
                  placeholder="Ej: Noticias"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateCategory} disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" /> Crear
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-1 bg-white border rounded-lg shadow-sm flex items-center justify-between"
              >
                {editingCatId === cat.id ? (
                  <div className="flex gap-4 w-full items-end">
                    <div className="flex-1 space-y-2">
                      <input
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                      />
                      <div className="flex gap-2">
                        {PREDEFINED_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setEditCatColor(c)}
                            className={`w-4 h-4 rounded-full ${
                              c.split(" ")[0]
                            } border ${
                              editCatColor === c ? "ring-2 ring-black" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ButtonGhost onClick={() => setEditingCatId(null)}>
                        <X className="w-4 h-4" />
                      </ButtonGhost>
                      <Button
                        onClick={handleUpdateCategory}
                        className="h-9 px-3"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Badge className={`px-3 py-1 border ${cat.color_class}`}>
                      {cat.name}
                    </Badge>
                    <div className="flex gap-2">
                      <ButtonGhost
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditCatName(cat.name);
                          setEditCatColor(cat.color_class);
                        }}
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </ButtonGhost>
                      <ButtonGhost onClick={() => handleDeleteCategory(cat.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </ButtonGhost>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ==============================================
            PESTAÑA 2: DICCIONARIO (DEFINICIONES)
           ============================================== */}
        <TabsContent
          value="dictionary"
          className="space-y-6 mt-6 animate-in fade-in duration-300"
        >
          <Card className="border-neutral-300 bg-[#fefeff]">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">
                Agregar al Diccionario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <TextInput
                    name="newTerm"
                    label="Término / Palabra"
                    placeholder="Ej: Zayapal"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Definición
                  </label>
                  <Textarea
                    className="w-full bg-[#fefeff] rounded-md border border-neutral-200 px-3 py-2 text-sm focus:ring-2 ring-indigo-500 outline-none"
                    rows={2}
                    placeholder="Qué significa..."
                    value={newDefinition}
                    onChange={(e) => setNewDefinition(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateTerm} disabled={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" /> Agregar Definición
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {terms.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-[#fefeff] border border-neutral-300 rounded-lg shadow-sm"
              >
                {editingTermId === t.id ? (
                  <div className="space-y-4">
                    <input
                      className="w-full border rounded px-3 py-2 font-bold text-slate-700"
                      value={editTerm}
                      onChange={(e) => setEditTerm(e.target.value)}
                    />
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                      value={editDefinition}
                      onChange={(e) => setEditDefinition(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <ButtonGhost onClick={() => setEditingTermId(null)}>
                        Cancelar
                      </ButtonGhost>
                      <Button onClick={handleUpdateTerm}>
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-slate-700 text-lg">
                        {t.term}
                      </h4>
                      <p className="text-neutral-600 text-sm mt-1 leading-relaxed">
                        {t.definition}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTermId(t.id);
                          setEditTerm(t.term);
                          setEditDefinition(t.definition);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(t.id)}
                        className="p-2 hover:bg-red-50 rounded-full text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
