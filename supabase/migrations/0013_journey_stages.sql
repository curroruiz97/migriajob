-- ============================================================
-- Migración 0013: Sistema de 11 etapas para el proceso migratorio
-- ============================================================
-- Reemplaza el modelo de booleanos por bloques por un sistema de
-- etapas secuenciales (1-11) con historial de transiciones y
-- notificaciones automáticas al candidato.

-- 1) Enum con las 11 etapas
create type journey_stage as enum (
  'seleccionado',
  'inicio_proceso',
  'expediente_presentado',
  'revision_administrativa',
  'evaluacion_expediente',
  'coordinacion_incorporacion',
  'esperando_resolucion',
  'resolucion_favorable',
  'gestion_consular',
  'preparando_viaje',
  'bienvenido'
);

-- 2) Nuevas columnas en candidate_journey
alter table candidate_journey
  add column if not exists current_stage journey_stage not null default 'seleccionado',
  add column if not exists stage_updated_at timestamptz not null default now(),
  add column if not exists stage_message text;

-- 3) Tabla de historial de etapas — registra cada transición
create table if not exists journey_stage_history (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid not null references candidate_journey(id) on delete cascade,
  stage journey_stage not null,
  notes text,
  changed_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists journey_stage_history_journey_idx
  on journey_stage_history(journey_id, created_at);

alter table journey_stage_history enable row level security;

-- El candidato puede ver el historial de su propio journey
drop policy if exists "Candidate reads own stage history" on journey_stage_history;
create policy "Candidate reads own stage history" on journey_stage_history
  for select
  using (
    exists (
      select 1 from candidate_journey cj
      join candidates c on c.id = cj.candidate_id
      where cj.id = journey_stage_history.journey_id
        and c.profile_id = auth.uid()
    )
  );

-- Admin gestiona todo
drop policy if exists "Admin manages stage history" on journey_stage_history;
create policy "Admin manages stage history" on journey_stage_history
  for all
  using (auth_role() = 'admin');

-- 4) Trigger: cuando cambia current_stage en candidate_journey,
--    insertar en historial + crear notificación al candidato.
create or replace function tg_journey_stage_changed()
returns trigger language plpgsql security definer as $$
declare
  v_profile_id uuid;
  v_stage_label text;
begin
  -- Solo actuar si la etapa realmente cambió
  if old.current_stage is distinct from new.current_stage then
    -- Registrar en historial
    insert into journey_stage_history (journey_id, stage, changed_by)
    values (new.id, new.current_stage, auth.uid());

    -- Actualizar timestamp de la etapa
    new.stage_updated_at := now();

    -- Buscar el profile_id del candidato para la notificación
    select c.profile_id into v_profile_id
    from candidates c
    where c.id = new.candidate_id;

    -- Solo notificar si el candidato tiene cuenta (no importados sin auth)
    if v_profile_id is not null then
      -- Mapa legible de la etapa
      v_stage_label := case new.current_stage
        when 'seleccionado' then '¡Felicitaciones! Has sido seleccionado'
        when 'inicio_proceso' then 'Inicio del proceso migratorio'
        when 'expediente_presentado' then 'Expediente presentado'
        when 'revision_administrativa' then 'Revisión administrativa'
        when 'evaluacion_expediente' then 'Evaluación del expediente'
        when 'coordinacion_incorporacion' then 'Coordinación de incorporación'
        when 'esperando_resolucion' then 'Esperando resolución oficial'
        when 'resolucion_favorable' then 'Resolución favorable'
        when 'gestion_consular' then 'Gestión consular'
        when 'preparando_viaje' then 'Preparando tu viaje'
        when 'bienvenido' then '¡Bienvenido a España!'
        else new.current_stage::text
      end;

      insert into notifications (user_id, type, payload)
      values (
        v_profile_id,
        'process_stage_changed',
        jsonb_build_object(
          'message', v_stage_label,
          'stage', new.current_stage::text,
          'journey_id', new.id
        )
      );
    end if;
  end if;

  return new;
end$$;

drop trigger if exists tg_journey_stage_changed on candidate_journey;
create trigger tg_journey_stage_changed
before update on candidate_journey
for each row execute function tg_journey_stage_changed();

-- 5) Habilitar Realtime en candidate_journey para updates en vivo
alter publication supabase_realtime add table candidate_journey;
