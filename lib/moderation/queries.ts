import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Consultas de bloqueo para las páginas de servidor.
 *
 * Solo dicen a quién has bloqueado TÚ. Quién te ha bloqueado a ti no se
 * expone a propósito: saberlo solo sirve para buscarle las vueltas, y la
 * política de la base de datos ya impide escribir en ambos sentidos.
 */

export async function listBlockedIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from('blocked_users')
    .select('blocked_id')
    .eq('blocker_id', userId);
  return (data ?? []).map((r: { blocked_id: string }) => r.blocked_id);
}

export async function isBlockedByMe(
  supabase: SupabaseClient,
  userId: string,
  otherId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('blocked_users')
    .select('id')
    .eq('blocker_id', userId)
    .eq('blocked_id', otherId)
    .maybeSingle();
  return Boolean(data);
}

/**
 * ¿Hay bloqueo en cualquiera de los dos sentidos? Usa la función de la base de
 * datos, que es la misma que aplican las políticas de escritura, para que la
 * interfaz y las reglas nunca digan cosas distintas.
 */
export async function isBlockedBetween(
  supabase: SupabaseClient,
  a: string,
  b: string
): Promise<boolean> {
  const { data } = await supabase.rpc('is_blocked_between', { a, b });
  return data === true;
}
