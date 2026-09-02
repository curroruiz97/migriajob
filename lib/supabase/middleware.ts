import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from './types';

/**
 * Refresca la sesión Supabase en cada request y aplica guards de ruta.
 *
 * Si las env vars de Supabase no están configuradas (modo demo) deja pasar
 * todo y muestra el contenido público. /admin y /dashboard funcionan con
 * datos mock (ver lib/db/mock.ts).
 *
 * Para entrar a /admin en modo demo sin tener que iniciar sesión, define
 * la env DEMO_AUTH=1 (incluido en .env.local.example).
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const demoAuth = process.env.DEMO_AUTH === '1';

  // Propagamos el pathname como header `x-pathname` para que los Server
  // Components (especialmente los Layouts) puedan saber qué ruta están
  // sirviendo. Next 15 ya NO expone `x-invoke-path` por defecto.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Modo demo: sin Supabase configurado, dejar pasar todo (DEMO_AUTH simula login).
  if (!url || !anonKey || url.includes('your-project') || anonKey.length < 20) {
    if (!demoAuth) {
      const pathname = request.nextUrl.pathname;
      const isPrivate = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
      if (isPrivate) {
        // En modo demo SIN DEMO_AUTH, redirigir a la home con un aviso.
        const u = request.nextUrl.clone();
        u.pathname = '/';
        u.searchParams.set('demo', 'login_required');
        return NextResponse.redirect(u);
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // getClaims valida el JWT de la cookie SIN salir a la red: con claves
  // asimétricas lo verifica contra el JWKS que ya tiene cacheado. `getUser()`
  // hacía una llamada a Supabase EN CADA NAVEGACIÓN, y el middleware corre
  // antes de que la página empiece siquiera a renderizarse: era medio segundo
  // de pantalla parada en cada toque. (Si el proyecto usara claves simétricas,
  // getClaims cae de vuelta a getUser por dentro, así que nunca es peor.)
  const { data: claimsData } = await supabase.auth.getClaims();
  const user = claimsData?.claims ? { id: claimsData.claims.sub } : null;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/registro');

  if ((isAdminRoute || isDashboardRoute) && !user) {
    const u = request.nextUrl.clone();
    u.pathname = '/login';
    u.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(u);
  }

  // AQUÍ HABÍA UNA SEGUNDA CONSULTA A LA RED, a `profiles`, para leer el rol y
  // mandar a cada uno a su espacio. Se ha quitado: los layouts de /admin y de
  // /dashboard ya comprueban el rol y redirigen igual —lo llaman "defense in
  // depth" en sus comentarios—, así que esto solo repetía el trabajo y sumaba
  // otra ida y vuelta a Supabase en cada navegación. Entre las dos consultas se
  // iba casi un segundo antes de empezar a pintar nada.
  //
  // No se pierde ninguna comprobación: el rol lo sigue mirando el layout, que
  // es donde importa, y las políticas de la base de datos por debajo.
  //
  // El único caso que quedaba suelto es entrar a /login o /registro con sesión
  // abierta. Sin el rol no sabemos a qué espacio mandar, así que se manda al de
  // candidato y el layout rebota a /admin si resulta ser una empresa. Un salto
  // de más en una pantalla que se ve una vez, a cambio de quitar una consulta
  // de todas las demás.
  if (user && isAuthRoute) {
    const u = request.nextUrl.clone();
    u.pathname = '/dashboard/mi-perfil';
    return NextResponse.redirect(u);
  }

  return supabaseResponse;
}
