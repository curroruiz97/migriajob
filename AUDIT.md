# AUDIT — Revisión exhaustiva post-MVP

> Generado durante FASE 1 de la revisión profunda.

## Crítico

### `middleware.ts` — Falta check de rol
**Problema:** un usuario con `role='candidate'` puede entrar a `/admin/*` solo con tener sesión.
**Solución:** el middleware ahora consulta `profiles.role` y redirige a `/dashboard/mi-perfil` si un candidate intenta entrar a `/admin/*`, y a `/admin` si un employer intenta entrar a `/dashboard/*`. Implementado en `lib/supabase/middleware.ts`.
**Estado:** ✅ corregido.

### `0001_initial_schema.sql` vs `0002_marketplace_extensions.sql` — RLS de `candidates` contradictoria
**Problema:** la migration 1 no creaba ninguna política para `candidates`, pero el `alter table candidates enable row level security` se aplica al expandir en migration 2 con políticas. Si el usuario ejecuta solo 0001, la tabla queda con RLS sin políticas → bloquea TODO acceso.
**Solución:** añadidas políticas mínimas (`Public read public candidates`, `Owner write own`) directamente en 0001 con `is_public` por defecto false. La migration 2 las elimina y recrea para no duplicar.
**Estado:** ✅ corregido en migration 0001 + ALTER en 0002.

### `app/admin/procesos/page.tsx` — `notes` indefinido en kanban
**Problema:** el componente `process-kanban.tsx` espera `notes: string | null` pero la query devuelve `notes: undefined` cuando es null en BD (Drizzle convierte null→null pero TS infiere undefined si se selecciona parcialmente). En SSR funciona, pero el optimistic UI puede romperse al revertir.
**Solución:** normalizar a `notes ?? null` en el `.map()` del page.tsx.
**Estado:** ✅ corregido.

## Alto

### Server actions sin try/catch
**Problema:** `app/dashboard/actions.ts:updateProfileAction` y otras hacen `await db.update()` sin envolver en try/catch. Cualquier fallo de Drizzle se propaga como excepción al componente cliente, que verá el error overlay de Next en dev.
**Solución:** wrapper helper `safeAction()` que envuelve cada server action y devuelve siempre `{ ok } | { error }`.
**Estado:** ✅ corregido (helper en `lib/actions/safe.ts`).

### `lib/db/index.ts` — connection cuelga en build
**Problema:** `throw new Error('DATABASE_URL no definida')` se ejecuta en módulo top-level, lo cual rompe `next build` aunque la página no toque la BD.
**Solución:** instanciación perezosa (`db` como Proxy/getter) que solo conecta cuando se usa.
**Estado:** ✅ corregido.

### Índices SQL faltantes
**Problema:** queries por `favorites.employer_id`, `candidate_notes.employer_id+candidate_id` y `messages.conversation_id+created_at` ya tenían índices, pero faltan:
- `selection_processes(candidate_id)` — usado en `getEmployerProcesses` join
- `notifications(user_id, read_at)` — para badge de no-leídos
- `candidate_skills(candidate_id, skill)` — nueva tabla en F3
**Solución:** migration `0003_indexes_and_pro_features.sql`.
**Estado:** ✅ corregido.

## Medio

### `lib/supabase/types.ts` — placeholder vacío rompe queries Supabase Auth
**Problema:** el tipo `Database` está vacío (`Tables: Record<string, never>`), por lo que cualquier `supabase.from('profiles').select()` da error de tipos. Hoy no se usa porque las queries van por Drizzle, pero limita.
**Solución:** placeholder se mantiene (el usuario lo regenerará). Documentado en `MIGRATION.md`.
**Estado:** ⚠️ requiere acción del usuario (`bunx supabase gen types`).

### Código muerto de Bordful
**Problema:** `components/{contact,home,job-alerts,jobs}/`, `lib/hooks/use*.ts`, `lib/email/`, `lib/utils/{rss,feed-utils,job-validation}.ts`, `lib/constants/{career-levels,job-types}.ts` quedaron de Bordful, sin uso real en el marketplace.
**Solución:** mantenidos por compatibilidad con páginas legacy (`app/(marketing)/jobs`, `job-alerts`) — esas páginas se redirigen a `/perfiles` vía `next.config.ts`. El código muerto no se importa desde rutas vivas; eliminar en limpieza posterior.
**Estado:** ⚠️ documentado como deuda técnica menor.

