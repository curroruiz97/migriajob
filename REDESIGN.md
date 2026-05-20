# REDESIGN — Migria como escaparate de talento latino

Resultado de las 10 fases de rediseño profundo. Todo aplicado al proyecto.

## Cambios estratégicos

- **Nuevo posicionamiento:** "Talento latino, listo para trabajar en España."
- **Audiencia clara:** profesionales latinos (con o sin documentación) ↔ empresarios españoles.
- **Diferenciador:** filtros que importan al empresario español (NIE, permiso, homologación, MCER).

## Migration nueva

`0005_latam_specific_fields` aplicada en Supabase (project pagxshxrvkoeyjwzxqrl):
- `country_of_origin` (ISO-3166)
- `years_in_spain` (numeric)
- `work_permit` enum (eu_citizen / permanent / temporary / in_application / needs_sponsorship / not_specified)
- `has_nie`, `has_tie` (boolean)
- `homologation` enum (verified / in_progress / not_required / not_started / not_specified)
- `spanish` enum (native / C2-A1)
- `open_to_relocate` (boolean)
- `verified` (boolean) — perfil verificado por Migria
- 6 perfiles latinos sembrados completos (María/Carlos/Lucía/Pablo/Diana/Andrés)

## Sistema de marca

- **`MIGRIA_BRAND.md`** con tono de voz, paleta extendida, paleta de banderas país, tipografía, sombras, componentes clave, microcopy patterns.
- **`globals.css` extendido** con utilities `.bg-hero-gradient`, `.bg-dot-pattern`, `.bg-glass`, `.card-hover`, `.text-gradient-primary`, `.shimmer`, `.scrollbar-thin`.
- **Tipografía display** Instrument Serif (Google Fonts) vía `next/font/google`. Clase `.font-display`.
- **Modo oscuro** con `next-themes` + ThemeProvider + ThemeToggle visible en header.

## Componentes nuevos

- `<CountryFlag code="AR" />` — bandera emoji + nombre país opcional.
- `<VerifiedBadge />` — checkmark azul tipo Twitter, con o sin label.
- `<WorkPermitBadge>`, `<HomologationBadge>`, `<NieBadge>` — píldoras con icono y tono.
- `<SkillBar level="advanced" />` — barra horizontal con gradient + nivel + años.
- `<LanguageChip code="es" level="C2" />` — bandera + nombre + nivel MCER.
- `<AnimatedCounter value={1247} />` — cuenta de 0 al valor cuando entra en viewport.
- `<ThemeToggle />` — sun/moon icon, persiste preferencia.
- `<IllustratedEmpty kind="search" />` — empty state con ilustración SVG inline (6 variantes: search, inbox, favorites, pipeline, celebrate, plant).
- `<HeroFloatingCards />` — 4 tarjetas decorativas animadas en el hero.

## Páginas rediseñadas

### Home `/`
- Hero gradient + dot pattern + tarjetas flotantes + tipografía display Instrument Serif.
- Counter animado (1.247 perfiles · 87 empresas · 156 contratos · 23 países).
- Features 4 columnas (Documentación verificada / Talento cualificado / Listos / Mismo idioma).
- Sección talento destacado con ProfileCard mejoradas.
- Cómo funciona — 3 pasos numerados grandes.
- Testimonios con foto + bandera empresa + 5 estrellas.
- FAQ embebido (5 preguntas) con accordion.
- Final CTA dual gradient: "Soy empresa" / "Soy profesional".
- 10 banderas país visibles bajo el buscador.

### `/perfiles`
- Filtros nuevos: País origen (11 banderas LATAM clicables), En España, NIE vigente, Solo verificados, Permiso de trabajo (radio).
- Chips de filtros activos arriba del listado, con contador.
- ProfileCard con bandera país superpuesta al avatar + verified badge + work permit badge + NIE badge.
- Header con número grande animado.

### `/perfiles/[slug]`
- Hero con foto 32px + bandera grande superpuesta + verified badge label.
- Sección documental visible primero (lo que vende a empresarios).
- Timeline de experiencia con dots y línea vertical.
- Skills con SkillBar (gradient + nivel).
- Idiomas como LanguageChip (bandera + nivel MCER).
- Sidebar derecha sticky con resumen rápido + CTA "Contactar ahora".
- Botones redes con icono + nombre + ExternalLink.

### `/planes-y-precios`
- Hero gradient.
- Plan Pro destacado con escala 1.02 + badge "Más popular" superpuesto + gradient bg.
- Garantía 30 días debajo.
- FAQ específico de pricing (5 preguntas).

### `/admin` (dashboard)
- Saludo personal "¡Buenas, Francisco!" + tipografía display.
- 4 KPIs con AnimatedCounter + trend (+X) en verde.
- Bento layout: embudo de selección visual (barras de progreso por etapa) + card "Mercado disponible" con gradient.
- Tip educativo abajo (búsquedas guardadas).

## Header marketing

- Logo en gradient bg + nombre Geist tipografía display.
- Pills de navegación con hover bg.
- ThemeToggle visible.
- Botón "Crear cuenta" rounded-full con sombra.
- Glass background al hacer scroll.

## Lo que queda como deuda menor

- Sección documentación en `/dashboard/mi-perfil` (form para que el candidato edite NIE, work_permit, homologation).
- Wizard de onboarding del candidato (multi-step).
- Empty states de todas las páginas internas migrados a `<IllustratedEmpty>`.
- Programmatic SEO de profesiones por nacionalidad.
- Mensajería realtime con Supabase Realtime sobre la tabla messages.
