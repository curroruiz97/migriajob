# Design System — Migria SaaS

Paleta extraída de [migriajob.com](https://migriajob.com) durante FASE 2.

## Paleta extraída (top hex)

| Hex | Conteo | Uso original |
|---|---:|---|
| `#23120b` | 3 | marrón muy oscuro — headings, fondo dark |
| `#f6b08b` | 2 | naranja claro — fondos suaves, hovers |
| `#d96f46` | 2 | **terracota — primario / CTA** |
| `#ff6900` | 1 | naranja vivo — acento |
| `#fcb900` | 1 | amarillo cálido — destacar |
| `#0693e3` | 1 | azul — info / enlaces |
| `#00d084` | 1 | verde — éxito |
| `#cf2e2e` | 1 | rojo — error |
| `#ffffff` | 1 | blanco — superficies |

## Tokens semánticos

### Light mode

| Token | Hex | Notas |
|---|---|---|
| `--color-primary` | `#d96f46` | terracota migriajob |
| `--color-primary-hover` | `#c45e3a` | -10% lightness |
| `--color-primary-active` | `#a84d2f` | -20% lightness |
| `--color-primary-foreground` | `#ffffff` | sobre primary |
| `--color-primary-soft` | `#fae5d8` | bg badges, alerts soft |
| `--color-secondary` | `#23120b` | marrón cálido headings |
| `--color-secondary-foreground` | `#fae5d8` | sobre secondary |
| `--color-accent` | `#ff6900` | CTA destacadas |
| `--color-accent-warm` | `#fcb900` | badges premium |
| `--color-background` | `#fdf8f3` | off-white cálido |
| `--color-surface` | `#ffffff` | cards |
| `--color-surface-muted` | `#f7efe6` | cards desactivadas, alt rows |
| `--color-border` | `#e8dfd5` | bordes suaves |
| `--color-border-strong` | `#cdb9a4` | bordes con énfasis |
| `--color-text-primary` | `#23120b` | cuerpo |
| `--color-text-secondary` | `#6b5440` | etiquetas, captions |
| `--color-text-muted` | `#9c8b7b` | placeholders |
| `--color-success` | `#00a26a` | -ajustado para AA |
| `--color-success-soft` | `#d6f5e8` | |
| `--color-warning` | `#d68a00` | -ajustado para AA |
| `--color-warning-soft` | `#fef0d6` | |
| `--color-error` | `#cf2e2e` | |
| `--color-error-soft` | `#fbe1e1` | |
| `--color-info` | `#0e7ec1` | -ajustado para AA |
| `--color-info-soft` | `#dceefc` | |

### Dark mode

| Token | Hex |
|---|---|
| `--color-background` | `#1a0d07` |
| `--color-surface` | `#2a1810` |
| `--color-surface-muted` | `#36211a` |
| `--color-border` | `#3d2418` |
| `--color-border-strong` | `#5a3a2a` |
| `--color-text-primary` | `#fae5d8` |
| `--color-text-secondary` | `#c8a585` |
| `--color-text-muted` | `#9c8b7b` |
| `--color-primary` | `#e58964` (más luminoso) |
| `--color-primary-soft` | `#3d2418` |

## Tipografía

- **Body / UI:** Geist Sans (heredado), fallback `system-ui, sans-serif`
- **Display (headings)/headlines:** Geist Sans 700, tracking tight
- **Mono:** Geist Mono

Escala: `12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60`

## Espaciado y radios

- Container max: `max-w-7xl` (1280px)
- Radios: `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 14px`, `--radius-xl: 20px`, `--radius-2xl: 28px`

## Aplicación

Componentes alineados a tokens en esta fase:
- `globals.css` — `:root` y `.dark`
- `tailwind.config.ts` — `theme.extend.colors` mapea tokens a clases (`bg-primary`, `text-foreground`, `border-strong`, etc.)
- `Button` — variants default/outline/ghost/destructive/accent
- `Card`, `Input`, `Label`, `Badge`, `Tabs`, `Skeleton`
- `MarketingHeader` con CTA primaria
- `AdminSidebar` activo en primary
- `ProfileCard` con tonos de availability ajustados a la paleta
- `ProcessKanban` con columnas tonificadas
