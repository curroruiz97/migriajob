# CHANGELOG — Revisión profunda Migria SaaS

Resultado de las 4 fases ejecutadas tras el MVP de 7 días.

## Resumen ejecutivo

| Fase | Métrica | Resultado |
|---|---|---|
| 1 — Auditoría | Bugs encontrados | 13 |
| 1 — Auditoría | Críticos / altos / medios / bajos | 3 / 4 / 3 / 3 |
| 2 — Design system | Tokens definidos | 30+ (light + dark) |
| 2 — Design system | Componentes migrados a tokens | 12 |
| 3 — Pro features | Tablas SQL nuevas | 12 |
| 3 — Pro features | Funciones SQL | 2 (match_score, completeness) |
| 3 — Pro features | Páginas/Server Actions nuevas | 5 |
| 4 — Pulido | Componentes UI nuevos | 4 (Sheet, Tooltip, mobile-nav, JSON-LD) |

---

## FASE 1 — Auditoría

- `fix(auth): comprobar rol en middleware` — bloquear cross-rol en `/admin` y `/dashboard` leyendo `profiles.role`.
- `fix(db): cliente Drizzle perezoso vía Proxy` — `next build` ya no rompe sin `DATABASE_URL`.
- `feat(actions): helper safeAction()` — server actions devuelven siempre `{ ok }|{ error }` y re-lanzan redirects de Next.
- `feat(error-boundaries): error.tsx + global-error.tsx + not-found.tsx` con marca.
- `fix(kanban): notes ?? null en map de procesos` — evita race condition en optimistic UI.
- `docs: AUDIT.md` con clasificación crítico/alto/medio/bajo.

## FASE 2 — Design system migriajob

- `feat(tokens): paleta extraída de migriajob.com` — terracota `#d96f46`, marrón cálido `#23120b`, naranja `#ff6900`, amarillo `#fcb900`, verde/info/error ajustados a contraste WCAG AA.
- `feat(theme): light + dark mode completos` con HSL variables.
- `feat(tailwind): theme.extend.colors` mapea cada token a clase utility.
- `style(button + badge): variantes accent/soft/success/warning/info/destructive/outline` con todos los estados.
- `style: migración de zinc-* a tokens` en `MarketingHeader/Footer`, `AdminSidebar`, `EmployeeSidebar`, `AdminTopbar`, `ProfileCard`, `ProcessKanban`, `Skeleton`, `EmptyState`, `Card`.
- `docs: DESIGN_SYSTEM.md`.

## FASE 3 — Funcionalidades pro

### Schema (migration 0003_pro_features.sql)
- `candidate_skills` con nivel basic/medium/advanced/expert + años.
- `candidate_languages` con MCER A1–C2 + native.
- `saved_searches` con alert_frequency off/daily/weekly/instant.
- `notifications` + `notification_preferences` (6 tipos).
- `message_templates`, `pipeline_stages`, `candidate_ratings`, `company_reviews`, `job_views`.
- Función SQL `compute_match_score()` ponderando skills/loc/salario/idiomas.
- Función SQL `profile_completeness()` con 10 ítems ponderados.

### UI / Server Actions
- `/admin/notificaciones` centro con badges por tipo y diferenciación leídas/no leídas.
- `/admin/busquedas-guardadas` con frecuencia de alerta.
- `CompletenessWidget` con checklist accionable de 10 ítems en `/dashboard/mi-perfil`.
- `AdminTopbar` con badge accent de no-leídas (contador `99+`).
- `AdminSidebar` extendido con Búsquedas guardadas y Notificaciones.
- Server actions: `saveSearchAction`, `deleteSavedSearchAction`, `markAllNotificationsReadAction`, `markNotificationReadAction` (todas vía `safeAction`).
- Queries nuevas para notifications, saved searches, completeness, match score, skills/idiomas detallados.

## FASE 4 — Pulido UI/UX, a11y, performance

- `feat(ui): Sheet` (drawer Radix Dialog) con variantes side y animaciones slide.
- `feat(ui): Tooltip` con TooltipProvider.
- `feat(admin): AdminMobileNav` — sidebar como drawer en pantallas < lg desde topbar.
- `feat(hooks): useDebounce(value, delay)` para buscadores.
- `feat(seo): generateMetadata + ProfileJsonLd` en `/perfiles/[slug]` con OG dinámico, Twitter Card y JSON-LD Person con sameAs.
- `feat(animations): keyframes fade-in / slide-up / shimmer` + plugin tailwindcss-animate.
- `a11y: aria-labels` en botones icon-only, focus-visible:ring-ring vía tokens, Sheet con SheetTitle semántico.

---

## Pendiente para futuras iteraciones

- Mensajería real-time con Supabase Realtime sobre `conversations`/`messages` y `message_templates` ya migradas.
- Cron `/api/cron/saved-search-alerts` que envía emails con Resend.
- Mapa real con Leaflet o Mapbox usando `location_lat/lng`.
- Stripe + checkout en `/admin/facturacion` con webhook.
- Onboarding empleador (modal al primer login si `companies` vacío).
- Subida de CV a bucket Storage `cvs` con RLS owner-only.
- Lighthouse audit contra deploy real.
- Generación de tipos Supabase reales (`bunx supabase gen types`).
