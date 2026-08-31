import { createClient } from '@supabase/supabase-js';
import { sendApnsPush, pushConfigured, type PushMessage, type ApnsEnvironment } from './apns';

/**
 * Reparto de una push a todos los dispositivos de un usuario.
 *
 * Usa la clave de servicio a proposito: esto corre en respuesta a acciones de
 * OTRA persona (una empresa escribe a un candidato, alguien se inscribe a una
 * oferta), asi que el emisor no puede leer los dispositivos del destinatario
 * con la sesion de quien dispara el aviso.
 */

interface DeviceRow {
  id: string;
  token: string;
  environment: ApnsEnvironment | null;
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Nunca lanza. Una push que falla no puede tumbar la accion que la origino:
 * si una empresa manda un mensaje, el mensaje debe guardarse aunque Apple este
 * caido. Los fallos se registran y punto.
 */
export async function pushToUser(userId: string, message: PushMessage): Promise<void> {
  if (!pushConfigured()) return;

  const supabase = adminClient();
  if (!supabase) {
    console.warn('[push] falta SUPABASE_SERVICE_ROLE_KEY; no se envia nada');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('device_tokens')
      .select('id, token, environment')
      .eq('user_id', userId)
      .eq('platform', 'ios');

    if (error) {
      console.warn('[push] no se pudieron leer los dispositivos:', error.message);
      return;
    }

    const dispositivos = (data ?? []) as DeviceRow[];
    if (dispositivos.length === 0) return;

    const caducados: string[] = [];

    await Promise.all(
      dispositivos.map(async (d) => {
        const r = await sendApnsPush(d.token, message, d.environment);

        if (r.tokenInvalid) {
          caducados.push(d.id);
          return;
        }
        // Aprendemos el entorno la primera vez para ahorrarnos el doble intento.
        if (r.ok && r.environment && r.environment !== d.environment) {
          await supabase
            .from('device_tokens')
            .update({ environment: r.environment, updated_at: new Date().toISOString() })
            .eq('id', d.id);
        }
        if (!r.ok) {
          console.warn('[push] fallo al enviar:', r.status, r.reason);
        }
      })
    );

    // La app desinstalada o el token caducado se borran: si no, la tabla se
    // llena de dispositivos muertos y cada aviso gasta una llamada inutil.
    if (caducados.length > 0) {
      await supabase.from('device_tokens').delete().in('id', caducados);
    }
  } catch (err) {
    console.warn('[push] error inesperado:', err);
  }
}
