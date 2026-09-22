import 'server-only';

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase que actúa como el servidor, no como un visitante.
 *
 * CUÁNDO USARLO
 * Cuando no hay nadie al otro lado, o cuando quien dispara la acción no tiene
 * permiso para leer lo que hace falta:
 *
 *   · Las tareas programadas. Se ejecutan solas, sin sesión, y por eso el
 *     cliente normal las dejaba sin hacer nada: las políticas de la base de
 *     datos veían a un anónimo y le negaban el paso, en silencio y con un
 *     alegre `{ ok: true, expired: 0 }`.
 *   · El reparto de notificaciones. Una empresa escribe a un candidato y hay
 *     que leer los dispositivos del candidato, que la empresa no puede ver.
 *   · La recogida del formulario de contacto, que escribe en una tabla que
 *     nadie más puede tocar.
 *
 * CUÁNDO NO
 * En cualquier cosa que ocurra a petición de un usuario con sesión. Ahí va el
 * cliente de `lib/supabase/server.ts`, que respeta las políticas de acceso y
 * es la razón de que un empleador no pueda leer los datos de otro. Este de
 * aquí se las salta todas: cada uso es una excepción que hay que justificar.
 *
 * Devuelve null si falta la clave, para que quien llame decida qué hacer en
 * lugar de reventar a mitad de una tarea.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
