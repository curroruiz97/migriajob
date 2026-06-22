-- ============================================================
-- Migración 0014: Módulo de control interno de Migria
-- ============================================================
-- Tablas para gestión administrativa interna: pagos, comprobantes
-- y observaciones por expediente. Solo accesible para admins.

-- 1) Estado de pagos por expediente
create type payment_status as enum ('pendiente', 'parcial', 'completado', 'reembolsado');
create type payment_concept as enum (
  'tasa_extranjeria',
  'honorarios_migria',
  'tasa_consular',
  'seguro_medico',
  'vuelo',
  'alojamiento',
  'otros'
);

create table if not exists expediente_payments (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid not null references candidate_journey(id) on delete cascade,
  concept payment_concept not null default 'otros',
  description text,
  amount numeric(10,2) not null,
  currency text not null default 'EUR',
  status payment_status not null default 'pendiente',
  due_date date,
  paid_at timestamptz,
  payment_method text,          -- transferencia, efectivo, tarjeta, etc.
  reference_number text,        -- N.o de referencia bancaria
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expediente_payments_journey_idx
  on expediente_payments(journey_id);

alter table expediente_payments enable row level security;

drop policy if exists "Admin manages payments" on expediente_payments;
create policy "Admin manages payments" on expediente_payments
  for all using (auth_role() = 'admin');

-- Candidato puede ver sus propios pagos (lectura)
drop policy if exists "Candidate reads own payments" on expediente_payments;
create policy "Candidate reads own payments" on expediente_payments
  for select
  using (
    exists (
      select 1 from candidate_journey cj
      join candidates c on c.id = cj.candidate_id
      where cj.id = expediente_payments.journey_id
        and c.profile_id = auth.uid()
    )
  );

-- 2) Comprobantes / boletas (archivos adjuntos)
create table if not exists expediente_receipts (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid not null references candidate_journey(id) on delete cascade,
  payment_id uuid references expediente_payments(id) on delete set null,
  file_name text not null,
  file_url text not null,         -- URL de Supabase Storage
  file_type text,                 -- MIME type
  file_size integer,              -- bytes
  description text,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists expediente_receipts_journey_idx
  on expediente_receipts(journey_id);

alter table expediente_receipts enable row level security;

drop policy if exists "Admin manages receipts" on expediente_receipts;
create policy "Admin manages receipts" on expediente_receipts
  for all using (auth_role() = 'admin');

drop policy if exists "Candidate reads own receipts" on expediente_receipts;
create policy "Candidate reads own receipts" on expediente_receipts
  for select
  using (
    exists (
      select 1 from candidate_journey cj
      join candidates c on c.id = cj.candidate_id
      where cj.id = expediente_receipts.journey_id
        and c.profile_id = auth.uid()
    )
  );

-- 3) Observaciones internas (solo visible para equipo Migria)
create type observation_category as enum (
  'administrativo',
  'comercial',
  'legal',
  'operativo',
  'incidencia',
  'general'
);

create table if not exists expediente_observations (
  id uuid primary key default uuid_generate_v4(),
  journey_id uuid not null references candidate_journey(id) on delete cascade,
  category observation_category not null default 'general',
  body text not null,
  is_pinned boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expediente_observations_journey_idx
  on expediente_observations(journey_id);

alter table expediente_observations enable row level security;

-- Solo admin: las observaciones son privadas del equipo
drop policy if exists "Admin manages observations" on expediente_observations;
create policy "Admin manages observations" on expediente_observations
  for all using (auth_role() = 'admin');

-- Triggers updated_at
create or replace function tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end$$;

create trigger tg_expediente_payments_updated_at
before update on expediente_payments
for each row execute function tg_set_updated_at();

create trigger tg_expediente_observations_updated_at
before update on expediente_observations
for each row execute function tg_set_updated_at();
