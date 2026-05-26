-- Tabla del "Mi proceso" del candidato: lleva todos los pasos del recorrido
-- desde la contratación hasta la incorporación efectiva en España (5 bloques
-- del PDF interno de Migria).
--
-- Una fila por candidato (UNIQUE candidate_id). Las casillas son booleanos
-- que rellena el equipo de Migria a medida que avanza el proceso; el
-- candidato puede consultarlo en su área (solo lectura).

create table if not exists candidate_journey (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null unique references candidates(id) on delete cascade,

  -- Bloque 1 — Información base
  start_date date,                    -- Fecha Inicio Gestión
  position text,                      -- Puesto (denominación contractual)
  employer_company text,              -- Nombre del cliente/empleador
  salary integer,
  destination_city text,

  -- Bloque 2 — Documentación personal
  doc_dni boolean not null default false,
  doc_passport boolean not null default false,
  doc_criminal_record boolean not null default false,
  doc_medical boolean not null default false,

  -- Bloque 3 — Documentación contractual
  doc_precontract boolean not null default false,
  doc_contract boolean not null default false,
  doc_social_security boolean not null default false,

  -- Bloque 4 — Proceso migratorio
  mig_file_submitted boolean not null default false,   -- Expediente ingresado
  mig_resolution boolean not null default false,        -- Resolución extranjería
  mig_visa_started boolean not null default false,
  mig_visa_approved boolean not null default false,

  -- Bloque 5 — Incorporación
  inc_flight_confirmed boolean not null default false,
  inc_housing_coordinated boolean not null default false,
  inc_travel_date date,
  inc_arrival_date date,
  inc_effective_start date,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists candidate_journey_candidate_idx
  on candidate_journey(candidate_id);

alter table candidate_journey enable row level security;

-- El candidato solo puede leer su propio journey.
drop policy if exists "Candidate reads own journey" on candidate_journey;
create policy "Candidate reads own journey" on candidate_journey
  for select
  using (
    exists (
      select 1 from candidates
      where candidates.id = candidate_journey.candidate_id
        and candidates.profile_id = auth.uid()
    )
  );

-- Admin (equipo Migria) gestiona los procesos.
drop policy if exists "Admin manages journeys" on candidate_journey;
create policy "Admin manages journeys" on candidate_journey
  for all
  using (auth_role() = 'admin');

-- Trigger para mantener updated_at al día.
create or replace function tg_candidate_journey_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists tg_candidate_journey_updated_at on candidate_journey;
create trigger tg_candidate_journey_updated_at
before update on candidate_journey
for each row execute function tg_candidate_journey_updated_at();
