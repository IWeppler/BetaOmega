"use client";

import {
  Youtube,
  Instagram,
  MessageCircle,
  Facebook,
  LucideIcon,
} from "lucide-react";

export const SocialLinks = () => {
  return (
    <div className="flex items-center justify-center gap-4 py-2 opacity-80 hover:opacity-100 transition-opacity">
      <SocialIcon
        href="https://instagram.com/alenyemin"
        icon={Instagram}
        color="text-pink-600"
      />
      <SocialIcon
        href="https://www.youtube.com/@sabiduriaomniversalsupina"
        icon={Youtube}
        color="text-red-600"
      />
      <SocialIcon
        href="https://whatsapp.com/"
        icon={MessageCircle}
        color="text-green-600"
      />
      <SocialIcon
        href="https://www.facebook.com/profile.php?id=61579209137758&locale=es_LA"
        icon={Facebook}
        color="text-blue-600"
      />
    </div>
  );
};

const SocialIcon = ({
  href,
  icon: Icon,
  color,
}: {
  href: string;
  icon: LucideIcon;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-transform hover:scale-110 ${color}`}
  >
    <Icon className="h-4 w-4" />
  </a>
);
