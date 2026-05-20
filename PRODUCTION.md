# Migria SaaS — Guía de despliegue a producción

Estado actual del proyecto, qué queda por hacer y cómo desplegar a Vercel.

## ✅ Lo que ya está hecho

### Backend (Supabase MigriaJob — `pagxshxrvkoeyjwzxqrl`)
- 4 migrations aplicadas: schema base + marketplace + pro features + fix trigger/Storage.
- 23 tablas con RLS.
- Storage buckets `cvs` (privado) y `avatars` (público) con políticas owner-only.
- Funciones SQL `compute_match_score()` y `profile_completeness()`.
- Trigger `handle_new_user()` que copia full_name + avatar + role del metadata al crear cuenta.

### Auth real
- Server actions: signIn, signUp, signOut, requestPasswordReset, updatePassword.
- Páginas: /login, /registro (tabs candidate/employer), /recuperar, /recuperar/nueva-contrasena, /logout.
- Endpoint /auth/callback para OAuth (Google, LinkedIn) y magic link.
- Mensajes de error traducidos al español.
- Middleware con check de rol leyendo `profiles.role`.

### Sin DATABASE_URL
- Toda la app funciona vía Supabase JS client + REST + RLS.
- No requiere password de la BD para correr.
- Drizzle se conserva como herramienta opcional para futuras migrations CLI.

### Storage UI
- /dashboard/mi-perfil tiene upload de avatar (PNG/JPG/WebP, max 2MB) y CV (PDF, max 5MB).
- Avatar va a bucket público; CV va a bucket privado con signed URL de 30 días.

### Onboarding empleador
- /admin/onboarding — wizard que crea `companies` + asegura `role='employer'` + siembra 6 stages por defecto.
- El admin layout redirige aquí si el usuario no tiene company aún.

### Legal y RGPD
- /privacy reescrita en español, con detalle de tratamiento, terceros, derechos.
- /terms reescrita.
- /cookies política.
- Banner de cookies con persistencia en localStorage.
- Endpoint GET /api/me/export — descarga JSON con todos tus datos (RGPD art. 20).
- Endpoint DELETE /api/me/delete — elimina cuenta vía Auth Admin API (RGPD art. 17). Requiere SUPABASE_SERVICE_ROLE_KEY.
- Botones funcionales en /dashboard/configuracion.

### Crons (Vercel)
- /api/cron/expire-jobs — diario a las 5:00 UTC. Pone status='expired' a ofertas pasadas.
- /api/cron/saved-search-alerts — diario a las 8:00 UTC. Crea notificaciones in-app cuando hay nuevos perfiles que cumplen una saved_search.
- vercel.json configurado con ambos.

### SEO
- sitemap.xml dinámico con perfiles públicos.
- robots.txt: disallow /admin/*, /dashboard/*, /api/*.
- generateMetadata + ProfileJsonLd en /perfiles/[slug] con OG/Twitter Card y Schema.org Person.

## 🚧 Pendiente para producción

### Configurar antes de deploy
1. **Activar providers** en [Auth → Providers](https://supabase.com/dashboard/project/pagxshxrvkoeyjwzxqrl/auth/providers): Email, Google, LinkedIn OIDC.
2. **Añadir Redirect URL** `https://TU_DOMINIO/auth/callback` en Auth → URL Configuration.
3. **Personalizar email templates** (Auth → Email Templates) en español con la marca Migria.

### Variables de entorno en Vercel
```
NEXT_PUBLIC_SUPABASE_URL=https://pagxshxrvkoeyjwzxqrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (la del .env.local)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (Settings → API → service_role)
NEXT_PUBLIC_APP_URL=https://TU_DOMINIO
CRON_SECRET=<genera uno con `openssl rand -hex 32`>
RESEND_API_KEY=re_...    # opcional, para emails
EMAIL_FROM="Migria <hola@TU_DOMINIO>"
```

### Funcionalidad para iteraciones siguientes
- **Mensajería realtime** — UI de chat en `/admin/mensajes/[id]` con Supabase Realtime sobre `messages`.
- **Plantillas mensajería** — UI CRUD en `/admin/configuracion/plantillas`. Tabla `message_templates` ya existe.
- **Email transaccional** — integrar Resend en signup, password reset, candidatura recibida, cambio de estado, resumen semanal saved searches.
- **Stripe** — checkout en `/admin/facturacion` cuando se monetice.
- **Sentry** — `npm i @sentry/nextjs`, run `npx @sentry/wizard@latest -i nextjs`, configurar DSN.
- **Mapa real** — sustituir el toggle "Mapa" del toolbar de /perfiles por Leaflet/Mapbox usando location_lat/lng.
- **Borrar definitivamente** archivos legacy de Bordful (`components/{contact,home,job-alerts,jobs}/`, `lib/email/*`, `lib/utils/{rss,feed-utils,job-validation,markdown,...}.ts`) — el sandbox no permite, pero en producción Vercel los descartará si no se importan.
- **Quitar `ignoreBuildErrors: true`** de next.config.ts y arreglar errores TS legacy uno a uno.

## 🚀 Cómo desplegar

```bash
# 1. Repo Git
git init
git add .
git commit -m "feat: migria saas v1"

# 2. Push a GitHub
gh repo create migria-saas --private --source=. --push

# 3. Vercel
# Importa el repo en https://vercel.com/new
# Configura las env vars de la sección de arriba.
# Deploy → automático.

# 4. Dominio (opcional)
# Vercel → Project → Settings → Domains → añadir tu dominio.

# 5. Verificar crons
# Vercel → Project → Crons → ver ejecuciones diarias.
```

## ✅ Checklist pre-lanzamiento

- [ ] `npm run build` pasa sin errores en local.
- [ ] Login con email funciona end-to-end.
- [ ] Recuperar contraseña envía email real.
- [ ] Signup como employer redirige al onboarding y crea company.
- [ ] Subir CV y avatar funciona desde /dashboard/mi-perfil.
- [ ] Marcar perfil como público lo hace aparecer en /perfiles.
- [ ] Banner de cookies aparece en primera visita.
- [ ] Export-data devuelve un JSON con tus datos.
- [ ] Delete-account (con SERVICE_ROLE_KEY configurada) elimina la cuenta.
- [ ] sitemap.xml lista los perfiles públicos.
- [ ] /admin/* redirige a /login si no hay sesión.
- [ ] /admin/* redirige a /dashboard/mi-perfil si el rol es candidate.
- [ ] Lighthouse Performance ≥ 85 en mobile.
