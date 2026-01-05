// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-violet-300 px-4">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
        <span className="text-7xl font-black text-slate-800">404</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800">
        Página no encontrada
      </h1>

      <p className="mt-4 text-slate-600 leading-relaxed">
        Parece que te perdiste en el omniverso.
        <span className="font-semibold text-slate-800">
          {" "}
          Volvé al conocimiento.
        </span>
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
