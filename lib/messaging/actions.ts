'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

/**
 * Abrir la conversacion entre una empresa y una persona candidata.
 *
 * POR QUE EXISTE ESTO. Los botones "Contactar" de los perfiles publicos eran
 * `<Button>` sin `onClick`, sin `href` y sin formulario: adorno. No habia
 * ninguna forma de iniciar una conversacion desde la aplicacion, y se notaba en
 * los datos —401 cuentas y 176 candidaturas frente a 1 conversacion—. La ficha
 * de App Store promete "Habla directamente con las empresas que se interesan
 * por tu perfil", asi que ademas de una funcion rota era una promesa incumplida.
 *
 * Sin conversaciones tampoco se puede enseñar el bloqueo, que vive dentro de un
 * hilo y que la directriz 1.2 exige que exista y funcione.
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
