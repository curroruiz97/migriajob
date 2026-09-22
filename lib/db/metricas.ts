import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { JOURNEY_STAGES, getStageIndex } from '@/lib/journey-stages';

import { MOTIVOS_DE_CIERRE } from '@/lib/journey-outcome';

export { MOTIVOS_DE_CIERRE };

/**
 * Métricas del proceso migratorio.
 *
 * LA PREGUNTA QUE RESPONDE ESTO: en qué paso se sale la gente. Un expediente
 * pasa por once etapas y lo que importa no es cuántos hay en cada una, sino
 * cuántos llegaron a cada una y cuántos se quedaron por el camino.
 *
 * CÓMO SE CALCULA, Y POR QUÉ ASÍ. El embudo no se deduce del histórico de
 * cambios de etapa, aunque exista: ese histórico solo tiene filas si alguien
 * fue moviendo las etapas una a una, y si un expediente se salta pasos o se
 * actualiza de golpe, quedan huecos. Se calcula del estado: si un expediente
 * está —o se cerró— en la etapa N, es que pasó por todas las anteriores. Eso
 * es cierto siempre, porque las etapas son una secuencia.
 *
 * Los datos se agregan aquí y no en SQL a propósito: son pocas filas por
 * definición (un expediente es una persona en un proceso de meses), y tenerlo
 * en un sitio legible vale más que ahorrar unos milisegundos.
 */

export interface FilaEmbudo {
  key: string;
  titulo: string;
  /** Expedientes que llegaron a esta etapa, estén donde estén ahora. */
  alcanzaron: number;
  /** De los que llegaron, los que siguen parados aquí y vivos. */
  aqui_ahora: number;
  /** Los que terminaron sin incorporación justo en esta etapa. */
  se_cayeron_aqui: number;
  /** Porcentaje de los que llegaron aquí y no pasaron de aquí. */
  tasa_caida: number;
  /** Días de media que llevan aquí los que siguen vivos en esta etapa. */
  dias_medios: number | null;
}

export interface Metricas {
  total: number;
  en_curso: number;
  incorporados: number;
  cerrados: number;
  /** Incorporados sobre procesos terminados. Null si no ha terminado ninguno. */
  tasa_exito: number | null;
  reposiciones: number;
  /** Días de media entre que se abre un expediente y la persona se incorpora. */
  dias_hasta_incorporacion: number | null;
  embudo: FilaEmbudo[];
  motivos: Array<{ motivo: string; etiqueta: string; total: number; porcentaje: number }>;
}


interface FilaExpediente {
  id: string;
  current_stage: string;
  outcome: 'en_curso' | 'incorporado' | 'cerrado' | null;
  close_reason: string | null;
  closed_stage: string | null;
  closed_at: string | null;
  created_at: string;
  stage_updated_at: string | null;
  inc_effective_start: string | null;
  replaces_journey_id: string | null;
}

const DIA = 86_400_000;
const dias = (desde: string, hasta: string) =>
  (new Date(hasta).getTime() - new Date(desde).getTime()) / DIA;

const media = (xs: number[]) =>
  xs.length === 0 ? null : Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;

export async function getMetricas(): Promise<Metricas> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('candidate_journey')
    .select(
      'id, current_stage, outcome, close_reason, closed_stage, closed_at, created_at, stage_updated_at, inc_effective_start, replaces_journey_id'
    );

  const filas = (data ?? []) as unknown as FilaExpediente[];
  const ahora = new Date().toISOString();

  const enCurso = filas.filter((f) => (f.outcome ?? 'en_curso') === 'en_curso');
  const incorporados = filas.filter((f) => f.outcome === 'incorporado');
  const cerrados = filas.filter((f) => f.outcome === 'cerrado');
  const terminados = incorporados.length + cerrados.length;

  // --- Embudo ---
  const embudo: FilaEmbudo[] = JOURNEY_STAGES.map((etapa, indice) => {
    // Llegó a esta etapa quien está —o se cerró— en ella o en una posterior.
    // Un incorporado ha recorrido el proceso entero.
    const alcanzaron = filas.filter((f) => {
      if (f.outcome === 'incorporado') return true;
      const clave = f.outcome === 'cerrado' ? (f.closed_stage ?? f.current_stage) : f.current_stage;
      return getStageIndex(clave) >= indice;
    }).length;

    const aquiAhora = enCurso.filter((f) => f.current_stage === etapa.key);
    const seCayeronAqui = cerrados.filter(
      (f) => (f.closed_stage ?? f.current_stage) === etapa.key
    ).length;

    return {
      key: etapa.key,
      titulo: etapa.short,
      alcanzaron,
      aqui_ahora: aquiAhora.length,
      se_cayeron_aqui: seCayeronAqui,
      tasa_caida: alcanzaron === 0 ? 0 : Math.round((seCayeronAqui / alcanzaron) * 1000) / 10,
      dias_medios: media(
        aquiAhora.map((f) => dias(f.stage_updated_at ?? f.created_at, ahora))
      ),
    };
  });

  // --- Motivos ---
  const cuenta = new Map<string, number>();
  for (const f of cerrados) {
    const m = f.close_reason ?? 'otro';
    cuenta.set(m, (cuenta.get(m) ?? 0) + 1);
  }
  const motivos = [...cuenta.entries()]
    .map(([motivo, total]) => ({
      motivo,
      etiqueta: MOTIVOS_DE_CIERRE[motivo] ?? motivo,
      total,
      porcentaje: cerrados.length === 0 ? 0 : Math.round((total / cerrados.length) * 1000) / 10,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    total: filas.length,
    en_curso: enCurso.length,
    incorporados: incorporados.length,
    cerrados: cerrados.length,
    tasa_exito:
      terminados === 0 ? null : Math.round((incorporados.length / terminados) * 1000) / 10,
    reposiciones: filas.filter((f) => f.replaces_journey_id).length,
    dias_hasta_incorporacion: media(
      incorporados
        .filter((f) => f.inc_effective_start)
        .map((f) => dias(f.created_at, f.inc_effective_start as string))
    ),
    embudo,
    motivos,
  };
}
