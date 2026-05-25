'use client';

import type { ReactNode } from 'react';
import { useIsNative } from '@/lib/hooks/use-is-native';

/**
 * Oculta sus hijos cuando la web se renderiza dentro de la app Capacitor.
 * Para usar con el footer/encabezado de marketing, que sustituimos por la
 * barra de navegación nativa cuando estamos en la app.
 *
 * Importante: para evitar mismatch SSR/CSR, en server siempre se renderiza
 * (visible). En el cliente se oculta tras hidratar si detectamos Capacitor.
 */
export function HideInApp({ children }: { children: ReactNode }) {
  const isNative = useIsNative();
  if (isNative) return null;
  return <>{children}</>;
}

/**
 * Inverso: solo muestra el contenido cuando estamos dentro de la app.
 */
export function ShowInApp({ children }: { children: ReactNode }) {
  const isNative = useIsNative();
  if (!isNative) return null;
  return <>{children}</>;
}
