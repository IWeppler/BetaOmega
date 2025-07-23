// front/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { routes } from "./app/routes";

// Asegúrate de que JWT_SECRET se cargue correctamente
const secretString = process.env.JWT_SECRET;
if (!secretString) {
  throw new Error("La variable de entorno JWT_SECRET no está definida");
}
const secret = new TextEncoder().encode(secretString);

const adminPaths = ["/manager"];

interface CustomJWTPayload extends JWTPayload {
  role?: string[];
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log(`[Middleware] Petición a: ${path}`);

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    console.log('[Middleware] No se encontró la cookie "access_token".');
    if (path.startsWith(routes.dashboard)) {
      console.log("[Middleware] Redirigiendo a /login porque no hay token.");
      return NextResponse.redirect(new URL(routes.login, req.url));
    }
    return NextResponse.next();
  }

  console.log('[Middleware] Token encontrado. Intentando verificar...');
  try {
    const { payload } = await jwtVerify<CustomJWTPayload>(token, secret);
    console.log(`[Middleware] Token verificado para el usuario: ${payload.sub}`);

    // Lógica de roles
    const isAccessingAdminPath = adminPaths.some((adminPath) => path.startsWith(adminPath));
    if (isAccessingAdminPath && !payload.role?.includes("admin")) {
      console.warn(`[Middleware] Acceso de admin denegado para ${payload.sub}. Redirigiendo a /dashboard.`);
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }

    // Si ya está logueado, no puede ir a login/register
    if (path === routes.login || path === routes.register) {
      console.log("[Middleware] Usuario ya logueado. Redirigiendo de /login a /dashboard.");
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }

  } catch (error) {
    console.error("[Middleware] Falló la verificación del token:", error);
    const response = NextResponse.redirect(new URL(routes.login, req.url));
    console.log("[Middleware] Eliminando cookie inválida y redirigiendo a /login.");
    response.cookies.delete("access_token");
    return response;
  }

  console.log("[Middleware] Petición autorizada. Continuando...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/manager/:path*", "/login", "/register"],
};