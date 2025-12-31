import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Añadimos la configuración de imágenes aquí
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/djqgt0lzg/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "lekwblhqpwsgqaqfjwwm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
