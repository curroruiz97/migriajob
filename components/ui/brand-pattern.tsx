import { cn } from '@/lib/utils';

/**
 * Patrón de marca de Talnet: los trazos del manual («Secciones de logo &
 * patrones de marca» y «Patrón y su color», páginas 10 y 11), sacados en
 * vectorial del PDF. Nacen de la «t» del logotipo: la barra y la curva del pie.
 *
 * El manual los usa en bloques de color plano, cada pieza un tono más oscura
 * que su fondo (#2A56FB sobre #0435EB, #4878F4 sobre #225CF2, #0E2C9F sobre
 * #0A2075). Aquí la pieza se pinta con `currentColor`, así que el tono lo pone
 * quien lo usa con una clase de texto: `text-accent` sobre `bg-primary`,
 * `text-white/[0.06]` sobre `bg-secondary`, etc.
 *
 * Es decoración: va siempre con aria-hidden y sin eventos de ratón.
 */

const PIEZAS = {
  /** Barra vertical con la curva hacia la derecha (el pie de la «t»). */
  alto: {
    viewBox: '0 0 165 220',
    d: 'M51.8 83.9C87.7 50.6 132.3 47.2 132.4 47.2L164.7 47.2L164.7 98.1L138.6 98.1C74.5 104.2 57.1 154.8 53.5 168.9C53.5 169 53.4 169.2 53.4 169.3C52.7 172.1 52.7 177.3 52.7 178.5L52.7 219.7L0 219.7L0 0.1L51.8 0.1L51.8 83.9Z',
  },
  /** Barra horizontal arriba y una curva que baja. */
  cuadrado: {
    viewBox: '0 0 165 164.3',
    d: 'M164.3 50.3L160.6 50.3C159.5 50.3 154.5 50.4 151.8 51C151.6 51 151.5 51.1 151.4 51.1C137.7 54.6 89 71.4 83 133.3L83 164.3L34 164.3L34 127.3C34 127.3 37.2 84.2 69.4 49.5L0 49.5L0 0L164.3 0L164.3 50.3Z',
  },
  /** Barra horizontal arriba y dos curvas: la pieza más reconocible. */
  ancho: {
    viewBox: '0 0 315 164.8',
    d: 'M313.6 46.8L280.6 46.8C279.5 46.8 274.9 46.9 272.4 47.5C272.3 47.5 272.2 47.5 272.1 47.5C259.6 50.8 214.8 66.2 209.4 123L209.4 164.8L164.4 164.8L164.4 117.5C164.4 117.5 167.3 78.5 196.2 46.8L148.2 46.8C147.2 46.8 142.6 46.9 140.1 47.5C140 47.5 139.8 47.5 139.7 47.5C127.2 50.8 82.4 66.2 76.9 123L76.9 164.8L31.8 164.8L31.8 117.5C31.8 117.5 34.7 77.9 64.4 46.1L0 46.1L0 0.1L313.6 0.1L313.6 46.8Z',
  },
} as const;

export type PiezaPatron = keyof typeof PIEZAS;

interface BrandPatternProps {
  pieza?: PiezaPatron;
  className?: string;
  /**
   * `slice` (por defecto) llena la caja y recorta lo que sobre, como en las
   * piezas del manual; `meet` la mete entera.
   */
  ajuste?: 'slice' | 'meet';
  /** Esquina a la que se ancla la pieza al recortarse. */
  ancla?: 'xMinYMin' | 'xMidYMin' | 'xMaxYMin' | 'xMinYMax' | 'xMidYMax' | 'xMaxYMax' | 'xMidYMid';
}

export function BrandPattern({
  pieza = 'ancho',
  className,
  ajuste = 'slice',
  ancla = 'xMidYMid',
}: BrandPatternProps) {
  const p = PIEZAS[pieza];
  return (
    <svg
      viewBox={p.viewBox}
      preserveAspectRatio={`${ancla} ${ajuste}`}
      className={cn('pointer-events-none select-none', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={p.d} fill="currentColor" />
    </svg>
  );
}

/**
 * El punto del logotipo como recurso suelto («la elipsis» del manual). Hereda
 * el color de texto, igual que el patrón.
 */
export function BrandDot({ className }: { className?: string }) {
  return (
    <span
      className={cn('pointer-events-none block aspect-square rounded-full bg-current', className)}
      aria-hidden="true"
    />
  );
}
