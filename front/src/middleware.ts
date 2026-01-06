import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas EXCEPTO:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - auth
     * - login
     * - Archivos de imagen: svg, png, jpg, jpeg, gif, webp <--- AQUI AGREGAMOS PNG y JPG
     */
    "/((?!_next/static|_next/image|favicon.ico|auth|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
