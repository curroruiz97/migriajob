import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { JOURNEY_STAGES, getStageIndex } from '@/lib/journey-stages';

/**
 * Cron semanal: envía notificaciones de acompañamiento a candidatos cuyo
 * proceso lleva más de 14 días sin actualización en etapas de espera larga
 * (etapas 3-7: expediente presentado → esperando resolución).
 *
 * Configurar en vercel.json:
 *   { "path": "/api/cron/journey-accompaniment", "schedule": "0 10 * * 1" }
 *   (cada lunes a las 10:00 UTC)
 */

const LONG_WAIT_STAGES: Array<
  'expediente_presentado' | 'revision_administrativa' | 'evaluacion_expediente' | 'coordinacion_incorporacion' | 'esperando_resolucion'
> = [
  'expediente_presentado',
  'revision_administrativa',
  'evaluacion_expediente',
  'coordinacion_incorporacion',
  'esperando_resolucion',
];

const ACCOMPANIMENT_MESSAGES: Record<string, string> = {
  expediente_presentado:
    'Tu expediente fue presentado y se encuentra en trámite. Sabemos que la espera puede ser larga, pero estamos atentos a cualquier novedad.',
  revision_administrativa:
    'Las autoridades continúan revisando tu documentación. Este es un proceso estándar. Te informaremos de cualquier avance.',
  evaluacion_expediente:
    'Tu expediente sigue en evaluación. Todo marcha según lo previsto. Estamos pendientes para ti.',
  coordinacion_incorporacion:
    'Seguimos coordinando con la empresa los detalles de tu incorporación mientras avanza el proceso administrativo.',
  esperando_resolucion:
    'Tu expediente está en la recta final del proceso administrativo. Pronto deberíamos tener novedades.',
};

export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized =
    request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServerClient();

  // Buscar journeys en etapas de espera larga sin actualización en 14+ días
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data: journeys, error } = await supabase
    .from('candidate_journey')
    .select('id, candidate_id, current_stage, stage_updated_at')
    .in('current_stage', LONG_WAIT_STAGES)
    .lt('stage_updated_at', fourteenDaysAgo.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let notified = 0;

  for (const journey of journeys ?? []) {
    // Buscar el profile_id del candidato
    const { data: candidate } = await supabase
      .from('candidates')
      .select('profile_id')
      .eq('id', journey.candidate_id)
      .maybeSingle();

    if (!candidate?.profile_id) continue;

    // Verificar que no se envió ya una notificación de acompañamiento esta semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', candidate.profile_id)
      .eq('type', 'process_stage_changed')
      .gt('created_at', oneWeekAgo.toISOString());

    if ((count ?? 0) > 0) continue;

    const stageDef = JOURNEY_STAGES.find((s) => s.key === journey.current_stage);
    const message =
      ACCOMPANIMENT_MESSAGES[journey.current_stage] ??
      `Tu proceso sigue en la etapa "${stageDef?.title ?? journey.current_stage}". Estamos atentos.`;

    await supabase.from('notifications').insert({
      user_id: candidate.profile_id,
      type: 'process_stage_changed',
      payload: {
        message,
        stage: journey.current_stage,
        journey_id: journey.id,
        is_accompaniment: true,
      },
    });

    notified++;
  }

  return NextResponse.json({ ok: true, notified });
}
