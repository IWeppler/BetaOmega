import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Añadimos la configuración de imágenes aquí
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', // El puerto donde corre tu API de NestJS
        pathname: '/public/**', // Permite cualquier imagen dentro de la carpeta /public de tu backend
      },
    ],
  },

  // Tu configuración de headers se mantiene intacta
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000", // Asegúrate que este es el puerto de tu frontend
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;