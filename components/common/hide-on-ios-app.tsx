'use client';

import type { ReactNode } from 'react';
import { useIsIOSApp } from '@/lib/hooks/use-is-ios-app';

/**
 * Esconde precios, planes y botones de contratar dentro de la app de iPhone.
 *
 * La directriz 3.1.1 de Apple obliga a que todo lo que se contrate y se consuma
 * dentro de una app pase por su compra integrada, con su comisión. Mientras
 * MigriaJob cobre por su cuenta, la app de iPhone no puede mostrar precios ni
 * llevar a contratar: hacerlo es motivo de rechazo, y ya nos ha pasado en otra
 * app de la casa.
 *
 * Solo iPhone. Android y web siguen viendo los planes con normalidad.
 *
 * Durante el render del servidor y hasta que hidrata, se muestra el contenido:
 * lo contrario haría parpadear la página a todo el mundo en la web, que es la
 * inmensa mayoría. El WebView de iOS oculta en cuanto hidrata, antes de que dé
 * tiempo a leer nada.
 */
export function HideOnIOSApp({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isIOS = useIsIOSApp();
  if (isIOS) return <>{fallback}</>;
  return <>{children}</>;
}
