import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Índice del área admin. Reparte según quién entra:
 *
 *   · Equipo de Migria (rol admin) → Expedientes, que es su trabajo.
 *   · Empresa sin ficha creada      → onboarding.
 *   · Empresa con ficha             → sus ofertas.
 *
 * LO DEL ROL ADMIN NO ES UN ADORNO. Antes esto solo miraba si la cuenta tenía
 * empresa asociada, y un administrador de Migria no la tiene ni debe tenerla:
 * al entrar por primera vez se encontraba el formulario "Cuéntanos sobre tu
 * empresa" con su propio nombre ya escrito en la casilla del nombre. Si lo
 * rellenaba —que es a lo que invita la pantalla— creaba una empresa fantasma
 * dentro de los datos de producción; y si no lo rellenaba, el panel parecía no
 * funcionar, porque había que saber escribir /admin/expedientes a mano.
 *
 * Este reparto NO se hace desde el layout para evitar bucles de redirect (ver
 * comentario en app/admin/layout.tsx).
 */
export default async function AdminIndex() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/admin');

  // Las dos consultas son independientes: en serie sumaban sus dos idas y
  // vueltas antes de decidir a dónde mandar a nadie.
  const [{ data: profile }, { data: company }] = await Promise.all([
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'candidate' | 'employer' | 'admin' }>(),
    supabase.from('companies').select('id').eq('owner_id', user.id).maybeSingle(),
  ]);

  if (profile?.role === 'admin') redirect('/admin/expedientes');

  if (!company) redirect('/admin/onboarding');
  redirect('/admin/ofertas');
}
