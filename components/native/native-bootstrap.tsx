'use client';

import { useEffect } from 'react';

/**
 * Inicialización nativa (solo dentro de la app Capacitor; no-op en navegador web).
 * - StatusBar con color de marca y texto claro, sin solapar el WebView.
 * - Botón físico "atrás" de Android: retrocede en el historial o sale en la raíz.
 *
 * Usa import() dinámico para que los paquetes @capacitor/* no se evalúen en SSR
 * ni rompan el build del servidor.
 */
export function NativeBootstrap() {
  useEffect(() => {
    let remove = () => {};

    (async () => {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) return; // DECISIÓN: no hace nada en web

      // Marca el documento para que la CSS pueda esconder el footer/header de
      // marketing y reservar espacio para el bottom nav nativo.
      document.documentElement.classList.add('app-native');

      const [{ StatusBar, Style }, { App }] = await Promise.all([
        import('@capacitor/status-bar'),
        import('@capacitor/app'),
      ]);

      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      // Azul marino de Talnet (#100E51). Hasta el cambio al manual de marca
      // seguía el terracota de Migria.
      StatusBar.setBackgroundColor({ color: '#100E51' }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {}); // Dark = texto claro, para fondo oscuro

      const sub = await App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
      remove = () => {
        sub.remove();
      };

      // Notificaciones push. Va al final a proposito: si algo fallara aqui, la
      // barra de estado y el boton atras ya estan configurados.
      const { registerPushDevice } = await import('@/lib/push/register');
      await registerPushDevice().catch((err) => {
        console.warn('[push] registro fallido:', err);
      });
    })();

    return () => remove();
  }, []);

  return null;
}
