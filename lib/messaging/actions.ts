'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

/**
 * Abrir la conversacion entre una empresa y una persona candidata.
 *
 * POR QUE EXISTE ESTO. Los botones "Contactar" de los perfiles publicos eran
 * `<Button>` sin `onClick`, sin `href` y sin formulario: adorno.
 *
 * PRECISION IMPORTANTE, porque el commit que introdujo este fichero lo conto
 * mal: si habia una forma de abrir conversacion, `startConversationAction` en
 * app/admin/mensajes/actions.ts, pero solo desde el area de empresa
 * (/admin/candidatos/[slug], boton "Escribir a X"). Lo que no existia era desde
 * el perfil publico, que es la puerta por la que entra cualquiera que llegue de
 * fuera. En la practica casi nadie llegaba: 401 cuentas y 176 candidaturas
 * frente a 1 conversacion.
 *
 * La ficha de App Store promete "Habla directamente con las empresas que se
 * interesan por tu perfil", asi que un boton muerto ahi es tambien una promesa
 * incumplida.
 *
 * Esta accion cubre las dos direcciones y decide los papeles leyendo los roles,
 * mientras que la del area de empresa da por hecho que quien llama es la
 * empresa. Las dos crean la fila igual (employer_id, candidate_id), asi que el
 * indice unico de la migracion 0018 las mantiene de acuerdo.
 *
 * BUSCAR O CREAR, NUNCA DUPLICAR. Si las dos personas ya tienen hilo se
 * devuelve ese. La unicidad la garantiza ademas un indice en la base de datos
 * (migracion 0018), porque dos pulsaciones seguidas pueden colarse entre la
 * consulta y el insert.
 */

export type ResultadoConversacion =
  | { ok: true; id: string }
  | { error: string; necesitaSesion?: true };

export async function abrirConversacionAction(
  otroUsuarioId: string
): Promise<ResultadoConversacion> {
  const resultado = await safeAction(async (): Promise<ResultadoConversacion> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // No es un error que enseñar: el cliente manda a iniciar sesion y vuelve.
    if (!user) {
      return { error: 'Inicia sesión para escribir.', necesitaSesion: true };
    }
    if (user.id === otroUsuarioId) {
      return { error: 'No puedes escribirte a ti mismo.' };
    }

    const { data: perfiles } = await supabase
      .from('profiles')
      .select('id, role')
      .in('id', [user.id, otroUsuarioId]);

    const yo = perfiles?.find((p) => p.id === user.id);
    const otro = perfiles?.find((p) => p.id === otroUsuarioId);
    if (!yo || !otro) {
      return { error: 'No se ha encontrado el perfil.' };
    }

    // Una conversacion siempre tiene un lado empresa y un lado candidato: es lo
    // que exige la tabla y lo que comprueban las politicas de acceso. Los
    // administradores cuentan como el lado empresa para poder atender hilos.
    let employerId: string;
    let candidateId: string;
    if (yo.role === 'candidate' && otro.role !== 'candidate') {
      candidateId = yo.id;
      employerId = otro.id;
    } else if (otro.role === 'candidate' && yo.role !== 'candidate') {
      candidateId = otro.id;
      employerId = yo.id;
    } else {
      return {
        error:
          yo.role === 'candidate'
            ? 'Solo puedes escribir a empresas.'
            : 'Solo puedes escribir a personas candidatas.',
      };
    }

    const { data: existente } = await supabase
      .from('conversations')
      .select('id')
      .eq('employer_id', employerId)
      .eq('candidate_id', candidateId)
      .maybeSingle<{ id: string }>();

    if (existente) return { ok: true, id: existente.id };

    const { data: creada, error } = await supabase
      .from('conversations')
      .insert({ employer_id: employerId, candidate_id: candidateId })
      .select('id')
      .single<{ id: string }>();

    if (error) {
      // 42501 es la politica de acceso: pasa cuando hay un bloqueo entre las dos
      // partes. 23505 es el indice de unicidad, que salta si dos pulsaciones se
      // cruzan; en ese caso el hilo existe y basta con leerlo.
      if (error.code === '23505') {
        const { data: yaCreada } = await supabase
          .from('conversations')
          .select('id')
          .eq('employer_id', employerId)
          .eq('candidate_id', candidateId)
          .maybeSingle<{ id: string }>();
        if (yaCreada) return { ok: true, id: yaCreada.id };
      }
      return {
        error:
          error.code === '42501'
            ? 'No se puede iniciar esta conversación.'
            : 'No se ha podido abrir la conversación.',
      };
    }

    return { ok: true, id: creada.id };
  });

  // safeAction devuelve `{ error }` si algo revienta; ya encaja con el tipo.
  return resultado as ResultadoConversacion;
}
