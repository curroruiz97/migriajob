/**
 * ¿Quién puede ver el catálogo de candidatos?
 *
 * POR DEFECTO ESTÁ ABIERTO, Y ES UNA DECISIÓN DE NEGOCIO
 * El catálogo se cerró el 22 de septiembre de 2026 y se volvió a abrir el
 * mismo día, con este razonamiento de Curro: lo que Talnet vende no es el
 * acceso a los candidatos, es el proceso. Una empresa que vea una ficha no
 * puede llamar a esa persona y traérsela de Perú por su cuenta: necesita la
 * captación, la validación, la extranjería, el visado, el alta, el vuelo y el
 * acompañamiento. El escaparate abierto es entonces marketing —enseña el fondo
 * de talento que justifica el servicio— y no una fuga de valor.
 *
 * CÓMO SE CIERRA, SI ALGÚN DÍA HACE FALTA
 * Poniendo `CATALOGO_PUBLICO=false` en las variables de entorno de Vercel. No
 * hace falta tocar código ni base de datos. Con eso, las fichas con nombre solo
 * se abren con sesión de empresa, el visitante ve el catálogo en anónimo
 * (components/public/catalogo-bloqueado.tsx), las fichas mandan `noindex` y los
 * perfiles salen del sitemap.
 *
 * Deliberadamente NO se toca `is_public` en la base de datos ni las políticas
 * de acceso: lo que cada candidato decidió sobre su propia visibilidad se
 * respeta en los dos casos.
 *
 * Lo que queda pendiente al margen de esto, porque no depende de que el
 * catálogo esté abierto o cerrado: las 1.055 personas importadas del Excel no
 * saben que su ficha está publicada y no tienen forma de pedir la baja.
 */

import { createClient } from '@/lib/supabase/server';

export type RolUsuario = 'candidate' | 'employer' | 'admin' | null;

/** Interruptor global. Sin la variable puesta, el catálogo está abierto. */
export function catalogoEsPublico(): boolean {
  return process.env.CATALOGO_PUBLICO !== 'false';
}

/**
 * Las fichas son para quien contrata. Un candidato con sesión iniciada tampoco
 * ve el catálogo: no tiene por qué navegar los perfiles de los demás.
 */
export function puedeVerCatalogo(rol: RolUsuario): boolean {
  return catalogoEsPublico() || rol === 'employer' || rol === 'admin';
}

/**
 * Rol de quien está mirando, o null si no hay sesión.
 *
 * Se salta la consulta a `profiles` cuando el catálogo está abierto: en ese
 * caso el rol no cambia nada y no vale la pena pagar una ida y vuelta a
 * Supabase en cada visita a la portada.
 */
export async function rolDelVisitante(): Promise<RolUsuario> {
  if (catalogoEsPublico()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: 'candidate' | 'employer' | 'admin' }>();

  return data?.role ?? 'candidate';
}
