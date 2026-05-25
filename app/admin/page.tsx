import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Índice del área admin. Si el empleador NO tiene company creada, le mandamos
 * al onboarding. Si ya la tiene, a su listado de ofertas.
 *
 * Este check NO se hace desde el layout para evitar bucles de redirect (ver
 * comentario en app/admin/layout.tsx).
 */
export default async function AdminIndex() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/admin');

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!company) redirect('/admin/onboarding');
  redirect('/admin/ofertas');
}
