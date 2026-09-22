import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas EXCEPTO:
     * - _next/static, _next/image, favicon, OG images, sitemaps, RSS
     * - assets bajo /public
     *
     * NO SAQUES DE AQUÍ /perfiles NI /empleos. Se intentó, buscando que una
     * ficha inexistente devolviera 404 en vez de 200, y fue peor: el 404
     * necesita que la petición pase por esta capa. Lo que rompía el código de
     * respuesta era `force-dynamic` en esas dos páginas, no el middleware.
     * Ambas cosas juntas —pasar por aquí y no forzar el render dinámico— son
     * las que hacen que `notFound()` responda lo que debe, y es lo que ya
     * hacían /noticias y /companies, que nunca tuvieron el problema.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|atom.xml|feed.xml|feed.json|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
