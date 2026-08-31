import type { SupabaseClient } from '@supabase/supabase-js';
import { pushToUser } from '@/lib/push/send';

/**
 * Punto de entrada unico para avisar a un usuario.
 *
 * Antes cada sitio hacia su propio `from('notifications').insert(...)`. Eso
 * funcionaba mientras el aviso solo vivia dentro de la web, pero con la app
 * movil hay que hacer dos cosas por cada aviso: guardarlo y enviarlo al
 * telefono. Repartir esa segunda mitad por el codigo garantiza que alguien la
 * olvide en el proximo aviso que se añada.
 *
 * La push es best-effort y nunca lanza: el aviso guardado es la fuente de
 * verdad, la notificacion del movil es una cortesia.
 */

export type NotificationPayload = Record<string, unknown>;

interface CrearAvisoArgs {
  supabase: SupabaseClient;
  userId: string;
  type: string;
  payload?: NotificationPayload;
  /** Texto de la notificacion del movil. Sin esto solo se guarda el aviso. */
  push?: {
    title: string;
    body: string;
    /** Ruta interna a abrir al tocarla, p.ej. /dashboard/mensajes */
    link?: string;
  };
}

export async function createNotification({
  supabase,
  userId,
  type,
  payload = {},
  push,
}: CrearAvisoArgs): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    payload,
  });

  if (error) return { ok: false, error: error.message };

  if (push) {
    // Sin await deliberado no: queremos que termine antes de que la funcion
    // serverless se apague, o el envio se corta a medias.
    await pushToUser(userId, push);
  }

  return { ok: true };
}
