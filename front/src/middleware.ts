import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { routes } from "./app/routes";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const adminPaths = ["/dashboard/admin"];

interface CustomJWTPayload extends JWTPayload {
  roles?: string[];
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const path = req.nextUrl.pathname;

  if (!token) {
    if (path.startsWith(routes.dashboard)) {
      return NextResponse.redirect(new URL(routes.login, req.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify<CustomJWTPayload>(token, secret);

    // CAPA DE SEGURIDAD DE ROLES:
    // Verificamos si el usuario intenta acceder a una ruta de administrador
    const isAccessingAdminPath = adminPaths.some(adminPath => path.startsWith(adminPath));
    if (isAccessingAdminPath && !payload.roles?.includes('admin')) {
      // Si no es admin, lo redirigimos al dashboard principal
      console.warn(`Acceso denegado a ruta de admin para el usuario: ${payload.sub}`);
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }

    if (path === routes.login || path === routes.register) {
      return NextResponse.redirect(new URL(routes.dashboard, req.url));
    }

  } catch (error) {
    console.error("Token inválido o expirado, redirigiendo a login:", error);
    const response = NextResponse.redirect(new URL(routes.login, req.url));
    response.cookies.delete("access_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
