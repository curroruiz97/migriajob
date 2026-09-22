import { NextResponse } from 'next/server';
import { createNotification } from '@/lib/notifications/create';
import { createAdminClient } from '@/lib/supabase/admin';
import { buscarCandidatos, type ProfileFilters } from '@/lib/db/queries';

/**
 * Cron diario: avisa a quien tenga una búsqueda guardada con alerta activada
 * de los perfiles nuevos que cumplen SUS filtros.
 *
 * DOS COSAS ESTABAN MAL, Y LAS DOS EN SILENCIO.
 *
 * 1. Usaba el cliente de Supabase que va con la sesión del visitante, pero una
 *    tarea programada no tiene visitante. Las políticas veían a un anónimo y
 *    `saved_searches` —que es privada de cada usuario— devolvía cero filas.
 *    Resultado: no se envió jamás una sola alerta, y la respuesta decía
 *    `{ ok: true, processed: 0 }`.
 *
 * 2. Aunque hubiera leído las búsquedas, no aplicaba sus filtros: contaba
 *    todos los candidatos públicos actualizados desde la última vez. Una
 *    empresa que hubiera guardado "cocineros con NIE en Valencia" habría
 *    recibido "37 perfiles nuevos coinciden con tu búsqueda" contando a todo
 *    el mundo. Peor que no avisar: avisar mal enseña a ignorar los avisos.
 *
 * Ahora usa el cliente de servicio y la misma función de búsqueda que la
 * pantalla, así que un filtro nuevo en el panel vale aquí sin tocar nada.
 */
export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor' },
      { status: 500 }
    );
  }

  const { data: searches, error } = await supabase
    .from('saved_searches')
    .select('id, user_id, name, filters, last_alert_at')
    .neq('alert_frequency', 'off');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let procesadas = 0;
  let avisos = 0;

  for (const s of searches ?? []) {
    const busqueda = s as {
      id: string;
      user_id: string;
      name: string;
      filters: ProfileFilters | null;
      last_alert_at: string | null;
    };

    // Sin aviso previo, se mira la última semana: es lo que tiene sentido
    // enseñar la primera vez, en vez del histórico entero.
    const desde =
      busqueda.last_alert_at ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Los filtros que la empresa guardó, más la novedad. `perPage: 1` porque
    // aquí solo interesa el total, no los perfiles.
    const { total } = await buscarCandidatos(supabase, {
      ...(busqueda.filters ?? {}),
      updatedAfter: desde,
      page: 1,
      perPage: 1,
    });

    if (total > 0) {
      const mensaje =
        total === 1
          ? `Un perfil nuevo coincide con tu búsqueda "${busqueda.name}".`
          : `${total} perfiles nuevos coinciden con tu búsqueda "${busqueda.name}".`;

      await createNotification({
        supabase,
        userId: busqueda.user_id,
        type: 'saved_search_match',
        payload: {
          message: mensaje,
          search_id: busqueda.id,
          search_name: busqueda.name,
          count: total,
        },
        push: {
          title: 'Nuevos perfiles para ti',
          body: mensaje,
          link: '/admin/busquedas-guardadas',
        },
      });
      avisos++;
    }

    // La fecha se actualiza siempre, haya habido aviso o no: si no, una
    // búsqueda sin coincidencias arrastraría su ventana para siempre y acabaría
    // avisando del histórico entero el día que apareciera un perfil.
    await supabase
      .from('saved_searches')
      .update({ last_alert_at: new Date().toISOString() })
      .eq('id', busqueda.id);

    procesadas++;
  }

  return NextResponse.json({ ok: true, procesadas, avisos });
}
