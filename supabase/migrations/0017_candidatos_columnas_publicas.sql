-- ============================================================
-- Migración 0017: cerrar la fuga de datos personales de candidatos
-- ============================================================
-- QUÉ PASABA
-- La política "Anyone reads public candidates" autoriza por FILA: si un perfil
-- tiene is_public = true, cualquiera puede leerlo. Pero una fila son TODAS sus
-- columnas, y en `candidates` viven el email, el teléfono, el tipo y número de
-- documento (DNI/NIE/pasaporte), la fecha de nacimiento y el enlace al CV.
--
-- Las páginas públicas no pintaban esos campos, pero pedían `select('*')`, así
-- que el servidor los enviaba igual: viajaban en la respuesta y los podía leer
-- cualquiera con la clave pública, que va dentro del JavaScript de la web. En
-- producción eran 1.226 perfiles públicos, 1.220 con teléfono, 463 con email y
-- 731 con número de documento.
--
-- QUÉ HACE ESTO
-- En Postgres un permiso de SELECT sobre la tabla cubre todas las columnas y no
-- se puede recortar quitando columnas sueltas. Hay que retirar el permiso de
-- tabla y volver a darlo columna a columna. Eso es lo que viene abajo, y solo
-- para `anon` (la clave pública): `authenticated` no se toca, así que las
-- empresas con sesión iniciada siguen viendo el email y el teléfono del
-- candidato en su ficha y en los expedientes, igual que hasta ahora.
--
-- A partir de aquí, una consulta anónima con `select('*')` sobre candidates es
-- rechazada por la base de datos en vez de devolver datos de más.
--
-- Nota: "current_role" va entrecomillado porque es palabra reservada de
-- Postgres; sin comillas el GRANT no compila.

revoke select on public.candidates from anon;

grant select (
  id, profile_id, slug, is_public, verified, is_imported,
  full_name, headline, "current_role", bio, avatar_url, intro_video_url,
  skills, languages, education, experience, years_experience,
  availability, available_from, start_availability,
  desired_salary_min, desired_salary_max,
  modality, open_to_remote, open_to_relocate, willing_to_relocate,
  preferred_locations, commute_radius_km,
  location_city, location_country, location_lat, location_lng,
  country_of_origin, years_in_spain, work_permit, has_nie, has_tie,
  homologation, spanish,
  linkedin_url, github_url, portfolio_url, website_url,
  views_count, created_at, updated_at, recruitment_source
) on public.candidates to anon;
