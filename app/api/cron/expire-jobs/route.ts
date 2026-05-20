import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Cron diario: marca como 'expired' las ofertas con expires_at < now() y status='published'.
 *
 * Configurar en vercel.json:
 *   { "crons": [{ "path": "/api/cron/expire-jobs", "schedule": "0 5 * * *" }] }
 *
 * Vercel firma sus cron requests con header `x-vercel-cron`. Validamos eso para
 * evitar invocaciones manuales no autorizadas.
 */
export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServerClient();
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
