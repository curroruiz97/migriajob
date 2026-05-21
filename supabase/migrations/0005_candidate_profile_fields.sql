-- 0005_candidate_profile_fields.sql
-- Campos estructurados del perfil de candidato (PASO 3 de la refactorización v2).
-- Aplicar en Supabase (SQL editor o `supabase db push`). Todo ADITIVO e idempotente.
--
-- Reutilización de columnas que YA existen (no se tocan):
--   nationality  -> usar candidates.country_of_origin
--   idiomas con nivel  -> candidates.languages (jsonb)  ej: [{"language":"Inglés","level":"avanzado"}]
--   experiencias       -> candidates.experience (jsonb) ej: [{"position":"...","company":"...","start_date":"...","end_date":"...","description":"..."}]

alter table public.candidates
  add column if not exists date_of_birth        date,
  add column if not exists preferred_locations  text[] default '{}',
  add column if not exists willing_to_relocate  boolean default false,
  -- Disponibilidad de incorporación (distinta de `availability`, que es visibilidad en el marketplace):
  add column if not exists start_availability   text;   -- inmediata | 15_dias | 1_mes | 2_meses

-- Tras aplicar esta migración, avísame y cableo en el formulario del candidato:
--   - Fecha de nacimiento (date picker) y Nacionalidad (selector → country_of_origin)
--   - Idiomas con nivel (lista dinámica idioma + básico/intermedio/avanzado/nativo → languages jsonb)
--   - Experiencias profesionales (lista dinámica → experience jsonb)
--   - Ubicaciones preferidas (multi-select → preferred_locations)
--   - Disponibilidad para trasladarse (toggle → willing_to_relocate)
--   - Disponibilidad de incorporación (selector → start_availability)
-- ...además del flujo de modal semi-obligatorio de completitud.
