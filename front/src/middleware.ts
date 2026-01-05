import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - _next/static (archivos estáticos de next)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - auth (rutas de autenticación)
     * - login (la página de login)
     * * AGREGAMOS ESTO AL FINAL DEL REGEX: |.*\\.(?:svg|png|jpg|jpeg|gif|webp)$
     * Esto le dice: "Ignora cualquier archivo que termine en png, jpg, etc."
     */
    "/((?!_next/static|_next/image|favicon.ico|auth|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
