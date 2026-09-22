import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cron diario: marca como 'expired' las ofertas con expires_at < now() y
 * status='published'.
 *
 * ESTO NO HACÍA NADA HASTA EL 22 DE SEPTIEMBRE DE 2026, y lo peor es que lo
 * decía todo lo contrario. Usaba el cliente de Supabase que va con la sesión
 * del visitante, pero una tarea programada no tiene visitante: actúa como un
 * anónimo. Las políticas de la base de datos hacen entonces lo correcto —un
 * anónimo no modifica ofertas ajenas— y el UPDATE no tocaba ni una fila.
 * Respuesta: `{ ok: true, expired: 0 }`, todos los días, con ofertas caducadas
 * figurando como publicadas en la web.
 *
 * Ahora usa el cliente de servicio, que es lo que necesita algo que se ejecuta
 * solo. Ver lib/supabase/admin.ts.
 */
export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    // Mejor un error visible que otro cero silencioso.
    return NextResponse.json(
      { error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'expired' })
    .lt('expires_at', new Date().toISOString())
    .eq('status', 'published')
    .select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expired: data?.length ?? 0 });
}
