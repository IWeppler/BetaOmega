import { BookOpen, BrainCircuit, Leaf, Sparkles, Star, Zap } from "lucide-react";

export const getCategoryStyle = (name: string) => {
  // Normalizamos el nombre para comparar (minusculas, sin acentos si quieres)
  const normalized = name.toLowerCase();

  if (normalized.includes("biblia")) {
    return {
      icon: BookOpen,
      color: "text-blue-600",
      bgIcon: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      desc: "Conocimiento de las escrituras",
    };
  }
  if (normalized.includes("sabiduría") || normalized.includes("sabiduria")) {
    return {
      icon: Sparkles,
      color: "text-purple-600",
      bgIcon: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      desc: "Sabiduría Omniversal Supina",
    };
  }
  if (normalized.includes("contemplación") || normalized.includes("contemplacion")) {
    return {
      icon: BrainCircuit,
      color: "text-indigo-600",
      bgIcon: "bg-indigo-100",
      gradient: "from-indigo-500 to-indigo-600",
      desc: "Diademas y sentidos",
    };
  }
  if (normalized.includes("ñekurel")) {
    return {
      icon: Leaf,
      color: "text-green-600",
      bgIcon: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      desc: "Hierbas y sanación natural",
    };
  }
  if (normalized.includes("inspiración")) {
    return {
      icon: Star,
      color: "text-orange-600",
      bgIcon: "bg-orange-100",
      gradient: "from-orange-500 to-orange-600",
      desc: "El mundo de los sueños",
    };
  }

  // Estilo por defecto (Fallback) para categorías nuevas creadas por el admin
  return {
    icon: Zap,
    color: "text-slate-600",
    bgIcon: "bg-slate-100",
    gradient: "from-slate-500 to-slate-600",
    desc: "Nueva categoría de entrenamiento",
  };
};