import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ISOTIPO_PRIMARIO, ISOTIPO_SECUNDARIO, LOGOTIPO } from './logo-paths';

interface LogoProps {
  href?: string | null;
  className?: string;
  /** Clases del propio SVG. Sirve para forzar el color: `text-white` sobre fondo oscuro. */
  imgClassName?: string;
  /** Altura en píxeles. Por defecto 40. */
  height?: number;
  /** Si true, no envuelve en Link */
  asChild?: boolean;
  /** Versión monocroma: el punto del mismo color que las letras. */
  mono?: boolean;
}

/**
 * Logotipo de Talnet. Envoltorio único para cabecera, pie, barras laterales y
 * cualquier sitio donde aparezca la marca.
 *
 * SVG EN LÍNEA CON LOS TRAZADOS DEL MANUAL. Antes eran dos PNG reconstruidos a
 * partir de su web, uno para cada tema. Ahora las letras se pintan con
 * `currentColor`, así que un solo dibujo vale para los dos: negro sobre claro
 * y blanco sobre oscuro, que es exactamente lo que pide el manual (página 4).
 * El punto va siempre en #4878F4 salvo en la versión monocroma.
 *
 * ALTURA POR DEFECTO 40. El logotipo es muy apaisado (3,67:1): a 72 píxeles
 * de alto se comería la cabecera. Si tocas este valor, mira antes la barra
 * lateral del panel, que es donde menos sitio hay.
 *
 * El manual pide un margen libre alrededor de la mitad de su altura. Quien lo
 * coloque tiene que dejarlo; aquí no se añade para no descuadrar las barras.
 */
export function Logo({
  href = '/',
  className,
  imgClassName,
  height = 40,
  asChild = false,
  mono = false,
}: LogoProps) {
  const width = Math.round(height * LOGOTIPO.ratio);

  const svg = (
    <svg
      viewBox={LOGOTIPO.viewBox}
      width={width}
      height={height}
      role="img"
      aria-label="Talnet"
      className={cn('block shrink-0 select-none text-black dark:text-white', imgClassName)}
    >
      <path d={LOGOTIPO.letras} fill="currentColor" />
      <path d={LOGOTIPO.punto} fill={mono ? 'currentColor' : '#4878F4'} />
    </svg>
  );

  if (asChild || !href) {
    return <span className={cn('inline-flex items-center', className)}>{svg}</span>;
  }

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}
      aria-label="Talnet — ir a inicio"
    >
      {svg}
    </Link>
  );
}

interface IsotipoProps {
  /** `primario`: punto arriba. `secundario`: punto abajo, el de los avatares. */
  variante?: 'primario' | 'secundario';
  className?: string;
  /** Altura en píxeles. Por defecto 32. */
  height?: number;
  mono?: boolean;
}

/** Isotipo de Talnet: la «t» sola, para espacios pequeños. */
export function Isotipo({
  variante = 'primario',
  className,
  height = 32,
  mono = false,
}: IsotipoProps) {
  const iso = variante === 'primario' ? ISOTIPO_PRIMARIO : ISOTIPO_SECUNDARIO;
  const [, , w, h] = iso.viewBox.split(' ').map(Number);
  return (
    <svg
      viewBox={iso.viewBox}
      width={Math.round((height * w) / h)}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={cn('block shrink-0 text-black dark:text-white', className)}
    >
      <path d={iso.letras} fill="currentColor" />
      <path d={iso.punto} fill={mono ? 'currentColor' : '#4878F4'} />
    </svg>
  );
}
