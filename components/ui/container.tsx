import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZES: Record<Size, string> = {
  sm: 'max-w-3xl',     // 768px — texto largo, FAQ, legal
  md: 'max-w-5xl',     // 1024px — content medio (artículos, ficha detalle)
  lg: 'max-w-6xl',     // 1152px — secciones principales
  xl: 'max-w-7xl',     // 1280px — listados, home, dashboard (DEFAULT)
  full: 'max-w-none',
};

interface ContainerProps {
  children: ReactNode;
  size?: Size;
  className?: string;
  as?: ElementType;
}

/**
 * Contenedor uniforme para garantizar el mismo ancho en toda la web.
 * Usar siempre en lugar de los `mx-auto max-w-... px-... sueltos.
 */
export function Container({ children, size = 'xl', className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZES[size], className)}>
      {children}
    </Tag>
  );
}
