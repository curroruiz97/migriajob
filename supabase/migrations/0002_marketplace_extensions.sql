-- ============================================
-- MIGRIA SAAS — Extensiones para marketplace de talento
-- Ejecutar después de 0001_initial_schema.sql
-- ============================================

-- ============ Ampliar candidates con campos de perfil público ============
create type availability_status as enum ('open', 'passive', 'closed');

alter table candidates
  add column slug text unique,
  add column is_public boolean not null default false,
  add column avatar_url text,
  add column availability availability_status not null default 'closed',
  add column available_from date,
  add column linkedin_url text,
  add column github_url text,
  add column portfolio_url text,
  add column website_url text,
  add column languages jsonb default '[]'::jsonb,    -- [{code:"es", level:"native"}, ...]
  add column education jsonb default '[]'::jsonb,    -- [{school, degree, year_start, year_end}]
  add column experience jsonb default '[]'::jsonb,   -- [{company, role, start, end, description}]
  add column location_lat double precision,
  add column location_lng double precision,
  add column location_city text,
  add column location_country text,
  add column views_count int not null default 0,
  add column updated_at timestamptz not null default now();

create index on candidates(is_public, availability) where is_public = true;
create index on candidates(slug) where slug is not null;

create trigger candidates_updated before update on candidates
  for each row execute function set_updated_at();

-- Política RLS pública para perfiles is_public = true
create policy "Anyone reads public candidates" on candidates for select
  using (is_public = true or profile_id = auth.uid() or auth_role() = 'admin');
create policy "Owners write own candidate" on candidates for all
  using (profile_id = auth.uid());

-- ============ FAVORITES — empleador favorita candidato ============
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(employer_id, candidate_id)
);

create index on favorites(employer_id);
alter table favorites enable row level security;
create policy "Owner only favorites" on favorites for all
  using (employer_id = auth.uid());

-- ============ CANDIDATE NOTES — notas privadas del empleador ============
create table candidate_notes (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on candidate_notes(employer_id, candidate_id);
alter table candidate_notes enable row level security;
create policy "Owner only notes" on candidate_notes for all
  using (employer_id = auth.uid());
create trigger candidate_notes_updated before update on candidate_notes
  for each row execute function set_updated_at();

-- ============ CANDIDATE TAGS — etiquetas privadas ============
create table candidate_tags (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  label text not null,
  color text default 'zinc',  -- zinc, red, amber, green, blue, violet
  created_at timestamptz not null default now(),
  unique(employer_id, candidate_id, label)
);

create index on candidate_tags(employer_id);
alter table candidate_tags enable row level security;
create policy "Owner only tags" on candidate_tags for all
  using (employer_id = auth.uid());

-- ============ SELECTION PROCESSES — kanban del empleador ============
create type process_stage as enum ('new', 'contacted', 'interview', 'offer', 'hired', 'rejected');

create table selection_processes (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  job_id uuid references jobs(id) on delete set null,
  candidate_id uuid not null references candidates(id) on delete cascade,
  stage process_stage not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(employer_id, candidate_id, job_id)
);

create index on selection_processes(employer_id, stage);
create index on selection_processes(candidate_id);
alter table selection_processes enable row level security;
create policy "Employer manages own processes" on selection_processes for all
  using (employer_id = auth.uid());
create trigger selection_processes_updated before update on selection_processes
  for each row execute function set_updated_at();

-- ============ MESSAGES — mensajería empleador <-> candidato ============
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(employer_id, candidate_id)
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index on messages(conversation_id, created_at desc);
alter table conversations enable row level security;
alter table messages enable row level security;
create policy "Members read own conversations" on conversations for select
  using (employer_id = auth.uid() or candidate_id = auth.uid());
create policy "Members create own conversations" on conversations for insert
  with check (employer_id = auth.uid() or candidate_id = auth.uid());
create policy "Members read messages" on messages for select using (
  exists(select 1 from conversations c where c.id = messages.conversation_id
         and (c.employer_id = auth.uid() or c.candidate_id = auth.uid()))
);
create policy "Members write messages" on messages for insert with check (
  sender_id = auth.uid() and exists(
    select 1 from conversations c where c.id = messages.conversation_id
    and (c.employer_id = auth.uid() or c.candidate_id = auth.uid())
  )
);

-- ============ Trigger: actualizar last_message_at ============
create or replace function bump_conversation_last_message() returns trigger as $$
begin
  update conversations set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

create trigger messages_bump_conversation
  after insert on messages
  for each row execute function bump_conversation_last_message();

-- ============ FTS sobre candidates (para búsqueda avanzada) ============
alter table candidates
  add column search_vector tsvector
    generated always as (
      setweight(to_tsvector('spanish', coalesce(headline, '')), 'A') ||
      setweight(to_tsvector('spanish', coalesce(current_role, '')), 'A') ||
      setweight(to_tsvector('spanish', coalesce(bio, '')), 'B') ||
      setweight(to_tsvector('spanish', coalesce(array_to_string(skills, ' '), '')), 'B')
    ) stored;

create index on candidates using gin(search_vector);
