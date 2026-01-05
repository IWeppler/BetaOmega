import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/features/auth/AuthInitializer";
import { AuthModal } from "@/features/auth/AuthModal";

export const metadata: Metadata = {
  title: "Sabiduría Omniversal Supina",
  description:
    "Descubre los secretos del universo y conecta con la sabiduría divina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-brutal-mono">
        <AuthInitializer />
        <AuthModal />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
