import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Añadimos la configuración de imágenes aquí
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'betaomega.onrender.com',
        port: '',
        pathname: '/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/public/**', 
      },
    ],
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "https://betaomega.vercel.app/:path*", // este es el puerto de frontend
  //         },
  //         {
  //           key: "Access-Control-Allow-Credentials",
  //           value: "true",
  //         },
  //       ],
  //     },
  //   ];
  // },
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