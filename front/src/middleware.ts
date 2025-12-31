import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routes } from "./app/routes"; // Importamos tus rutas

export async function middleware(request: NextRequest) {
  // 1. Configuración inicial de la respuesta
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Crear cliente de Supabase (Manejo de cookies automático)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 3. Obtener el usuario de la sesión actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LÓGICA DE RUTAS ---
  const path = request.nextUrl.pathname;

  // Definimos rutas públicas (donde NO necesitas estar logueado)
  const publicPaths = [routes.login, routes.register, "/betaomega"];
  const isPublicRoute = publicPaths.includes(path);

  // Definimos rutas de Admin (opcional por ahora, base para el futuro)
  // const isManagerRoute = path.startsWith("/manager");

  // CASO A: Usuario NO logueado intenta entrar a ruta privada
  // (Si no es pública, asumimos que es privada, incluyendo la Home '/')
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    return NextResponse.redirect(url);
  }

  // CASO B: Usuario SÍ logueado intenta entrar a Login o Register
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = routes.home; // Lo mandamos al Dashboard
    return NextResponse.redirect(url);
  }

  // CASO C: Protección de Roles (Manager)
  // Nota: user.role no viene por defecto en auth.getUser().
  // Lo ideal aquí es dejar pasar al usuario y que el Layout de /manager
  // verifique si tiene permisos, o hacer una consulta a DB aquí (puede ser lento).
  // Por seguridad básica, si hay usuario, dejamos pasar.

  return response;
}

export const config = {
  // Matcher: Ejecutar en todo excepto archivos estáticos e imágenes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
