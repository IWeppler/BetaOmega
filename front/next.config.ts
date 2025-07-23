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
        hostname: "betaomega.onrender.com",
        port: "",
        pathname: "/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/public/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://betaomega.onrender.com/api/:path*", // este es el puerto de backend
      },
    ];
  },
};

export default nextConfig;
