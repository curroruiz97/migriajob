import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Vuelta de Supabase tras confirmar el correo, entrar con Google o usar un
 * enlace magico. Intercambia lo que venga en la URL por una sesion y manda a
 * cada rol a su sitio.
 *
 * Configurar como Redirect URL en Supabase Auth → URL Configuration:
 *   http://localhost:3000/auth/callback
 *   https://www.migriajob.com/auth/callback
 *
 * AQUI HABIA UN FALLO QUE DEJABA A TODO EL MUNDO EN EL SITIO EQUIVOCADO:
 *
 *   const next = url.searchParams.get('next') ?? '/admin';
 *   ...
 *   return NextResponse.redirect(new URL(next || dest, url));
 *
 * `next` valia '/admin' siempre que no viniera en la URL, y como '/admin' es
 * una cadena con contenido, `next || dest` se quedaba siempre con `next`. El
 * `dest` calculado a partir del rol —las quince lineas de arriba— no se usaba
 * nunca. Un candidato acababa en /admin y de ahi rebotaba, dando dos saltos
 * para llegar a su panel.
 *
 * Y falta algo mas: Supabase manda el enlace de confirmacion con `token_hash`
 * y `type`, no con `code`. Con `code` ausente esto respondia
 * /login?error=missing_code, asi que la confirmacion por correo no pasaba por
 * aqui en absoluto: acababa donde apuntara la Site URL, normalmente la portada,
 * sin decirle a la persona si su cuenta habia quedado verificada o no.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  // Solo se acepta una ruta interna: un `next` absoluto sacaria al usuario a
  // otro dominio con la sesion recien abierta.
  const nextParam = url.searchParams.get('next');
  const next = nextParam && nextParam.startsWith('/') ? nextParam : null;

  const supabase = await createClient();

  let error: { message: string } | null = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'invite' | 'email_change' | 'magiclink' | 'email',
      token_hash: tokenHash,
    }));
  } else {
    return NextResponse.redirect(new URL('/login?error=missing_code', url));
  }

  if (error) {
    // El caso mas comun es un enlace caducado o ya usado. Se dice en la
    // pantalla de acceso en vez de dejar a la persona en la portada
    // preguntandose si su cuenta existe.
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sin sesion (puede pasar con algunos tipos de enlace) al menos se confirma
  // que la verificacion salio bien y se invita a entrar.
  if (!user) return NextResponse.redirect(new URL('/login?verificado=1', url));

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: 'candidate' | 'employer' | 'admin' }>();

  const dest =
    profile?.role === 'employer' || profile?.role === 'admin'
      ? '/admin'
      : '/dashboard/mi-perfil';

  return NextResponse.redirect(new URL(next ?? dest, url));
}
