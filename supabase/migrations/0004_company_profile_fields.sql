-- 0004_company_profile_fields.sql
-- Campos extra del perfil de empresa solicitados en la auditoría (Fase 2 empresa).
-- Aplicar en Supabase (SQL editor o `supabase db push`). Todo es ADITIVO e idempotente.
--
-- NOTA: el formulario actual de /admin/perfil-empresa usa las columnas que YA existían
-- (name, industry, size, location, website, description, logo_url). Tras aplicar esta
-- migración, se pueden añadir al formulario los campos nuevos (CIF, año, contacto,
-- facturación) sin riesgo.

alter table public.companies
  add column if not exists legal_name      text,        -- razón social (si difiere del nombre comercial)
  add column if not exists tax_id           text,        -- CIF / NIF
  add column if not exists founded_year     integer,     -- año de fundación
  add column if not exists contact_name     text,        -- persona de contacto principal
  add column if not exists contact_email    text,        -- email corporativo
  add column if not exists contact_phone    text,        -- teléfono
  add column if not exists cover_image_url  text,        -- imagen de cabecera del perfil
  add column if not exists billing_email    text,        -- email de facturación
  add column if not exists billing_address  text,        -- dirección de facturación
  add column if not exists billing_tax_id   text;        -- CIF a efectos de factura (si difiere)

-- ────────────────────────────────────────────────────────────────────────────
-- Estado "entrevista" para candidaturas (opcional). El enum application_status
-- actual es: submitted | reviewing | shortlisted | rejected | hired.
-- Ejecuta esta línea SOLA (ADD VALUE no puede ir dentro de un bloque/transacción
-- con otras sentencias). Tras aplicarla, añade 'interview' a las opciones del
-- selector de estado del candidato en components/admin/applicant-status-select.tsx.
-- ────────────────────────────────────────────────────────────────────────────
-- alter type public.application_status add value if not exists 'interview';

-- ────────────────────────────────────────────────────────────────────────────
-- RLS (revisar antes de aplicar): permite al dueño de la empresa gestionar SUS
-- ofertas y ver/actualizar las candidaturas de sus ofertas. Descomenta si tu
-- proyecto usa RLS y aún no tienes estas políticas.
-- ────────────────────────────────────────────────────────────────────────────
-- alter table public.jobs enable row level security;
-- drop policy if exists "jobs_owner_all" on public.jobs;
-- create policy "jobs_owner_all" on public.jobs
--   for all
--   using (company_id in (select id from public.companies where owner_id = auth.uid()))
--   with check (company_id in (select id from public.companies where owner_id = auth.uid()));
--
-- drop policy if exists "applications_employer_read" on public.applications;
-- create policy "applications_employer_read" on public.applications
--   for select
--   using (job_id in (
--     select j.id from public.jobs j
--     join public.companies c on c.id = j.company_id
--     where c.owner_id = auth.uid()
--   ));
--
-- drop policy if exists "applications_employer_update" on public.applications;
-- create policy "applications_employer_update" on public.applications
--   for update
--   using (job_id in (
--     select j.id from public.jobs j
--     join public.companies c on c.id = j.company_id
--     where c.owner_id = auth.uid()
--   ));
