-- 0007_job_offer_fields.sql
-- Campos adicionales del formulario de publicación de ofertas de empresa:
--   category   -> categoría del puesto (Cocinero, Camarero, Jefe de sala, …)
--   country    -> país de la oferta (España / Perú)
--   start_date -> fecha de incorporación (opcional)
-- Aditivo e idempotente. Aplicar en Supabase (SQL editor o `supabase db push`).
-- (Ciudad + país se componen también en jobs.location para el listado de candidatos.)

alter table public.jobs
  add column if not exists category   text,   -- categoría del puesto
  add column if not exists country    text,   -- país (España / Perú)
  add column if not exists start_date date;   -- fecha de incorporación
