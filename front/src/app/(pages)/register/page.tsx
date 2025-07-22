import { RegisterFormUI } from "./components/RegisterFormUI"
import Link from "next/link";
import {routes} from "@/app/routes";

export default function RegisterPage() {
  return (
    <div className="relative h-screen w-full">
      {/* CAPA DE FONDO FIJO (no se moverá) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/background.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </div>

      {/* CAPA DE CONTENIDO DESPLAZABLE (con scroll si es necesario) */}
      <div className="relative z-10 h-screen w-full overflow-y-auto p-4 sm:p-6 md:p-8">
        {/* Contenedor para centrar el formulario vertical y horizontalmente */}
        <div className="flex min-h-full items-center justify-center">
          
          {/* Tarjeta del Formulario */}
          <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0_0_#111111] max-w-lg w-full px-8 py-6 my-8">
            <div className="mb-3">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-brutal-black">
                Creá tu cuenta.
              </h2>
              <p className="text-brutal-black">
                Por favor completá el siguiente formulario para comenzar a
                disfrutar de nuestros beneficios.
              </p>
            </div>

            <div className="py-2 sm:py-6">
              <RegisterFormUI />
            </div>

            <p className="text-center text-brutal-black">
              ¿Ya tenés cuenta?{" "}
              <Link
                href={routes.login}
                className="text-purple-600 font-semibold inline-flex space-x-1 items-center hover:text-black"
              >
                Click aquí
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
