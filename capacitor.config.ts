import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // DECISIÓN: appId inmutable tras publicar en stores.
  appId: 'com.migriajob.app',
  // El nombre que sale bajo el icono. appId, en cambio, no se toca nunca.
  appName: 'Talnet',
  // webDir solo contiene la pantalla de carga/offline; la app real se carga vía server.url.
  webDir: 'mobile-shell',
  server: {
    // DECISIÓN: WebView hospedado. MigriaJob usa SSR + server actions + middleware,
    // así que NO se puede exportar estático; cargamos el sitio en producción.
    // La app abre en /bienvenida (pantalla nativa de roles); si hay sesión,
    // /bienvenida redirige al área del usuario.
    url: 'https://www.migriajob.com/bienvenida',
    androidScheme: 'https',
    // SIN ESTA LISTA iOS NO FUNCIONA. Android da por autorizado el dominio de
    // `server.url`; iOS no: cancela cualquier navegación cuyo host no esté aquí
    // (WebKitErrorDomain 102, "frame load interrupted") y la abre en Safari, de
    // modo que el usuario se descarga una app para acabar en el navegador.
    // Nos costó media mañana descubrirlo en StarIA. No la quites.
    allowNavigation: ['www.migriajob.com', 'migriajob.com', 'migriajob.vercel.app'],
    // Pantalla mostrada si la URL no carga (sin conexión / error).
    errorPath: 'offline.html',
  },
  ios: {
    // Marca el User-Agent para poder distinguir la app de iPhone desde la web,
    // que es donde se decide esconder planes y precios (directriz 3.1.1).
    // Ver lib/hooks/use-is-ios-app.ts.
    appendUserAgent: 'MigriaJobiOS',
    // 'never' evita que iOS añada su propio hueco bajo la barra de estado: el
    // layout ya reserva espacio con env(safe-area-inset-*).
    contentInset: 'never',
  },
  plugins: {
    PushNotifications: {
      // SIN ESTO NO SE VE NADA CON LA APP ABIERTA. Por defecto el plugin le
      // dice a iOS que no presente la notificación cuando la app está en primer
      // plano: Apple la entrega, responde 200 y en pantalla no aparece nada.
      // Es exactamente lo que nos tuvo horas persiguiendo un fallo inexistente;
      // con la pantalla bloqueada llegaba siempre. No lo quites.
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    // DECISIÓN: false en release. Con true, cualquiera con el móvil en la mano
    // puede inspeccionar la WebView desde chrome://inspect.
    webContentsDebuggingEnabled: false,
    // SIN EL PLUGIN DE PUSH EN ANDROID, a propósito. No hay google-services.json
    // (Firebase sin configurar) y con el plugin dentro la app pediría permiso de
    // notificaciones para nada y podría cerrarse al registrarse. Así estaba la
    // 1.6 publicada. Cuando se configure Firebase, quitar esta lista.
    includePlugins: ['@capacitor/app', '@capacitor/status-bar'],
    // Android 15 dibuja la web también detrás de la barra de estado y la de
    // gestos (borde a borde obligatorio), y las pantallas sin `safe-top` —el
    // login, por ejemplo— quedaban con el logo debajo de la hora. 'auto' deja
    // la web entre las dos barras, como en Android 14 y anteriores.
    adjustMarginsForEdgeToEdge: 'auto',
  },
};

export default config;
