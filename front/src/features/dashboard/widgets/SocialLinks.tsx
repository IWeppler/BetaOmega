"use client";

import React from "react";
import { Instagram, LucideIcon } from "lucide-react";

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
        icon="/youtube.svg"
        color="text-red-600"
      />
      <SocialIcon
        href="https://whatsapp.com/"
        icon="/whatsapp.svg"
        color="text-green-600"
      />
      <SocialIcon
        href="https://www.facebook.com/profile.php?id=61579209137758&locale=es_LA"
        icon="/facebook.svg"
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
  icon: LucideIcon | string;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-transform flex items-center justify-center ${color}`}
  >
    {typeof Icon === "string" ? (
      <img src={Icon} alt="Social icon" className="h-4 w-4" />
    ) : (
      <Icon className="h-4 w-4" />
    )}
  </a>
);
