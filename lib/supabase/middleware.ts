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
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANTE: no añadir lógica entre createServerClient y getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  if (user && (isAdminRoute || isDashboardRoute || isAuthRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'candidate' | 'employer' | 'admin' }>();

    const role = profile?.role ?? 'candidate';
    // Espacio de cada rol: candidato → /dashboard, empleador y admin → /admin.
    // Sin acceso cruzado, ni siquiera para admin (super-admin usa /admin).
    const isEmployerSpace = role === 'employer' || role === 'admin';

    if (isAdminRoute && !isEmployerSpace) {
      const u = request.nextUrl.clone();
      u.pathname = '/dashboard/mi-perfil';
      return NextResponse.redirect(u);
    }
    if (isDashboardRoute && isEmployerSpace) {
      const u = request.nextUrl.clone();
      u.pathname = '/admin';
      return NextResponse.redirect(u);
    }
    if (isAuthRoute) {
      const u = request.nextUrl.clone();
      u.pathname = isEmployerSpace ? '/admin' : '/dashboard/mi-perfil';
      return NextResponse.redirect(u);
    }
  }

  return supabaseResponse;
}
