import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Endpoint que intercambia el ?code= de OAuth (Google, LinkedIn, magic link)
 * por una sesión Supabase, y redirige al panel correspondiente según rol.
 *
 * Configurar como Redirect URL en Supabase Auth → Providers:
 *   http://localhost:3000/auth/callback
 *   https://TU_DOMINIO/auth/callback
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/admin';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url)
    );
  }

  // Determinar destino según rol
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', url));

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const dest =
    profile?.role === 'employer'
      ? '/admin'
      : profile?.role === 'admin'
      ? '/admin'
      : '/dashboard/mi-perfil';

  return NextResponse.redirect(new URL(next || dest, url));
}
