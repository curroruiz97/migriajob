'use client';

import { useEffect, useState } from 'react';

/**
 * Devuelve true cuando la web se está ejecutando dentro de un WebView Capacitor
 * (la app móvil MigriaJob). En el navegador normal devuelve false.
 *
 * Detección defensiva: Capacitor inyecta `window.Capacitor`. Si está ausente,
 * caemos a comprobar el user-agent (`MigriaJob-App` u otros marcadores nativos).
 */
export function useIsNative(): boolean {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as {
      Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string };
    };
    if (w.Capacitor?.isNativePlatform?.()) {
      setIsNative(true);
      return;
    }
    const ua = navigator.userAgent || '';
    if (/MigriaJob-App|CapacitorWebView/i.test(ua)) {
      setIsNative(true);
    }
  }, []);

  return isNative;
}
