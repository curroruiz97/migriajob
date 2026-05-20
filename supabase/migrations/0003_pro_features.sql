-- ============================================
-- MIGRIA SAAS — Funcionalidades pro (InfoJobs / JobToday benchmark)
-- Ejecutar después de 0001 y 0002.
-- ============================================

-- ============ Skills con nivel ============
create type skill_level as enum ('basic', 'medium', 'advanced', 'expert');

create table candidate_skills (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  skill text not null,
  level skill_level not null default 'medium',
  years int,
  created_at timestamptz not null default now(),
  unique(candidate_id, skill)
);
create index on candidate_skills(candidate_id);
create index on candidate_skills(skill);
alter table candidate_skills enable row level security;
create policy "Public read public candidate skills" on candidate_skills for select using (
  exists(select 1 from candidates c where c.id = candidate_skills.candidate_id and (c.is_public or c.profile_id = auth.uid()))
);
create policy "Owner writes own skills" on candidate_skills for all using (
  exists(select 1 from candidates c where c.id = candidate_skills.candidate_id and c.profile_id = auth.uid())
);

-- ============ Idiomas con MCER ============
create type language_level as enum ('A1','A2','B1','B2','C1','C2','native');

create table candidate_languages (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  code text not null,           -- 'es', 'en', 'fr', etc.
  level language_level not null,
  unique(candidate_id, code)
);
create index on candidate_languages(candidate_id);
alter table candidate_languages enable row level security;
create policy "Public read public candidate languages" on candidate_languages for select using (
  exists(select 1 from candidates c where c.id = candidate_languages.candidate_id and (c.is_public or c.profile_id = auth.uid()))
);
create policy "Owner writes own languages" on candidate_languages for all using (
  exists(select 1 from candidates c where c.id = candidate_languages.candidate_id and c.profile_id = auth.uid())
);

-- ============ Modalidad y radio de desplazamiento ============
create type work_modality as enum ('on_site', 'remote', 'hybrid');

alter table candidates
  add column modality work_modality default 'hybrid',
  add column commute_radius_km int default 25,
  add column intro_video_url text;

-- ============ Saved searches con alertas ============
create type alert_frequency as enum ('off', 'daily', 'weekly', 'instant');

create table saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  filters jsonb not null,
  alert_frequency alert_frequency not null default 'off',
  last_alert_at timestamptz,
  created_at timestamptz not null default now()
);
create index on saved_searches(user_id);
alter table saved_searches enable row level security;
create policy "Owner only saved searches" on saved_searches for all using (user_id = auth.uid());

-- ============ Notifications center ============
create type notification_type as enum (
  'message_received',
  'application_received',
  'application_status_changed',
  'process_stage_changed',
  'saved_search_match',
  'system'
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on notifications(user_id, read_at);
create index on notifications(user_id, created_at desc);
alter table notifications enable row level security;
create policy "Owner only notifications" on notifications for all using (user_id = auth.uid());

create table notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  channel text not null,        -- 'email' | 'in_app'
  enabled boolean not null default true,
  unique(user_id, type, channel)
);
alter table notification_preferences enable row level security;
create policy "Owner only notif prefs" on notification_preferences for all using (user_id = auth.uid());

