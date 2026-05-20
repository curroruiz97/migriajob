# Migria — Guía de marca

## Posicionamiento

**Una frase:** Migria es el escaparate de talento latinoamericano profesional para empresas españolas que quieren contratar bien y sin fricciones.

**Para quién:**
- **Profesionales latinos** que viven en España (con NIE/permiso) o quieren mudarse.
- **Empresarios y reclutadores españoles** que buscan talento cualificado, verificado y disponible.

**Por qué Migria:**
- Filtros que importan: situación documental, homologación, nivel de español, disponibilidad real.
- Perfiles verificados: no es "otro Linkedin con todo el mundo".
- Sin barreras: hablamos español de los dos lados del Atlántico.

## Tono de voz

| Sí | No |
|---|---|
| Cálido, cercano, directo | Corporativo, frío, formal |
| "Te ayudamos a contratar mejor" | "Optimiza tu funnel de adquisición" |
| Verbos de acción concretos | Sustantivos abstractos |
| Frases cortas, punto final claro | Subordinadas largas |
| Microcopy con personalidad | "OK / Cancelar / Aceptar" |
| Reconoce al humano: "Hola, Francisco" | "Bienvenido, Usuario" |
| Errores con empatía: "No es culpa tuya" | "Error 500" |

**Voz para empleadores:** profesional pero próxima. Estás hablando con un director de RRHH o un CEO de PYME, no con un robot.

**Voz para candidatos:** motivadora, esperanzadora. Muchos llegan con incertidumbre. "Te encontramos a la empresa correcta."

## Sistema visual

### Paleta principal (de migriajob.com extraída)

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--primary` | `#d96f46` terracota | `#e58964` | CTA principal, marca |
| `--accent` | `#ff6900` naranja vivo | `#ff7e2e` | CTA destacada, badges premium |
| `--accent-warm` | `#fcb900` amarillo | `#ffd24a` | Premio, achievement |
| `--secondary` | `#23120b` marrón oscuro | `#fae5d8` | Headings serios, fondo dark |
| `--background` | `#fdf8f3` off-white cálido | `#1a0d07` | Fondo página |

### Paleta de banderas país (LATAM)

Para badges de país de origen, usar tonos suaves con buen contraste:

| País | Color | Hex |
|---|---|---|
| Argentina | celeste | `#75aadb` |
| Bolivia | rojo-amarillo | `#d52b1e` |
| Brasil | verde | `#009c3b` |
| Chile | rojo | `#d52b1e` |
| Colombia | amarillo | `#fcd116` |
| Cuba | azul | `#002a8f` |
| Ecuador | amarillo | `#ffce00` |
| El Salvador | azul | `#0047a0` |
| Guatemala | celeste | `#4997d0` |
| Honduras | azul | `#00bce4` |
| México | verde | `#006847` |
| Nicaragua | azul | `#0067c6` |
| Panamá | azul | `#005293` |
| Paraguay | rojo | `#d52b1e` |
| Perú | rojo | `#d91023` |
| República Dominicana | rojo | `#ce1126` |
| Uruguay | celeste | `#0038a8` |
| Venezuela | amarillo | `#ffce00` |
| España | rojo-amarillo | `#aa151b` |

### Tipografía

| Rol | Familia | Notas |
|---|---|---|
| Display (H1, H2 grandes) | **Instrument Serif** | Elegante, distintivo. Italic para acentos. |
| Body / UI | **Geist Sans** | Limpia, legible |
| Mono (código, datos) | **Geist Mono** | |

Escala: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72 / 96.

### Sombras y radios

```
--radius-sm: 6px
--radius-md: 10px (default)
--radius-lg: 14px
--radius-xl: 20px
--radius-2xl: 28px

--shadow-sm: 0 1px 2px rgba(35,18,11,.06)
--shadow-md: 0 4px 12px rgba(35,18,11,.08)
--shadow-lg: 0 12px 32px rgba(35,18,11,.10)
--shadow-glow: 0 0 0 4px rgba(217,111,70,.15) (focus rings)
```

### Animaciones

- `fade-in` 200ms ease-out
- `slide-up` 320ms cubic-bezier(.22, 1, .36, 1)
- `shimmer` 1.6s loop (skeletons)
- `count-up` con `framer-motion` (KPIs)
- `hover-lift`: cards `translateY(-2px)` + shadow al hover (200ms)

## Componentes clave

- `<CountryFlag code="AR" />` — bandera 16x12 con borde 1px
- `<VerifiedBadge />` — checkmark azul tipo Twitter
- `<DocumentationBadge status="verified" />` — píldora verde "✓ NIE vigente"
- `<SkillBar level="advanced" />` — barra horizontal con dot final
- `<LanguageChip code="es" level="native" />` — bandera + nivel MCER
- `<AnimatedCounter value={1247} />` — cuenta de 0 al valor al entrar en viewport
- `<IllustratedEmpty kind="search" />` — empty state con SVG ilustrado

## Microcopy patterns

| Contexto | Patrón |
|---|---|
| Vacío | "Aún no tienes X. Empieza por Y." |
| Error | "Algo se rompió. No es culpa tuya. {Action}." |
| Loading | "Buscando…" / "Guardando…" (no "Cargando" genérico) |
| Éxito | Verbo + contexto: "Perfil guardado" / "Mensaje enviado" |
| Confirmación destructiva | "¿Seguro? Esto no se puede deshacer." |

## Inspiración visual

- **Linear** — densidad, oscuro elegante, atajos
- **Vercel** — gradientes sutiles, tipografía premium
- **Stripe** — hero con elementos flotantes, copy persuasiva
- **Idealista** — filtros laterales con conteos, vista lista/mapa
- **Welcome to the Jungle** — fichas de empresa cálidas, tipografía editorial
