-- ============================================
-- MIGRIA SAAS — JOB BOARD SCHEMA COMPLETO
-- Pega este SQL en el SQL Editor de Supabase
-- ============================================

-- Extensiones necesarias
create extension if not exists "uuid-ossp";
create extension if not exists "vector";   -- para matching IA futuro
create extension if not exists "pg_trgm";  -- para búsqueda fuzzy

-- ============================================
-- ENUMS
-- ============================================
create type user_role as enum ('candidate', 'employer', 'admin');
create type job_status as enum ('draft', 'published', 'paused', 'expired', 'archived');
create type job_type as enum ('full_time', 'part_time', 'contract', 'internship', 'freelance');
create type work_mode as enum ('on_site', 'hybrid', 'remote');
create type experience_level as enum ('entry', 'junior', 'mid', 'senior', 'lead');
create type application_status as enum ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired');

-- ============================================
-- PROFILES (extiende auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'candidate',
  full_name text,
  avatar_url text,
  phone text,
  location text,           -- "Valladolid, España"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- COMPANIES (empleadores)
-- ============================================
create table companies (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  website text,
  logo_url text,
  industry text,
  size text,               -- "11-50", "51-200", etc.
  location text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index on companies(owner_id);
create index on companies using gin(name gin_trgm_ops);

-- ============================================
-- CANDIDATES (perfiles ampliados)
-- ============================================
create table candidates (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid unique not null references profiles(id) on delete cascade,
  headline text,           -- "Senior Frontend Developer"
  bio text,
  cv_url text,             -- Supabase Storage
  years_experience int,
  current_role text,
  skills text[],
  desired_salary_min int,
  desired_salary_max int,
  open_to_remote boolean default true,
  embedding vector(1536),  -- para matching IA futuro
  created_at timestamptz not null default now()
);

create index on candidates using gin(skills);
create index on candidates using ivfflat(embedding vector_cosine_ops);

-- ============================================
-- JOBS (ofertas)
-- ============================================
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text not null,
  requirements text,
  benefits text,
  job_type job_type not null,
  work_mode work_mode not null,
  experience_level experience_level,
  location text,
  salary_min int,
  salary_max int,
  currency text default 'EUR',
  skills text[],
  status job_status not null default 'draft',
  featured boolean default false,
  published_at timestamptz,
  expires_at timestamptz,
  views_count int default 0,
  applications_count int default 0,
  embedding vector(1536),
  search_vector tsvector
    generated always as (
      setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
    ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on jobs(company_id);
create index on jobs(status, published_at desc);
create index on jobs using gin(search_vector);
create index on jobs using gin(skills);
create index on jobs using ivfflat(embedding vector_cosine_ops);

-- ============================================
-- APPLICATIONS (postulaciones)
-- ============================================
create table applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  cover_letter text,
  cv_url text,             -- snapshot del CV en el momento
  status application_status not null default 'submitted',
  match_score float,       -- 0-1, calculado por IA opcional
  notes text,              -- nota interna del empleador
  created_at timestamptz not null default now(),
  unique(job_id, candidate_id)
);

create index on applications(job_id);
create index on applications(candidate_id);
create index on applications(status);

-- ============================================
-- SAVED JOBS (favoritos)
-- ============================================
create table saved_jobs (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(candidate_id, job_id)
);

-- ============================================
-- JOB ALERTS
-- ============================================
create table job_alerts (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  query text,
  filters jsonb,           -- { location, work_mode, salary_min, etc. }
  frequency text default 'daily',
  active boolean default true,
  last_sent_at timestamptz
);

-- ============================================
-- TRIGGERS de updated_at
-- ============================================
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger jobs_updated before update on jobs
  for each row execute function set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table profiles enable row level security;
alter table companies enable row level security;
alter table candidates enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table saved_jobs enable row level security;
alter table job_alerts enable row level security;

-- Helper: leer rol del usuario actual
create or replace function auth_role() returns user_role as $$
  select role from profiles where id = auth.uid()
$$ language sql stable security definer;

-- ----- PROFILES -----
create policy "Public read profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update
  using (auth.uid() = id);

-- ----- COMPANIES -----
create policy "Anyone reads verified companies" on companies for select
  using (verified = true or auth.uid() = owner_id or auth_role() = 'admin');
create policy "Owners write own company" on companies for all
  using (auth.uid() = owner_id);
create policy "Admin writes any company" on companies for all
  using (auth_role() = 'admin');

-- ----- JOBS -----
create policy "Anyone reads published jobs" on jobs for select
  using (status = 'published' or
         exists(select 1 from companies where id = jobs.company_id and owner_id = auth.uid()) or
         auth_role() = 'admin');
create policy "Employers manage own jobs" on jobs for all using (
  exists(select 1 from companies where id = jobs.company_id and owner_id = auth.uid())
);
create policy "Admin manages any job" on jobs for all using (auth_role() = 'admin');

-- ----- APPLICATIONS -----
create policy "Candidates see own applications" on applications for select using (
  exists(select 1 from candidates where id = applications.candidate_id and profile_id = auth.uid())
);
create policy "Employers see applications to their jobs" on applications for select using (
  exists(
    select 1 from jobs j
    join companies c on c.id = j.company_id
    where j.id = applications.job_id and c.owner_id = auth.uid()
  )
);
create policy "Candidates create applications" on applications for insert with check (
  exists(select 1 from candidates where id = applications.candidate_id and profile_id = auth.uid())
);
create policy "Employers update application status" on applications for update using (
  exists(
    select 1 from jobs j
    join companies c on c.id = j.company_id
    where j.id = applications.job_id and c.owner_id = auth.uid()
  )
);

-- ----- SAVED_JOBS y JOB_ALERTS: solo el dueño -----
create policy "Owner only saved_jobs" on saved_jobs for all using (
  exists(select 1 from candidates where id = saved_jobs.candidate_id and profile_id = auth.uid())
);
create policy "Owner only alerts" on job_alerts for all using (
  exists(select 1 from candidates where id = job_alerts.candidate_id and profile_id = auth.uid())
);

-- ============================================
-- TRIGGER: crear profile automáticamente al registrarse
-- ============================================
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
