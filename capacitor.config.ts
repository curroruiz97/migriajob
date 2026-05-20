import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // DECISIÓN: appId inmutable tras publicar en stores.
  appId: 'com.migriajob.app',
  appName: 'MigriaJob',
  // webDir solo contiene la pantalla de carga/offline; la app real se carga vía server.url.
  webDir: 'mobile-shell',
  server: {
    // DECISIÓN: WebView hospedado. MigriaJob usa SSR + server actions + middleware,
    // así que NO se puede exportar estático; cargamos el sitio en producción.
    url: 'https://migriajob.vercel.app',
    androidScheme: 'https',
    // Pantalla mostrada si la URL no carga (sin conexión / error).
    errorPath: 'offline.html',
  },
  android: {
    // DECISIÓN: true para depurar con chrome://inspect; poner false antes de release.
    webContentsDebuggingEnabled: true,
  },
};

export default config;
