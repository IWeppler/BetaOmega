import {
  BookOpen,
  Sparkles,
  BrainCircuit,
  Leaf,
  Star,
  Zap,
  Trophy,
  Heart,
  Sun,
  Moon,
  Target,
  Anchor,
  type LucideIcon,
} from "lucide-react";

export const COLOR_THEMES: Record<
  string,
  { bgIcon: string; text: string; gradient: string; border: string }
> = {
  blue: {
    bgIcon: "bg-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    border: "border-blue-200",
  },
  purple: {
    bgIcon: "bg-purple-100",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    border: "border-purple-200",
  },
  indigo: {
    bgIcon: "bg-indigo-100",
    text: "text-indigo-600",
    gradient: "from-indigo-500 to-indigo-600",
    border: "border-indigo-200",
  },
  green: {
    bgIcon: "bg-green-100",
    text: "text-green-600",
    gradient: "from-green-500 to-green-600",
    border: "border-green-200",
  },
  orange: {
    bgIcon: "bg-orange-100",
    text: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
    border: "border-orange-200",
  },
  red: {
    bgIcon: "bg-red-100",
    text: "text-red-600",
    gradient: "from-red-500 to-red-600",
    border: "border-red-200",
  },
  pink: {
    bgIcon: "bg-pink-100",
    text: "text-pink-600",
    gradient: "from-pink-500 to-pink-600",
    border: "border-pink-200",
  },
  yellow: {
    bgIcon: "bg-yellow-100",
    text: "text-yellow-600",
    gradient: "from-yellow-500 to-yellow-600",
    border: "border-yellow-200",
  },
  slate: {
    bgIcon: "bg-slate-100",
    text: "text-slate-600",
    gradient: "from-slate-500 to-slate-600",
    border: "border-slate-200",
  },
};

export const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  sparkles: Sparkles,
  brain: BrainCircuit,
  leaf: Leaf,
  star: Star,
  zap: Zap,
  trophy: Trophy,
  heart: Heart,
  sun: Sun,
  moon: Moon,
  target: Target,
  anchor: Anchor,
};

export const getTheme = (colorKey: string) =>
  COLOR_THEMES[colorKey] || COLOR_THEMES["slate"];

export const getIconComponent = (iconKey: string) =>
  ICON_MAP[iconKey] || Sparkles;
