import Link from "next/link";
import { RegisterFormUI } from "@/features/auth/RegisterFormUI";
import { routes } from "@/app/routes";

export default function RegisterPage() {
  return (
    <div
      className="relative flex min-h-screen w-full 
      /* Estilos Mobile: Imagen de fondo, centrado */
      bg-[url('/bglogin.png')] bg-cover bg-center justify-center items-center
      /* Estilos Desktop: Reseteo de fondo y alineación */
      lg:bg-none lg:items-stretch lg:justify-start"
    >
      <div className="absolute inset-0 bg-black/40 lg:hidden" />

     
      <div
        className="relative z-10 w-full max-w-lg p-8 m-4 
                      bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl
                      lg:w-1/2 lg:max-w-none lg:bg-white lg:shadow-none lg:rounded-none lg:m-0 lg:px-24 lg:py-10 lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Creá tu cuenta
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Completá el formulario para comenzar tu camino en Beta & Omega.
            </p>
          </div>

          <RegisterFormUI />

          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Ya tenés cuenta?{" "}
            <Link
              href={routes.login}
              className="font-semibold text-orange-600 hover:text-orange-500 hover:underline"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>

      {/* --- LADO DERECHO: Imagen Desktop --- */}
      <div className="hidden lg:flex relative w-1/2 flex-col items-center justify-end text-white bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bglogin.png')" }}
        >
          {/* Mantenemos tu gradiente original */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 pb-6 text-xs text-white/30">
          © {new Date().getFullYear()} Beta & Omega
        </div>
      </div>
    </div>
  );
}
