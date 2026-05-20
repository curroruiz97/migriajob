import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string | null;
  className?: string;
  imgClassName?: string;
  /** Altura en píxeles. Por defecto 72. */
  height?: number;
  /** Si true, no envuelve en Link */
  asChild?: boolean;
}

/**
 * Logo oficial de MIGRIA. Wrapper consistente para header, footer, sidebars y emails.
 * Asset: /public/MIGRIA-Logotipo2-vectorizado-06.png  (ratio 1024x817 ≈ 1.25:1)
 */
export function Logo({
  href = '/',
  className,
  imgClassName,
  height = 72,
  asChild = false,
}: LogoProps) {
  const RATIO = 1024 / 817;
  const width = Math.round(height * RATIO);

  const img = (
    <Image
      src="/MIGRIA-Logotipo2-vectorizado-06.png"
      alt="Migria"
      width={width}
      height={height}
      priority
      sizes={`${width}px`}
      className={cn('block select-none object-contain', imgClassName)}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );

  if (asChild || !href) {
    return <span className={cn('inline-flex items-center', className)}>{img}</span>;
  }

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}
      aria-label="Migria — ir a inicio"
    >
      {img}
    </Link>
  );
}