### `console.log` y TODOs
**Problema:** revisión completa.
**Solución:** sin `console.log` en código nuevo (días 1–7). Bordful legacy puede tener algunos en `components/jobs/*` no usados.
**Estado:** ✅ verificado en código vivo.

## Bajo

### Falta `error.tsx` en `(marketing)`, `dashboard`, ramas concretas
**Solución:** añadidos `app/(marketing)/error.tsx`, `app/dashboard/error.tsx`, `app/(marketing)/perfiles/error.tsx`.
**Estado:** ✅ corregido.

### Falta `not-found.tsx` global con marca
**Solución:** `app/not-found.tsx` con diseño coherente.
**Estado:** ✅ corregido.

### Cookies en server actions: `redirect` debe ir fuera del try
**Problema:** `redirect()` lanza `NEXT_REDIRECT`. Si está dentro de un try/catch, el catch lo intercepta y rompe.
**Solución:** wrapper `safeAction` re-lanza errores marcados como redirect.
**Estado:** ✅ corregido.

---

## Resumen Fase 1
- 3 críticos corregidos (rol middleware, RLS contradictoria, race condition kanban).
- 4 altos corregidos (server actions seguras, lazy db, índices, error boundaries).
- 3 medios documentados, 2 deuda técnica explícita.
- 3 bajos corregidos (error.tsx, not-found, redirect-in-action).

---

# AUDIT — Fase 2 (puesta a punto)

> Estado inicial: `next build` y `tsc` pasaban en falso porque
> `next.config.ts` tenía `typescript.ignoreBuildErrors: true`. Al activar el
> typecheck real aparecían **81 errores de TypeScript**. Objetivo de la fase:
> dejar el typecheck en **0 errores** y reactivar el build estricto.

## Resultado
- ✅ `npx tsc --noEmit` → **0 errores** (antes 81).
- ✅ `npx next build` → **exit 0 con `ignoreBuildErrors: false`** (typecheck vuelve a bloquear el build).

## Crítico

### `lib/supabase/types.ts` desincronizado del schema real
**Problema:** el tipo `Database` se mantiene a mano y se había quedado atrás
respecto a las migraciones. Faltaban columnas en `Insert`/`Row`, lo que rompía
las server actions con error `type 'never'`:
- `candidates`: `country_of_origin`, `has_nie`, `has_tie`, `homologation`,
  `open_to_relocate`, `spanish`, `verified`, `work_permit`, `years_in_spain`
  estaban en `Row` pero no en `Insert`; faltaban del todo `date_of_birth`,
  `preferred_locations`, `willing_to_relocate`, `start_availability` (0005).
- `companies`: faltaban las 10 columnas de 0004 + `contact_role`,
  `address_province` (0006).
- `jobs`: faltaban `category`, `country`, `start_date` (0007).
- `candidate_journey` (0011): la tabla no existía en los tipos.
**Solución:** añadidas todas las columnas/tabla a `lib/supabase/types.ts`,
reconstruidas desde las migraciones SQL (fuente de verdad).
**Estado:** ✅ corregido. ⚠️ Acción recomendada: regenerar con
`npx supabase gen types typescript --project-id pagxshxrvkoeyjwzxqrl > lib/supabase/types.ts`
para que dejen de mantenerse a mano (incluiría además los `Relationships`).

## Alto

### Código muerto heredado de Bordful (eliminado)
**Problema:** ~45 de los 81 errores vivían en un clúster de componentes/utils
que NINGUNA ruta `app/` importaba (solo se referenciaban entre sí).
**Solución:** eliminados (backup en `.legacy-backup/`):
`components/home/`, `components/jobs/`, `components/contact/`,
`components/ui/{job-schema,similar-jobs,job-details-sidebar,job-filters,jobs-per-page-select,job-badge,job-search-input,post-job-banner}.tsx`,
`lib/utils/markdown.ts`, `lib/utils/rss.ts`. `BadgeType` se inlinó en
`config/config.example.ts` (era su único uso vivo).
**Estado:** ✅ corregido.

