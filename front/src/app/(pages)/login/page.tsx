import { routes } from "@/app/routes";
import { LoginFormUI } from "./components/LoginFormUI";
import Link from "next/link";


export default function LoginPage() {
  return (
    <div className="relative h-screen w-full">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-[url('/background.webp')] bg-cover bg-center" />

      {/* Overlay + Contenido */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 bg-black/30 backdrop-blur-sm">
        {/* Contenedor brutalista */}
        <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0_0_#000] max-w-md w-full px-8 py-10">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-brutal-black">
              Acceder a mi cuenta.
            </h2>
            <p className="text-brutal-black">
              Por favor ingresá el email y tu contraseña para ingresar a tu
              cuenta.
            </p>
          </div>

          <div className="py-4 sm:py-6">
            <LoginFormUI />
          </div>

          <p className="text-center mt-4 text-brutal-black">
            ¿Aún no tenés cuenta?{" "}
            <Link
              href={routes.register}
              className="text-purple-600 font-semibold inline-flex space-x-1 items-center hover:text-black"
            >
              Click aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
