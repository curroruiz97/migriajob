-- ============================================
-- MIGRIA SAAS — Seed de datos demo (solo dev)
-- Ejecutar AFTER 0001_initial_schema.sql
-- ============================================

-- NOTA: las filas de auth.users se crean al hacer signup desde la app.
-- Este seed solo crea companies + jobs de ejemplo asumiendo que el primer
-- profile creado tendrá role='admin'. Ajusta los UUID según tu caso.

-- Ejemplo de empresa (sustituye OWNER_PROFILE_ID por un id real de profiles)
-- insert into companies (owner_id, slug, name, description, website, industry, size, location, verified)
-- values (
--   'OWNER_PROFILE_ID', 'acme-corp', 'Acme Corp',
--   'Empresa de ejemplo para Migria SaaS.',
--   'https://acme.example', 'Software', '11-50', 'Madrid, España', true
-- );

-- Ejemplo de oferta publicada
-- insert into jobs (company_id, slug, title, description, job_type, work_mode, experience_level, location, salary_min, salary_max, status, published_at)
-- values (
--   (select id from companies where slug = 'acme-corp'),
--   'frontend-developer-madrid',
--   'Frontend Developer',
--   'Buscamos un Frontend Developer con experiencia en React y Next.js.',
--   'full_time', 'hybrid', 'mid', 'Madrid, España',
--   35000, 50000, 'published', now()
-- );
