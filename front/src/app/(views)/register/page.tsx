import { RegisterFormUI } from "./components/RegisterFormUI"
import Link from "next/link";
import {routes} from "@/app/routes";

export default function RegisterPage() {
  return (
    <>
      <div className="relative h-screen w-full">
      {/* Fondo de imagen brutalista */}
      <div className="absolute inset-0 bg-[url('/background.webp')] bg-cover bg-center" />

      {/* Capa oscura con desenfoque para contraste */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 bg-black/30 backdrop-blur-sm">
        {/* Contenedor del formulario */}
        <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0_0_#111111] max-w-lg w-full px-8 py-4">
          <div className="mb-3">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-brutal-black">
              Creá tu cuenta.
            </h2>
            <p className="text-brutal-black">
              Por favor completá el siguiente formulario para comenzar a
              disfrutar de nuestros beneficios.
            </p>
          </div>

          {/* Formulario de registro */}
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
    </>
  )
}
