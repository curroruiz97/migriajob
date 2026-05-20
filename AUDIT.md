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
