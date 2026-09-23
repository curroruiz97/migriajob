import 'server-only';

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Corta el paso a quien no sea del equipo de Talnet.
 *
 * /admin lo comparten las empresas cliente y el equipo, así que esconder una
 * entrada del menú no cierra nada: la dirección se sigue pudiendo escribir a
 * mano. Esto va en el layout de cada carpeta restringida, de modo que cubre
 * también sus subrutas sin tener que acordarse en cada página.
 *
 * Responde 404 y no 403 a propósito: para una empresa, esas pantallas no es
 * que estén prohibidas, es que no existen.
 */
export async function soloEquipo(): Promise<void> {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) notFound();

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle<{ role: string }>();

  if (perfil?.role !== 'admin') notFound();
}

/**
 * Igual que soloEquipo() pero sin cortar: para las pantallas que ve todo el
 * mundo y solo cambian un botón según quién mire.
 */
export async function esDelEquipo(): Promise<boolean> {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return false;

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle<{ role: string }>();

  return perfil?.role === 'admin';
}
