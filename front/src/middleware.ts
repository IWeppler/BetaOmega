import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { routes } from "./app/routes";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const path = req.nextUrl.pathname;

  // Verificar token
  if (token) {
    try {
      await jwtVerify(token, secret);

    } catch (error) {
      console.error("Token inválido o expirado:", error);
      return NextResponse.redirect(new URL(routes.login, req.url));
    }
  }

  // Si está logueado e intenta ir a login o register → redirigir al dashboard
  if (token && (path === routes.login || path === routes.register)) {

    return NextResponse.redirect(new URL(routes.dashboard, req.url));
  }

  // Si NO está logueado y va a rutas protegidas → redirigir a login
  if (!token && path.startsWith(routes.dashboard)) {

    return NextResponse.redirect(new URL(routes.login, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
