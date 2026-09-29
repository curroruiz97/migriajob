# Design System — Talnet

Fuente: manual de marca «TALNET-Master Brand Guidelines-2026» (PDF que pasó
Talnet en septiembre de 2026). Lo que aquí se describe está aplicado en
`app/globals.css`, `tailwind.config.ts` y `lib/utils/fonts.ts`. Si el manual
cambia, se cambia ahí; este documento solo resume.

## Color

Paleta del manual (página «Paleta de colores»):

| Hex | Papel en el manual | Token |
|---|---|---|
| `#2A56FB` | Azul primario | `--primary` (claro) |
| `#4878F4` | Azul primario claro; el punto del logotipo | `--primary` (oscuro), punto del logo |
| `#0E2C9F` | Azul primario oscuro | fondos del patrón |
| `#100E51` | Azul marino; fondo oscuro de marca | `--secondary` (claro) |
| `#070039` | Azul casi negro | texto sobre `--primary` en oscuro |
| `#0435EB` | Acento del patrón sobre `#2A56FB` | `--accent` |
| `#225CF2` | Acento del patrón sobre `#4878F4` | — |
| `#0A2075` | Acento del patrón sobre `#0E2C9F` | — |

`--accent-warm` (`#8BAAF8`) no está en el manual: es el punto del logotipo
aclarado para resaltar texto sobre `#100E51`, donde `#4878F4` no llega al
contraste de texto.

Contrastes que importan: blanco sobre `#2A56FB` 5,5:1 (el azul anterior,
`#507BEC`, se quedaba en 3,9:1 y no pasaba AA). `#8BAAF8` sobre `#100E51` 7,6:1.

El manual trabaja con **color plano**: nada de degradados en texto ni manchas
difuminadas de fondo.

## Tipografía

- **Sora** (principal): titulares (`font-display`, `h1`, `h2`), cifras, textos
  junto al logotipo. Seminegrita por defecto. **No tiene cursiva**: se enfatiza
  con color.
- **Inter** (secundaria): texto corrido e interfaz (`font-sans`).
- Geist Mono solo para lo monoespaciado.

## Logotipo

`components/ui/logo.tsx` (`<Logo />` e `<Isotipo />`), con los trazados del PDF
en `components/ui/logo-paths.ts`. Negro sobre claro, blanco sobre oscuro, punto
en `#4878F4`; versión monocroma con `mono`. Margen libre mínimo: la mitad de su
altura. No se redibuja ni se deforma.

Ficheros sueltos (para correos y terceros): `public/talnet-logo.svg|png`,
`public/talnet-logo-blanco.svg|png`, `public/talnet-isotipo.svg|png`.
Iconos: `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`; imagen para
compartir: `app/opengraph-image.png`.

## Patrón de marca

La barra y la curva de la «t», en tres piezas (`alto`, `cuadrado`, `ancho`),
siempre un tono más oscuro que su fondo. En React: `<BrandPattern />` y
`<BrandDot />` (`components/ui/brand-pattern.tsx`). En CSS:

- `.bg-patron-marca` — la pieza ancha asomando abajo a la derecha de una cabecera.
- `.bg-cta-marca` — bloque azul de llamada a la acción con la pieza cuadrada en la esquina.

SVG sueltos en `public/marca/`.

## Fotografía

Personas reales trabajando o interactuando, luz natural, sin filtros ni
ángulos extremos. Para anunciar vacantes o portadas, retratos recortados sobre
fondo liso (ver `components/public/hero-marca.tsx`).

## Espaciado y radios

- Container max: `max-w-7xl` (1280px)
- Radios: `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 14px`,
  `--radius-xl: 20px`, `--radius-2xl: 28px`. Los bloques de marca van en
  `rounded-xl` (20px), lo más cerca de las piezas del manual.
