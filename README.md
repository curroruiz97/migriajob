# Migria SaaS

Marketplace de talento. Las empresas descubren, filtran y contratan perfiles cualificados.
Los profesionales publican su perfil y controlan su disponibilidad.

Construido fusionando dos templates open-source — **Bordful** (UI pública) y
**next-shadcn-dashboard-starter** (UI admin) — sobre un único stack moderno.

## Stack

- **Next.js 15** (App Router, Server Actions, Turbopack)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 3** + shadcn/ui (Radix primitives)
- **Supabase** — Postgres + Auth + Storage + RLS
- **Drizzle ORM** — queries type-safe en Server Components
- **Zod** + **react-hook-form** — validación end-to-end
- **nuqs** — estado de filtros en la URL (compartible)
- **dnd-kit** — kanban del pipeline de selección

## Estructura

```
migria-saas/
├── app/
│   ├── (auth)/             ← /login, /registro, /logout
│   ├── (marketing)/        ← / (home), /perfiles, /planes-y-precios, /como-funciona
│   │                          + páginas legacy heredadas de Bordful
│   ├── admin/              ← Panel empleador (Dashboard, Candidatos, Procesos…)
│   ├── dashboard/          ← Panel candidato (Mi Perfil, Aplicaciones…)
│   └── api/                ← OG, RSS legacy
├── components/
│   ├── ui/                 ← shadcn primitives (Button, Card, Input, Tabs…)
│   ├── public/             ← Header, Footer, ProfileCard, ProfileFilters
│   ├── admin/              ← AdminSidebar, AdminTopbar, ProcessKanban
│   └── employee/           ← EmployeeSidebar
├── lib/
│   ├── supabase/           ← clients (browser, server, middleware)
│   ├── db/                 ← schema y queries Drizzle
│   └── validations/        ← schemas Zod
├── supabase/migrations/    ← SQL versionado (fuente de verdad)
└── middleware.ts           ← guard de /admin y /dashboard + refresh de sesión
```

## Setup

```bash
# 1. Instalar dependencias
bun install

# 2. Crear proyecto Supabase (región eu-west-1)
#    Authentication → Providers → habilitar Email + Google + LinkedIn

# 3. Pegar el SQL en SQL Editor (en orden)
#    - supabase/migrations/0001_initial_schema.sql
#    - supabase/migrations/0002_marketplace_extensions.sql

# 4. Generar tipos TypeScript reales del schema
bunx supabase gen types typescript --project-id TU_ID > lib/supabase/types.ts

# 5. Variables de entorno
cp .env.local.example .env.local
# Edita con las claves de tu proyecto Supabase

# 6. Arrancar
bun dev
```

## Rutas principales

### Público
- `/` — home con hero + perfiles destacados
- `/perfiles` — listado con filtros (q, ciudad, disponibilidad, experiencia, salario), grid/lista
- `/perfiles/[slug]` — ficha pública del candidato
- `/planes-y-precios` — Starter / Pro / Enterprise
- `/como-funciona` — tour del producto

### Empleador (auth requerida)
- `/admin` — dashboard con KPIs y pipeline preview
- `/admin/candidatos` — explorar candidatos
- `/admin/busqueda-avanzada` — presets y filtros combinados
- `/admin/procesos` — kanban del pipeline (drag & drop)
- `/admin/favoritos` — perfiles guardados
- `/admin/comparador` — comparador de hasta 4 candidatos
- `/admin/mensajes` — conversaciones
- `/admin/facturacion` — plan y facturas

### Candidato (auth requerida)
- `/dashboard/mi-perfil` — editar perfil profesional
- `/dashboard/mis-aplicaciones` — estado de postulaciones
- `/dashboard/disponibilidad` — open / passive / closed + visibilidad pública
- `/dashboard/configuracion` — cuenta, contraseña, RGPD

## Scripts

| Comando | Descripción |
|---|---|
| `bun dev` | Servidor de desarrollo (Turbopack) |
| `bun build` | Build de producción |
| `bun lint` | Lint con ultracite/biome |
| `bun db:generate` | Generar migration Drizzle |
| `bun db:push` | Aplicar schema Drizzle directo (solo dev) |
| `bun db:studio` | Drizzle Studio |

## Deploy

1. Push del repo a GitHub.
2. Importar en Vercel.
3. Variables de entorno: las del `.env.local`.
4. Deploy.

Cron diario para `job_alerts` (cuando se implementen) en `vercel.json`:
```json
{ "crons": [{ "path": "/api/cron/alerts", "schedule": "0 8 * * *" }] }
```

## Estado actual y siguientes pasos

Ver [MIGRATION.md](./MIGRATION.md) para el detalle de los 7 días ejecutados y la lista
de funcionalidad pendiente para futuras iteraciones (mapa real, chat real-time, Stripe,
onboarding empleador, subida de CV, email transaccional).
