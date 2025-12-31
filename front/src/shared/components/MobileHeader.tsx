"use client";

import { Menu, ArrowLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationsPopover } from "./NotificationsPopover";

interface MobileHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export const MobileHeader = ({
  title,
  subtitle,
  showBackButton = false,
  backUrl,
}: MobileHeaderProps) => {
  const { toggleCollapse } = useSidebar();
  const router = useRouter();

  const handleMenuClick = () => {
    toggleCollapse();
  };

  const buttonClass =
    "mr-3 p-1 rounded-lg border border-gray-300 bg-white text-gray-800 active:bg-gray-100 transition-colors flex items-center justify-center shadow-sm cursor-pointer";

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 h-16 flex items-center px-4 shadow-sm">
      {showBackButton ? (
        backUrl ? (
          <Link href={backUrl} className={buttonClass}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            className={buttonClass}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )
      ) : (
        <button
          onClick={handleMenuClick}
          className={`${buttonClass} md:hidden`}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-slate-900 truncate">{title}</h1>
        <div className="hidden md:block text-md text-slate-400">|</div>
        <p className="hidden md:block text-md text-slate-500">{subtitle}</p>
      </div>
      <div className="flex-1 flex justify-end">
        <NotificationsPopover />
      </div>
    </header>
  );
};
