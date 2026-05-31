# Prompt de handoff para Combinator (web → app)

Copia y pega el bloque de abajo en Combinator (o cualquier app-builder con IA).

---

Eres un ingeniero senior full-stack + mobile. Tu misión es **convertir un SaaS web existente en una aplicación móvil de producto (formato app), nativa-first**, conservando el backend y la lógica de negocio. No estás partiendo de cero: estás portando y mejorando un producto real y probado.

## 1. Qué es el producto

**Migria / MigriaJob** — un marketplace de talento.
- Las **empresas / empleadores** descubren, filtran, comparan y contratan perfiles cualificados.
- Los **profesionales / candidatos** publican su perfil y controlan su disponibilidad.
- Dos superficies en un mismo producto: un **marketplace público** (SEO, listados, fichas) y **paneles autenticados** (empleador y candidato).
- Idioma de producto: **español** (UI, copy y rutas en español; identificadores de código en inglés).

## 2. Stack actual (origen)

- **Next.js 15** (App Router, Server Actions, Turbopack) + **React 19** + **TypeScript 5 strict** (sin `any`).
- **Tailwind CSS 3** + **shadcn/ui** (primitivos Radix).
- **Supabase**: Postgres + Auth + Storage + **RLS** (row-level security en cada tabla).
- **Drizzle ORM** para queries type-safe en Server Components.
- **Zod** + **react-hook-form** para validación end-to-end (cliente + servidor).
- **nuqs** para estado de filtros en la URL.
- **dnd-kit** para el kanban del pipeline de selección.
- Ya existe un envoltorio **Capacitor (Android)** que carga la web desplegada; el objetivo es ir más allá de un simple WebView.

## 3. Modelo de datos (Postgres / Supabase, fuente de verdad)

Tablas: `profiles`, `candidate_profiles`, `companies`, `job_offers`, `applications`,
`processes`, `process_stages`, `favorites`, `saved_searches`, `messages`.

Conceptos de dominio (mantén el vocabulario):
- **perfil / perfiles** = perfil(es) de candidato — entidad central.
- **empresa / empleador** = company / employer.
- **candidato** = candidate.
- **proceso** = pipeline / proceso de selección (con `process_stages` para el kanban).
- **disponibilidad** = availability: `open` / `passive` / `closed` + visibilidad pública.
- **aplicación** = job application.

Reglas de datos NO negociables:
- Todo acceso a datos pasa por **RLS**. Cada tabla nueva necesita sus políticas en la misma migración.
- **Valida toda mutación con su schema Zod** antes de tocar la base de datos.
- Columnas SQL en `snake_case`; mapeo Drizzle en `camelCase`.
- Nunca expongas la `service_role` key al cliente. Solo `NEXT_PUBLIC_*` es seguro en cliente.

## 4. Rutas / pantallas a portar a app

Público (marketplace): home con hero + perfiles destacados, `/perfiles` (listado con filtros: q, ciudad, disponibilidad, experiencia, salario; grid/lista), `/perfiles/[slug]` (ficha pública), planes-y-precios (Starter/Pro/Enterprise), cómo-funciona, y legales (aviso-legal, privacidad, cookies, términos, contacto).

Empleador (auth): dashboard con KPIs, candidatos, búsqueda-avanzada (presets + filtros combinados), procesos (**kanban drag & drop**), favoritos, comparador (hasta 4 candidatos), mensajes, facturación.

Candidato (auth): mi-perfil, mis-aplicaciones, disponibilidad, perfil-público, notificaciones, configuración (cuenta, contraseña, RGPD).

## 5. Objetivo: "formato app" (esto es lo nuevo)

Transforma estas superficies en una **experiencia de app móvil real**, no un WebView envuelto:

