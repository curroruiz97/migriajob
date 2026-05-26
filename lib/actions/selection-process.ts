import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

type Stage = 'new' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';

// Orden de "avance" del pipeline. Cuanto mayor el índice, más avanzado.
// `rejected` es terminal: si llega como target lo aplica siempre.
const ORDER: Stage[] = ['new', 'contacted', 'interview', 'offer', 'hired'];
const TERMINAL: Stage[] = ['hired', 'rejected'];

function isMoreAdvanced(target: Stage, current: Stage): boolean {
  if (current === 'rejected') return target === 'hired'; // recuperar de rechazo solo a hired
  const t = ORDER.indexOf(target);
  const c = ORDER.indexOf(current);
  return t > c;
}

/**
 * Crea o promueve un `selection_processes` para (employer, candidate).
 *
 * - Resuelve el `candidate_id` desde el `profile_id`.
 * - Si NO hay proceso → inserta uno nuevo con `targetStage`.
 * - Si ya hay proceso → solo actualiza si `targetStage` está más avanzado
 *   (no degrada de 'interview' a 'contacted', por ejemplo). Estados
 *   terminales (`hired`, `rejected`) siempre se aplican si llegan como target.
 *
 * Idempotente: ante llamadas repetidas no genera duplicados ni rebajas.
 * Silencioso ante errores: si la operación falla, NO lanza — el caller no
 * debería romper su flujo principal (mensaje, cambio de estado) por esto.
 */
export async function upsertSelectionStage(
  supabase: SupabaseClient,
  params: {
    employerId: string;
    /** ID del perfil (profiles.id) del candidato. */
    candidateProfileId: string;
    targetStage: Stage;
    /** Si se conoce la oferta a la que se vincula el proceso, pasarla. */
    jobId?: string | null;
  }
): Promise<void> {
  const { employerId, candidateProfileId, targetStage, jobId = null } = params;
  try {
    // 1) Resolver candidate.id desde profile_id
    const { data: cand } = await supabase
      .from('candidates')
      .select('id')
      .eq('profile_id', candidateProfileId)
      .maybeSingle();
    const candidateId = (cand as { id?: string } | null)?.id;
    if (!candidateId) return;

    // 2) ¿Hay ya un proceso? Buscamos por (employer, candidate) sin filtrar
    //    por job_id para evitar duplicados (un candidato suele estar en un
    //    único pipeline general por empresa).
    const { data: existing } = await supabase
      .from('selection_processes')
      .select('id, stage')
      .eq('employer_id', employerId)
      .eq('candidate_id', candidateId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing) {
      // INSERT
      await supabase.from('selection_processes').insert({
        employer_id: employerId,
        candidate_id: candidateId,
        job_id: jobId,
        stage: targetStage,
      } as never);
      return;
    }

    // 3) Promoción solo si avanza (o si es terminal).
    const currentStage = (existing as { stage: Stage }).stage;
    const shouldUpdate =
      TERMINAL.includes(targetStage) || isMoreAdvanced(targetStage, currentStage);
    if (!shouldUpdate) return;

    await supabase
      .from('selection_processes')
      .update({ stage: targetStage as never, updated_at: new Date().toISOString() })
      .eq('id', (existing as { id: string }).id);
  } catch {
    // Silencioso a propósito (no rompe el flujo del caller).
  }
}

/** Convierte un estado de `applications.status` al stage de pipeline correspondiente. */
export function applicationStatusToStage(
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
): Stage {
  switch (status) {
    case 'submitted':
    case 'reviewing':
      return 'new';
    case 'shortlisted':
      return 'contacted';
    case 'rejected':
      return 'rejected';
    case 'hired':
      return 'hired';
  }
}