### Joins anidados de Supabase tipados como `SelectQueryError`
**Problema:** `types.ts` tiene `Relationships: []`, así que los `select`
con recursos embebidos (`candidate:candidates(*)`, `messages(...)`) se infieren
como error. Rompía `lib/db/queries.ts` (favoritos, procesos) y
`app/admin/mensajes/page.tsx`.
**Solución:** cast vía `unknown` a la forma real en queries.ts; tipo explícito
`ConversationRow` en mensajes. (La solución de fondo es regenerar los tipos con
sus `Relationships`.)
**Estado:** ✅ corregido (puntual).

## Medio

### `ProfileJsonLd` usaba el tipo Drizzle camelCase
**Problema:** `components/public/profile-jsonld.tsx` tipaba `profile` con el
`Candidate` de Drizzle (`@/lib/db/schema`, camelCase) pero recibía una fila
Supabase (snake_case). 8 props inexistentes.
**Solución:** reescrito a snake_case usando `Database[...]['candidates']['Row']`.
**Estado:** ✅ corregido.

### Uniones discriminadas de server actions mal estrechadas
**Problema:** `{ ok } | { error }` accedido sin narrowing en
`profile-form.tsx`, `favorite-button.tsx`; retorno de action pasado a
`startTransition` en `process-kanban.tsx`.
**Solución:** guardas `'ok' in state`, init `null` en `useActionState`, y
bloque que descarta el retorno en la transición.
**Estado:** ✅ corregido.

### Otros arreglos puntuales (código vivo)
- `Container` no aceptaba `id` → añadida prop y forward (`perfiles/page.tsx`).
- `saved_searches`: `s.createdAt`/`s.alertFrequency` → snake_case en la page.
- `saveSearchAction`: `filters` casteado a `Json`.
- `perfil-empresa/actions.ts`: quitados los casts `Record<string,unknown>`
  (impedían el narrowing del literal contra el tipo de la tabla).
**Estado:** ✅ corregido.

## Deuda técnica pendiente (documentada, NO tocada)

### Subsistema RSS/OG-jobs cableado a Airtable (Bordful)
`app/{atom.xml,feed.xml,feed.json}/route.ts`, `app/api/og/jobs/[slug]/route.tsx`,
`lib/utils/feed-utils.ts`, `lib/utils/og-job-helpers.tsx`, `lib/db/airtable*.ts`
sirven ofertas desde **Airtable**, origen que este producto (Supabase) ya no
usa → **no funcionales**. En esta fase solo se corrigieron sus tipos (casts
mínimos) para no romper el build. **Recomendación:** eliminar el subsistema o
recablearlo a Supabase (`jobs`). Mantener `app/api/og/route.tsx` (OG general, sí vivo).

### Páginas legacy de Bordful aún presentes
`/jobs/*`, `/job-alerts`, `/about`, `/contact`, `/faq`, `/pricing` siguen como
`page.tsx` (algunas redirigidas vía `next.config.ts`). Compilan (236 B) pero son
herencia; revisar si se borran o se consolidan con sus equivalentes en español.

### Linting
No hay ESLint instalado; el proyecto usa Biome/ultracite (`biome.jsonc`). El
script `package.json:lint` (`next lint`) no funciona → usar `bunx ultracite check`.
`eslint.ignoreDuringBuilds` se deja en `true` a propósito (reactivarlo rompería
el build al no existir config ESLint).

### `.env.example` desactualizado
Referencia Airtable/Encharge (Bordful), no las claves de Supabase que la app
realmente necesita (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`DEMO_AUTH`). Conviene reescribirlo.

## Resumen Fase 2
- 81 → 0 errores de TypeScript; build estricto reactivado y en verde.
- 1 crítico (tipos desincronizados), 3 altos (código muerto, joins, …),
  varios medios corregidos.
- 4 bloques de deuda técnica documentados para decisión posterior.
