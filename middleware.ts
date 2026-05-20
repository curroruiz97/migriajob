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
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|atom.xml|feed.xml|feed.json|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
