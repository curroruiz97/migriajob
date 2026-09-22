-- 0022_desenlace_de_expedientes.sql
--
-- Cómo termina un expediente, para poder medir en qué paso se sale la gente.
--
-- Hasta ahora un expediente solo tenía etapa actual. Con eso, uno abandonado y
-- uno simplemente lento se ven exactamente igual desde fuera, y no hay forma de
-- contar cuántos procesos acaban bien ni por qué fallan los que fallan.
--
-- El motivo es una lista cerrada a propósito: en texto libre cada uno escribe
-- lo suyo ("se echó atrás", "no quiso", "se rajó") y luego no hay nada que
-- agregar. El matiz va en close_note.
--
-- closed_stage congela la etapa en la que se cortó el proceso. Sin ella, si
-- alguien toca current_stage después de cerrar, el embudo se falsea.
--
-- Los expedientes que ya existen quedan en 'en_curso' y no se tocan: los datos
-- siguen siendo de esas personas.
-- Aplicada en producción el 22-sep-2026.

do $$ begin
  create type public.journey_outcome as enum ('en_curso', 'incorporado', 'cerrado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.journey_close_reason as enum (
    'renuncia_candidato',
    'denegacion_extranjeria',
    'denegacion_visado',
    'empresa_retira',
    'documentacion_incompleta',
    'no_supera_medico',
    'perdida_contacto',
    'no_incorporacion',
    'baja_temprana',
    'otro'
  );
exception when duplicate_object then null; end $$;

alter table public.candidate_journey
  add column if not exists outcome             public.journey_outcome not null default 'en_curso',
  add column if not exists close_reason        public.journey_close_reason,
  add column if not exists close_note          text,
  add column if not exists closed_at           timestamptz,
  -- Etapa en la que se cortó, congelada al cerrar.
  add column if not exists closed_stage        text,
  -- Reposición: este expediente sustituye a otro que no llegó a buen puerto.
  add column if not exists replaces_journey_id uuid references public.candidate_journey(id) on delete set null;

create index if not exists candidate_journey_outcome_idx      on public.candidate_journey (outcome);
create index if not exists candidate_journey_closed_stage_idx on public.candidate_journey (closed_stage);
create index if not exists candidate_journey_replaces_idx     on public.candidate_journey (replaces_journey_id);
