import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Cron diario: para cada saved_search con alert_frequency != 'off',
 * comprueba si hay candidatos nuevos públicos creados desde last_alert_at
 * que cumplan los filtros y envía un email.
 *
 * Por ahora solo actualiza last_alert_at y registra una notificación in-app
 * (el envío de emails con Resend se activa cuando RESEND_API_KEY esté configurada).
 */
export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServerClient();

  const { data: searches } = await supabase
    .from('saved_searches')
    .select('*')
    .neq('alert_frequency', 'off');

  let processed = 0;
  let notificationsCreated = 0;

  for (const s of searches ?? []) {
    const since = s.last_alert_at ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .gt('updated_at', since);

    if ((count ?? 0) > 0) {
      await supabase.from('notifications').insert({
        user_id: s.user_id,
        type: 'saved_search_match',
        payload: {
          message: `${count} ${count === 1 ? 'nuevo perfil coincide' : 'nuevos perfiles coinciden'} con tu búsqueda "${s.name}".`,
          search_id: s.id,
          search_name: s.name,
          count,
        },
      });
      notificationsCreated++;
    }

    await supabase
      .from('saved_searches')
      .update({ last_alert_at: new Date().toISOString() })
      .eq('id', s.id);

    processed++;
  }

  return NextResponse.json({ ok: true, processed, notificationsCreated });
}
