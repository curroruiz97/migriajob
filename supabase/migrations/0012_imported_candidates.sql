-- 0012_imported_candidates.sql
-- Permite candidatos "importados" por el reclutador SIN cuenta auth (lead/CV).
-- Generado al importar el Excel de postulantes.

alter table public.candidates alter column profile_id drop not null;

alter table public.candidates
  add column if not exists is_imported        boolean not null default false,
  add column if not exists full_name          text,
  add column if not exists email              text,
  add column if not exists phone              text,
  add column if not exists document_type      text,
  add column if not exists document_number    text,
  add column if not exists recruitment_source text;

create index if not exists candidates_is_imported_idx on public.candidates(is_imported) where is_imported = true;
create index if not exists candidates_email_lower_idx on public.candidates(lower(email)) where email is not null;

-- El admin puede gestionar (leer/editar) todos los candidatos, incl. importados.
drop policy if exists "Admin manages all candidates" on public.candidates;
create policy "Admin manages all candidates" on public.candidates
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');
