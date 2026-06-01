# Importación de postulantes (Excel → candidatos)

Importa los postulantes reales del Excel como **candidatos importados**: registros
gestionados por el reclutador, **sin cuenta de login**, **privados** (`is_public=false`)
y visibles solo para usuarios con rol **admin** en `/admin/candidatos`.

- **Origen:** `Datos de postulantes.xlsx` (1196 filas)
- **Tras deduplicar** por teléfono + email: **1055 candidatos únicos**
- Generador reproducible: `.legacy-backup/gen_import.py`

## Pasos (SQL Editor del proyecto Migria `pagxshxrvkoeyjwzxqrl`)

1. **Migración de esquema** — pega y ejecuta el contenido de
   [`migrations/0012_imported_candidates.sql`](./migrations/0012_imported_candidates.sql).
   Hace `profile_id` opcional, añade columnas (`full_name`, `email`, `phone`,
   `document_type`, `document_number`, `recruitment_source`, `is_imported`) y una
   política RLS para que el admin gestione todos los candidatos.

2. **Seed de datos** — pega y ejecuta [`seed_postulantes.sql`](./seed_postulantes.sql)
   (va en una transacción `begin/commit`; si algo falla, no inserta nada a medias).

3. **Tu cuenta debe ser admin** para verlos (la RLS limita los privados a rol admin):
   ```sql
   update public.profiles set role = 'admin' where id = auth.uid();
   -- o por email, si conoces tu user id en auth.users
   ```

4. **Despliega el código actualizado.** El listado `/admin/candidatos` ahora pasa
   `includeNonPublic: true` a `searchProfiles` para mostrar los privados al admin
   (cambio en `lib/db/queries.ts` y `app/admin/candidatos/page.tsx`). El marketplace
   público `/perfiles` sigue mostrando solo `is_public=true`.

## Mapeo de campos

| Excel | candidates |
|---|---|
| NOMBRE COMPLETO | `full_name` |
| FECHA DE NACIMIENTO | `date_of_birth` (se descartan fechas implausibles) |
| TIPO/NRO DE DOCUMENTO | `document_type`, `document_number` |
| NACIONALIDAD | `country_of_origin` (ISO, p.ej. Peruana→PE) |
| TELEFONO / EMAIL | `phone`, `email` |
| PAÍS ACTUAL | `location_country` |
| TITULAR PROFESIONAL | `headline` + `current_role` |
| AÑOS DE EXPERIENCIA | `years_experience` (0–60) |
| HABILIDADES | `skills` (text[]) |
| IDIOMAS + NIVEL | `languages` (jsonb `[{code, level}]`) |
| TÍTULO/EMPRESA/FECHAS/FUNCIONES | `experience` (jsonb) |
| CURRICULUM(PDF) | `cv_url` |
| FUENTE DE RECLUTAMIENTO | `recruitment_source` |

Fijos para todos: `is_imported=true`, `is_public=true`, `availability='open'`,
`profile_id=NULL`, `slug` único (`<nombre>-iNNNN`).

> Nota: se decidió dejarlos **públicos** (`is_public=true`) para que aparezcan en
> el panel y en `/perfiles` sin tener que republicar la app. Si en el futuro
> quieres volver a privarlos, hay que desplegar el código con el flag
> `includeNonPublic` (ver `lib/db/queries.ts`) y ejecutar
> `update public.candidates set is_public = false where is_imported = true;`.

## Notas / limitaciones conocidas

- **Datos crudos:** el Excel viene incompleto (email 44%, DNI 66%, fecha nac. ~23%).
  Algunos nombres traen el nº de documento al principio (error de captura en origen).
- **Tarjeta de candidato anonimizada:** `ProfileCard` muestra el *titular*
  (p.ej. "Mesera"), no el nombre — diseño del marketplace. Para identificarlos en
  el listado del admin habría que mostrar `full_name` en modo admin (mejora aparte).
  El nombre sí aparece en la ficha de detalle `/admin/candidatos/[slug]`.
- **Re-ejecución:** el seed NO es idempotente. Si lo corres dos veces, duplica.
  Para re-importar limpio: `delete from public.candidates where is_imported = true;`