1. **Navegación nativa**: tab bar inferior por rol (Candidato vs Empleador), stack navigation, gestos atrás, transiciones nativas. Detecta el rol tras login y muestra el tab set correcto.
2. **Auth móvil**: login/registro con email + OAuth (Google, LinkedIn) usando deep links / redirect nativo; sesión persistente y refresh en background; biometría opcional (Face ID / huella) para reabrir.
3. **Offline-first donde tenga sentido**: cachear listados y la ficha propia, cola de mutaciones offline (p. ej. cambios de disponibilidad, mensajes) con reintento al recuperar red. Estados claros de "sin conexión".
4. **Push notifications**: nuevas aplicaciones, cambios de estado de un proceso, mensajes nuevos. Pide permiso en el momento adecuado, no al arrancar.
5. **Tiempo real**: mensajes y kanban con Supabase Realtime; el comparador y favoritos se sincronizan al instante entre dispositivos.
6. **Interacciones táctiles**: el kanban de procesos debe funcionar con drag & drop táctil fluido; filtros como bottom sheets; pull-to-refresh; skeletons de carga.
7. **Subida de archivos nativa**: foto de perfil y CV desde cámara / galería / archivos, con compresión y subida a Supabase Storage.
8. **Rendimiento**: arranque < 2s, listas virtualizadas, imágenes optimizadas, sin jank en scroll.
9. **Diseño adaptado a móvil**: safe areas, teclado que no tapa inputs, tipografía y targets táctiles ≥ 44px, modo claro/oscuro.

## 6. Sistema de diseño y marca (respétalo)

- Mantén la identidad **Migria/MigriaJob** (consulta `DESIGN_SYSTEM.md` y `MIGRIA_BRAND.md` del repo origen para colores, tipografías y tono).
- Reutiliza el lenguaje visual de shadcn/ui pero adapta los componentes a patrones móviles (sheets, action sheets, tab bars).
- Consistencia: mismos nombres de estado, mismos textos en español.

## 7. Reglas de arquitectura aprendidas (aplícalas)

- **Decide la superficie primero**: público (SEO, server-first, cacheable) vs autenticado (client-heavy, realtime). Las convenciones difieren.
- **Server Actions** colocadas en `actions.ts` por ruta, marcadas `"use server"`.
- Usa el cliente Supabase correcto según contexto (server / client / middleware).
- **Guard de auth** equivalente al `middleware.ts`: protege las zonas de empleador y candidato y refresca sesión.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`), commits atómicos.
- Lint y type-check deben pasar antes de cada entrega. TypeScript strict, sin `any`, `import type` cuando aplique.
- No hay suite de tests aún: añade tests colocados (`*.test.ts`) para la lógica pesada (filtros, matching, pricing) y QA manual de: filtros del listado, flujos de auth y drag & drop del kanban.

## 8. Decisión técnica que debes proponer y justificar

Elige y justifica UNA ruta para el "formato app", optimizando para reutilizar el backend Supabase y el modelo de datos existentes:

- **A) React Native / Expo** (app verdaderamente nativa, reescribiendo la UI; máximo rendimiento y acceso a APIs nativas).
- **B) Capacitor + UI móvil dedicada** (reutiliza más código web; más rápido de portar; ya hay base Capacitor en el repo).
- **C) Híbrido** (público en web/PWA + app nativa solo para los paneles autenticados).

Recomienda la opción, explica el trade-off y úsala.

## 9. Variables de entorno necesarias

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (solo servidor), `DATABASE_URL`. Para móvil, la URL pública del servicio. Nunca commitees secretos.

## 10. Entregables

1. Propuesta de arquitectura (la opción de la sección 8 con su justificación) y plan por fases.
2. App funcionando con: auth, navegación por rol, listado de perfiles con filtros, ficha de candidato, kanban de procesos táctil, mensajes en tiempo real, disponibilidad, comparador y favoritos.
3. Push notifications + offline básico + subida de archivos.
4. README de setup móvil (build, env, deploy a TestFlight/Play Internal).
5. Lista de lo que queda pendiente y siguientes pasos.

## 11. Cómo trabajar

Empieza por leer el código origen y el modelo de datos; reutiliza la lógica de negocio y los schemas Zod; no rompas RLS; entrega incrementos verificables; pregunta solo si hay ambigüedad real de producto. Prioriza una vertical completa (auth → listado → ficha → acción) antes de ensanchar.
