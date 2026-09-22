/**
 * ¿Quién puede ver el catálogo de candidatos?
 *
 * POR QUÉ EXISTE ESTO
 * Los 1.055 candidatos importados del Excel de postulantes no tienen cuenta:
 * no se registraron, no pueden entrar, no pueden editar ni retirar su ficha.
 * Estaban publicados en abierto e indexados en Google con nombre y apellidos.
 *
 * Y en el modelo de Migria ese escaparate abierto no vende nada: la empresa no
 * navega perfiles por su cuenta, habla con Migria y Migria le presenta la short
 * list. Así que el catálogo abierto era todo el riesgo y ninguna venta. Detrás
 * de registro, además, cada empresa que mira deja su correo.
 *
 * CÓMO SE REVIERTE
 * Poniendo `CATALOGO_PUBLICO=true` en las variables de entorno de Vercel. No
 * hace falta tocar código ni base de datos, y el despliegue que dispara el
 * cambio de variable lo deja como estaba: catálogo abierto, fichas indexables y
 * perfiles otra vez en el sitemap.
 *
 * Deliberadamente NO se ha tocado `is_public` en la base de datos ni las
 * políticas de acceso. Lo que un candidato decidió sobre su propia visibilidad
 * sigue guardado tal cual, y el día que se revierta esto vuelve solo.
 */

import { createClient } from '@/lib/supabase/server';

export type RolUsuario = 'candidate' | 'employer' | 'admin' | null;

/** Interruptor global. Sin la variable puesta, el catálogo está cerrado. */
export function catalogoEsPublico(): boolean {
  return process.env.CATALOGO_PUBLICO === 'true';
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
