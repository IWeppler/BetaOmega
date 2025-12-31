import Link from "next/link";
import { LoginFormUI } from "@/features/auth/LoginFormUI";
import { routes } from "@/app/routes";

export default function LoginPage() {
  return (
    <div
      className="relative flex min-h-screen w-full 
      bg-[url('/bglogin.png')] bg-cover bg-center justify-center items-center
      lg:bg-none lg:items-stretch lg:justify-start"
    >
      <div className="absolute inset-0 bg-black/40 lg:hidden" />

      {/* --- LADO IZQUIERDO: Formulario --- */}
      <div
        className="relative z-10 w-full max-w-md p-8 m-4 
                      bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl
                      lg:w-1/2 lg:max-w-none lg:bg-white lg:shadow-none lg:rounded-none lg:m-0 lg:px-24 lg:flex lg:flex-col lg:justify-center"
      >
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bienvenido a Beta & Omega
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Ingresá tus datos para iniciar sesión.
            </p>
          </div>

          <LoginFormUI />

          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Aún no tenés cuenta?{" "}
            <Link
              href={routes.register}
              className="font-semibold text-orange-600 hover:text-orange-500 hover:underline"
            >
              Registrarme ahora
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex relative w-1/2 flex-col items-center justify-end text-white bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bglogin.png')" }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/0" />
        </div>

        <div className="relative z-10 pb-6 text-xs text-white/30">
          © {new Date().getFullYear()} Beta & Omega
        </div>
      </div>
    </div>
  );
}
