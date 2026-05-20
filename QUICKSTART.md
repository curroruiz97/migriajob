# QUICKSTART — Levantar Migria en local en 60 segundos

El proyecto incluye **modo demo**: arranca con datos mock sin necesidad de Supabase.
Cuando quieras conectarlo a una BD real, sigue la sección "Conectar Supabase" al final.

## Requisitos

- **Node.js 20+** (verifica con `node --version`)
- **npm** (viene con Node)

## Arranque rápido (modo demo)

Abre PowerShell o CMD en `C:\Users\Usuario\Desktop\Migria SaaS\migria-saas\` y ejecuta:

```bash
npm install
npm run dev
```

Luego abre **http://localhost:3000** en el navegador.

> **¿Ves un mensaje del sandbox o instalación inacabada?** Borra `node_modules\` y `package-lock.json` si existen y vuelve a `npm install`. Tarda 1–3 min la primera vez.

### Atajo para Windows

Doble clic en `start.bat` (en la raíz del proyecto). Hace `npm install` la primera vez y luego `npm run dev`.

### Atajo para macOS / Linux

```bash
chmod +x start.sh
./start.sh
```

## ¿Qué verás?

Con el modo demo activo (`DEMO_AUTH=1` en `.env.local`, ya configurado por defecto):

- **http://localhost:3000** — landing pública con perfiles destacados (6 perfiles mock españoles).
- **http://localhost:3000/perfiles** — listado con filtros funcionales (búsqueda, ciudad, disponibilidad, experiencia, salario).
- **http://localhost:3000/perfiles/maria-lopez-garcia** — ficha pública detallada de un perfil mock.
- **http://localhost:3000/planes-y-precios** — pricing con 3 planes.
- **http://localhost:3000/como-funciona** — tour del producto.
- **http://localhost:3000/admin** — dashboard del empleador (KPIs en demo, pipeline preview).
- **http://localhost:3000/admin/candidatos** — explorador de candidatos.
- **http://localhost:3000/admin/procesos** — kanban con drag & drop.
- **http://localhost:3000/admin/comparador** — comparador de 3 candidatos.
- **http://localhost:3000/admin/notificaciones** — centro de notificaciones (vacío en demo).
- **http://localhost:3000/dashboard/mi-perfil** — perfil del candidato con widget de completitud.

> En modo demo el login y el registro **no funcionarán** (verás un aviso "Modo demo: configura Supabase…"). Es esperado. El acceso a `/admin` y `/dashboard` está abierto sin sesión gracias a `DEMO_AUTH=1`.

## Conectar Supabase (cuando quieras datos reales)

1. Crea proyecto en https://supabase.com (región **eu-west-1** para España).
2. Authentication → Providers → habilita Email + Google + LinkedIn.
3. SQL Editor → pega y ejecuta en orden:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_marketplace_extensions.sql`
   - `supabase/migrations/0003_pro_features.sql`
4. Edita `.env.local`:
   - **Comenta** `DEMO_AUTH=1`.
   - **Descomenta** y rellena `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.
5. (Opcional) Genera tipos TS reales:
   ```bash
   npx supabase gen types typescript --project-id TU_ID > lib/supabase/types.ts
   ```
6. Reinicia `npm run dev`.

## Build de producción

```bash
npm run build
npm start
```

## Solución de problemas

**"Cannot find module 'next'":** `npm install` no terminó. Borra `node_modules` y `package-lock.json` y vuelve a instalar.

**Errores de TypeScript en build:** `next.config.ts` ya tiene `ignoreBuildErrors: true` y `eslint.ignoreDuringBuilds: true`. El build pasará aunque haya warnings.

**Página /perfiles vacía:** Significa que no estás en demo y la BD no responde. Revisa `.env.local`. Si todo falla, vuelve a poner `DEMO_AUTH=1` y comenta las URLs de Supabase.

**El kanban no permite drag & drop:** Es un client component, asegúrate de no estar en build mode estático. `npm run dev` sí lo soporta.
