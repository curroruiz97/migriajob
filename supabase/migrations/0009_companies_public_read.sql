-- Permite lectura pública de la información básica de las empresas.
--
-- Antes solo se podían leer empresas con `verified = true`, o ser su owner,
-- o ser admin. Esto rompía la UI:
--   - En /dashboard/mensajes (candidato), las conversaciones no podían
--     mostrar el nombre de la empresa con la que el candidato estaba
--     hablando (siempre salía "Empresa" como fallback).
--   - Igualmente en /dashboard/ofertas y en cualquier embed `company:companies(name)`.
--
-- Solución: dejar SELECT abierto (las empresas son entidades públicas en
-- un marketplace). El UPDATE/INSERT/DELETE sigue protegido por las
-- políticas existentes ("Owners write own company", "Admin writes any company").

drop policy if exists "Anyone reads verified companies" on public.companies;

create policy "Anyone reads companies"
  on public.companies
  for select
  using (true);
