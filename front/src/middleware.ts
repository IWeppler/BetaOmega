// // front/src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify, JWTPayload } from "jose";
// import { routes } from "./app/routes";

// // Asegúrate de que JWT_SECRET se cargue correctamente
// const secretString = process.env.JWT_SECRET;
// if (!secretString) {
//   throw new Error("La variable de entorno JWT_SECRET no está definida");
// }
// const secret = new TextEncoder().encode(secretString);

// const adminPaths = ["/manager"];

// interface CustomJWTPayload extends JWTPayload {
//   role?: string[];
// }

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   console.log(`[Middleware] Petición a: ${path}`);

//   const token = req.cookies.get("access_token")?.value;

//   if (!token) {
//     console.log('[Middleware] No se encontró la cookie "access_token".');
//     if (path.startsWith(routes.dashboard)) {
//       console.log("[Middleware] Redirigiendo a /login porque no hay token.");
//       return NextResponse.redirect(new URL(routes.login, req.url));
//     }
//     return NextResponse.next();
//   }

//   console.log('[Middleware] Token encontrado. Intentando verificar...');
//   try {
//     const { payload } = await jwtVerify<CustomJWTPayload>(token, secret);
//     console.log(`[Middleware] Token verificado para el usuario: ${payload.sub}`);

//     // Lógica de roles
//     const isAccessingAdminPath = adminPaths.some((adminPath) => path.startsWith(adminPath));
//     if (isAccessingAdminPath && !payload.role?.includes("admin")) {
//       console.warn(`[Middleware] Acceso de admin denegado para ${payload.sub}. Redirigiendo a /dashboard.`);
//       return NextResponse.redirect(new URL(routes.dashboard, req.url));
//     }

//     // Si ya está logueado, no puede ir a login/register
//     if (path === routes.login || path === routes.register) {
//       console.log("[Middleware] Usuario ya logueado. Redirigiendo de /login a /dashboard.");
//       return NextResponse.redirect(new URL(routes.dashboard, req.url));
//     }

//   } catch (error) {
//     console.error("[Middleware] Falló la verificación del token:", error);
//     const response = NextResponse.redirect(new URL(routes.login, req.url));
//     console.log("[Middleware] Eliminando cookie inválida y redirigiendo a /login.");
//     response.cookies.delete("access_token");
//     return response;
//   }

//   console.log("[Middleware] Petición autorizada. Continuando...");
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/manager/:path*", "/login", "/register"],
// };

// front/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { routes } from "./app/routes";

// --- Interfaces y Tipos ---
// Es una buena práctica tener una interfaz para el payload del token.
interface CustomJWTPayload extends JWTPayload {
  id: string; // Asumo que el 'sub' es el id del usuario.
  role?: string[];
}

// --- Constantes y Configuración ---
const JWT_SECRET = process.env.JWT_SECRET;

// Definimos qué rutas son públicas y cuáles requieren autenticación.
const publicRoutes = [routes.login, routes.register];
const privateRoutes = [routes.dashboard, "/manager"]; // Usamos /manager como base

/**
 * Función helper para verificar el token.
 * Devuelve el payload del usuario si es válido, o null si no lo es.
 */
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
    // Si intenta acceder a una ruta privada sin token, redirigir a login.
    if (isPrivateRoute) {
      console.log(`[Middleware] Acceso denegado a ${path} sin token. Redirigiendo a login.`);
      return NextResponse.redirect(new URL(routes.login, req.url));
    }
    // Si es una ruta pública, permitir el acceso.
    return NextResponse.next();
  }

  // CASO 2: Hay un token, se intenta verificar
  const user = await verifyToken(token);

  // CASO 2.1: El token es inválido o expiró
  if (!user) {
    // Preparamos una respuesta para redirigir a login
    const response = NextResponse.redirect(new URL(routes.login, req.url));
    console.log(`[Middleware] Token inválido para ${path}. Eliminando cookie y redirigiendo.`);
    // Le decimos al navegador que elimine la cookie inválida
    response.cookies.delete("access_token");
    return response;
  }

  // CASO 3: El token es válido
  // Si un usuario logueado intenta ir a login/register, lo mandamos al dashboard.
  if (isPublicRoute) {
    console.log(`[Middleware] Usuario logueado intentando acceder a ${path}. Redirigiendo a dashboard.`);
    return NextResponse.redirect(new URL(routes.dashboard, req.url));
  }

  // CASO 4: Verificación de roles para rutas específicas
  if (path.startsWith("/manager")) {
    const isAdmin = user.role?.includes("admin");
    if (!isAdmin) {
      console.warn(`[Middleware] Usuario ${user.id} sin rol de admin intentó acceder a ${path}.`);
      // Si no es admin, lo redirigimos a su dashboard principal.
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }
  }

  // Si pasó todas las validaciones, permitir el acceso.
  return NextResponse.next();
}

// --- Configuración del Matcher ---
export const config = {
  matcher: [

    '/dashboard/:path*',
    '/manager/:path*',
    '/login',
    '/register',
  ],
};
