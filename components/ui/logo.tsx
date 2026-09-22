import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string | null;
  className?: string;
  imgClassName?: string;
  /** Altura en píxeles. Por defecto 40. */
  height?: number;
  /** Si true, no envuelve en Link */
  asChild?: boolean;
}

/**
 * Logotipo de Talnet. Envoltorio único para cabecera, pie, barras laterales y
 * cualquier sitio donde aparezca la marca.
 *
 * DOS IMÁGENES, NO UNA. El logotipo de Talnet es el trazo en azul marino con
 * el punto en azul, y sobre fondo oscuro ese trazo desaparece: por eso su
 * propia web publica la versión blanca. Aquí van las dos y las cambia el CSS
 * según el tema, sin JavaScript ni parpadeo al cargar.
 *
 * ALTURA POR DEFECTO 40, NO 72. El logotipo anterior era casi cuadrado (1,25:1)
 * y este es muy apaisado (3,81:1): a 72 píxeles de alto ocuparía 274 de ancho y
 * se comería la cabecera. Si tocas este valor, mira antes la barra lateral del
 * panel, que es donde menos sitio hay.
 *
 * Pendiente: Talnet tiene que enviar el logotipo original en vectorial. Estas
 * imágenes salen de las que publica su web; la versión oscura está
 * reconstruida a partir de la blanca, usando el azul marino exacto de su
 * favicon. Sirve, pero un SVG se vería mejor en pantallas grandes.
 */
export function Logo({
  href = '/',
  className,
  imgClassName,
  height = 40,
  asChild = false,
}: LogoProps) {
  const RATIO = 1920 / 504;
  const width = Math.round(height * RATIO);
  const medidas = { height: `${height}px`, width: `${width}px` };
  const comun = cn('block select-none object-contain', imgClassName);

  const img = (
    <>
      <Image
        src="/talnet-logo.png"
        alt="Talnet"
        width={width}
        height={height}
        priority
        sizes={`${width}px`}
        className={cn(comun, 'dark:hidden')}
        style={medidas}
      />
      <Image
        src="/talnet-logo-blanco.png"
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        priority
        sizes={`${width}px`}
        className={cn(comun, 'hidden dark:block')}
        style={medidas}
      />
    </>
  );

  if (asChild || !href) {
    return <span className={cn('inline-flex items-center', className)}>{img}</span>;
  }

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}
      aria-label="Talnet — ir a inicio"
    >
      {img}
    </Link>
  );
}
