// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black text-center px-4">
      <h1 className="text-5xl font-bold">
        ERROR 404
      </h1>
      <h2>
        PÁGINA NO ENCONTRADA
      </h2>
      <p className="mt-6 text-xl font-medium text-black max-w-xl">
        ¡Ups! Parece que te perdiste en el omniverso. Volvé al conocimiento.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="bg-violet-600 text-white font-extrabold py-3 px-6 rounded shadow-lg hover:bg-violet-700 transition-all"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
