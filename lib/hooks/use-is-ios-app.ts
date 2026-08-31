'use client';

import { useEffect, useState } from 'react';

/**
 * Cierto solo dentro de la app de iPhone.
 *
 * Existe aparte de `useIsNative` porque la restriccion que nos obliga a esconder
 * planes y precios es exclusiva de Apple: su directriz 3.1.1 exige que todo lo
 * que se contrate y se consuma dentro de la app pase por su compra integrada,
 * asi que la app de iPhone no puede mostrar precios ni botones de contratar.
 * Android y web no tienen esa restriccion y ahi perderiamos altas sin motivo.
 *
 * No uses `useIsNative` para esta decision.
 */
export function useIsIOSApp(): boolean {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as {
      Capacitor?: { getPlatform?: () => string };
    };
    if (w.Capacitor?.getPlatform?.() === 'ios') {
      setIsIOS(true);
      return;
    }
    // Respaldo por user-agent: si el puente nativo aun no se ha inyectado sobre
    // la URL remota, getPlatform() devolveria "web". Se comprueba el marcador
    // propio que añade capacitor.config.ts, nunca "iPhone" a secas: Safari en
    // movil no es la app y ahi si se pueden ver los planes.
    const ua = navigator.userAgent || '';
    if (/MigriaJobiOS/i.test(ua)) setIsIOS(true);
  }, []);

  return isIOS;
}
