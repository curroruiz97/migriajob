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
     * - las fichas públicas de perfil y de oferta (ver abajo)
     *
     * POR QUÉ SE QUEDAN FUERA /perfiles Y /empleos
     *
     * Una ficha que no existe tiene que responder 404, y respondía 200 con el
     * contenido de "no encontrada". Para Google eso es una página válida y
     * vacía: la indexa, le reparte autoridad y ensucia la cobertura.
     *
     * La causa estaba aquí. Las cuatro rutas de ficha del sitio hacen lo mismo
     * —`notFound()` cuando no hay dato— y solo fallaban dos: justo las dos que
     * se renderizan en cada petición. /noticias y /companies, que se
     * prerenderizan, devolvían su 404 correctamente. La diferencia es que en
     * una página generada al vuelo el 404 lo produce el servidor durante la
     * petición, y esta capa, al reescribirla para añadir la cabecera
     * `x-pathname`, se lo comía y lo devolvía como 200.
     *
     * Sacarlas de aquí no cuesta nada: son páginas públicas y no necesitan que
     * se les refresque la sesión. Quien tenga sesión abierta la conserva —la
     * cookie se refresca en cualquier otra navegación— y la cabecera
     * `x-pathname` no la lee nadie en todo el proyecto.
     *
     * Si algún día se cierra el catálogo (CATALOGO_PUBLICO=false), estas
     * páginas seguirán sabiendo quién mira: leen la cookie igual, solo que sin
     * renovarla.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|atom.xml|feed.xml|feed.json|api/og|perfiles|empleos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
