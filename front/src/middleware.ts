// front/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { routes } from "./app/routes";

// --- Interfaces y Tipos ---
interface CustomJWTPayload extends JWTPayload {
  id: string; 
  role?: string[];
}

// --- Constantes y Configuración ---
const JWT_SECRET = process.env.JWT_SECRET;

const publicRoutes = [
  routes.login,
  routes.register,
  routes.home,
  routes.betaomega,
];
const privateRoutes = [routes.dashboard, "/manager"];

async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
  if (!JWT_SECRET) {
    console.error("La variable de entorno JWT_SECRET no está definida.");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as CustomJWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error al verificar el token:", error.message);
    } else {
      console.log("Error al verificar el token:", error);
    }
    return null;
  }
}

// --- Middleware Principal ---
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("access_token")?.value;

  const isPublicRoute = publicRoutes.includes(path);
  const isPrivateRoute = privateRoutes.some((r) => path.startsWith(r));

  // CASO 1: No hay token
  if (!token) {
    if (isPrivateRoute) {
      console.log(
        `[Middleware] Acceso denegado a ${path} sin token. Redirigiendo a login.`
      );
      return NextResponse.redirect(new URL(routes.login, req.url));
    }
    return NextResponse.next();
  }

  // CASO 2: Hay un token, se intenta verificar
  const user = await verifyToken(token);

  // CASO 2.1: El token es inválido o expiró
  if (!user) {
    const response = NextResponse.redirect(new URL(routes.login, req.url));
    console.log(
      `[Middleware] Token inválido para ${path}. Eliminando cookie y redirigiendo.`
    );
    // Le decimos al navegador que elimine la cookie inválida
    response.cookies.delete("access_token");
    return response;
  }

  // CASO 3: El token es válido
  // Si un usuario logueado intenta ir a login/register, lo mandamos al dashboard.
  if (isPublicRoute) {
    console.log(
      `[Middleware] Usuario logueado intentando acceder a ${path}. Redirigiendo a dashboard.`
    );
    return NextResponse.redirect(new URL(routes.dashboard, req.url));
  }

  // CASO 4: Verificación de roles para rutas específicas
  if (path.startsWith("/manager")) {
    const isAdmin = user.role?.includes("admin");
    if (!isAdmin) {
      console.warn(
        `[Middleware] Usuario ${user.id} sin rol de admin intentó acceder a ${path}.`
      );
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }
  }

  // Si pasó todas las validaciones, permitir el acceso.
  return NextResponse.next();
}

// --- Configuración del Matcher ---
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/manager/:path*",
    "/login",
    "/register",
    "/",
    "/betaomega",
  ],
};
