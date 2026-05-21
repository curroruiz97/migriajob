-- 0006_company_contact_fields.sql
-- Campos que faltaban del perfil de empresa (cargo del contacto y provincia).
-- Aplicar en Supabase (SQL editor o `supabase db push`). Aditivo e idempotente.
-- (Ciudad se guarda en companies.location; provincia y cargo en columnas nuevas.)

alter table public.companies
  add column if not exists contact_role     text,   -- cargo de la persona de contacto
  add column if not exists address_province text;   -- provincia (selector ES)
