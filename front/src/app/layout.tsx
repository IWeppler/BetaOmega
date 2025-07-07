import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/authContext";
import { Toaster } from "react-hot-toast";

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
      <AuthProvider>
        <body className="antialiased font-brutal-mono">
          {children}
          <Toaster position="bottom-right" />
        </body>
      </AuthProvider>
    </html>
  );
}
