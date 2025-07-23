import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Añadimos la configuración de imágenes aquí
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/public/**', 
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://betaomega.vercel.app/:path*", // este es el puerto de frontend
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