-- ============ Message templates (mensajería) ============
create table message_templates (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index on message_templates(employer_id);
alter table message_templates enable row level security;
create policy "Owner only templates" on message_templates for all using (employer_id = auth.uid());

-- ============ Pipeline stages configurables ============
create table pipeline_stages (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text default 'zinc',
  position int not null default 0,
  is_terminal boolean default false,
  created_at timestamptz not null default now(),
  unique(employer_id, name)
);
create index on pipeline_stages(employer_id, position);
alter table pipeline_stages enable row level security;
create policy "Owner only pipeline stages" on pipeline_stages for all using (employer_id = auth.uid());

-- ============ Ratings & reviews ============
create table candidate_ratings (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  score int not null check (score between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique(employer_id, candidate_id)
);
create index on candidate_ratings(employer_id);
alter table candidate_ratings enable row level security;
create policy "Owner only ratings" on candidate_ratings for all using (employer_id = auth.uid());

create table company_reviews (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references profiles(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  score int not null check (score between 1 and 5),
  body text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  unique(candidate_id, company_id)
);
create index on company_reviews(company_id) where is_public = true;
alter table company_reviews enable row level security;
create policy "Anyone reads public reviews" on company_reviews for select using (is_public = true or candidate_id = auth.uid());
create policy "Authors write reviews" on company_reviews for all using (candidate_id = auth.uid());

-- ============ Job stats (estadísticas por oferta) ============
create table job_views (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  viewer_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on job_views(job_id, created_at);
alter table job_views enable row level security;
create policy "Anyone inserts job view" on job_views for insert with check (true);
create policy "Job owner reads views" on job_views for select using (
  exists(select 1 from jobs j join companies c on c.id = j.company_id where j.id = job_views.job_id and c.owner_id = auth.uid())
);

-- ============ Funciones ============

-- Match score: calcula 0-100 entre candidato y oferta
-- 50% skills overlap, 25% modalidad+ubicación, 15% salario, 10% idiomas
create or replace function compute_match_score(p_candidate_id uuid, p_job_id uuid)
returns int as $$
declare
  cand candidates;
  job jobs;
  skill_score numeric := 0;
  loc_score numeric := 0;
  salary_score numeric := 0;
  lang_score numeric := 0;
  candidate_skills_arr text[];
  job_skills_arr text[];
  overlap int;
begin
  select * into cand from candidates where id = p_candidate_id;
  select * into job from jobs where id = p_job_id;
  if cand.id is null or job.id is null then return 0; end if;

  -- Skills (50%)
  select array_agg(skill) into candidate_skills_arr from candidate_skills where candidate_id = p_candidate_id;
  job_skills_arr := coalesce(job.skills, '{}');
  if array_length(job_skills_arr, 1) > 0 then
    select count(*) into overlap from unnest(candidate_skills_arr) s where s = any(job_skills_arr);
    skill_score := least(50, (overlap::numeric / array_length(job_skills_arr, 1)::numeric) * 50);
  end if;

  -- Location/modality (25%)
  if job.work_mode::text = 'remote' or cand.modality::text = 'remote' then
    loc_score := 25;
  elsif cand.location_city is not null and job.location is not null and lower(job.location) like '%' || lower(cand.location_city) || '%' then
    loc_score := 25;
  elsif cand.modality::text = 'hybrid' then
    loc_score := 12;
  end if;

  -- Salary (15%)
  if job.salary_min is not null and cand.desired_salary_min is not null then
    if cand.desired_salary_min <= coalesce(job.salary_max, job.salary_min * 1.2) then
      salary_score := 15;
    elsif cand.desired_salary_min <= job.salary_min * 1.1 then
      salary_score := 8;
    end if;
  end if;

  -- Languages (10%)
  if exists(select 1 from candidate_languages where candidate_id = p_candidate_id) then
    lang_score := 10;
  end if;

  return least(100, round(skill_score + loc_score + salary_score + lang_score));
end;
$$ language plpgsql stable;

-- Profile completeness (0-100)
create or replace function profile_completeness(p_candidate_id uuid)
returns int as $$
declare
  cand candidates;
  score int := 0;
  has_skills boolean;
  has_languages boolean;
  has_experience boolean;
begin
  select * into cand from candidates where id = p_candidate_id;
  if cand.id is null then return 0; end if;

  if cand.avatar_url is not null then score := score + 10; end if;
  if cand.headline is not null and length(cand.headline) > 5 then score := score + 10; end if;
  if cand.bio is not null and length(cand.bio) > 50 then score := score + 15; end if;
  if cand.years_experience is not null then score := score + 5; end if;
  if cand.desired_salary_min is not null then score := score + 5; end if;
  if cand.location_city is not null then score := score + 5; end if;
  if cand.cv_url is not null then score := score + 15; end if;

  select exists(select 1 from candidate_skills where candidate_id = p_candidate_id) into has_skills;
  if has_skills then score := score + 15; end if;

  select exists(select 1 from candidate_languages where candidate_id = p_candidate_id) into has_languages;
  if has_languages then score := score + 10; end if;

  has_experience := jsonb_array_length(coalesce(cand.experience, '[]'::jsonb)) > 0;
  if has_experience then score := score + 10; end if;

  return least(100, score);
end;
$$ language plpgsql stable;
