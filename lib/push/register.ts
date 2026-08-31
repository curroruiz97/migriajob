/**
 * Registro del dispositivo para notificaciones push. Se llama desde
 * NativeBootstrap, solo dentro de la app.
 *
 * El permiso se pide en el arranque a proposito y no antes de la primera
 * notificacion: en un marketplace de empleo el valor esta claro desde el minuto
 * uno (te avisamos cuando una empresa te escribe o cuando alguien se inscribe a
 * tu oferta), y pedirlo mas tarde, descolgado de cualquier accion, confunde mas.
 *
 * Todo con import() dinamico para que los paquetes @capacitor/* no se evaluen
 * en el servidor ni rompan el build.
 */

let yaRegistrado = false;

export async function registerPushDevice(): Promise<void> {
  if (yaRegistrado) return;

  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return;

  const plataforma = Capacitor.getPlatform();
  if (plataforma !== 'ios' && plataforma !== 'android') return;

  const { PushNotifications } = await import('@capacitor/push-notifications');

  let permiso = await PushNotifications.checkPermissions();
  if (permiso.receive === 'prompt' || permiso.receive === 'prompt-with-rationale') {
    permiso = await PushNotifications.requestPermissions();
  }
  // Si el usuario dice que no, no insistimos. Puede activarlo desde los
  // ajustes del sistema cuando quiera.
  if (permiso.receive !== 'granted') return;

  yaRegistrado = true;

  await PushNotifications.addListener('registration', (token) => {
    // El token viaja a nuestro servidor, que lo guarda contra el usuario de la
    // sesion. Si nadie ha iniciado sesion todavia, la ruta responde 401 y no
    // pasa nada: al entrar, el arranque vuelve a ejecutarse.
    void fetch('/api/me/device-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value, platform: plataforma }),
    }).catch(() => {
      /* sin red: se reintenta en el proximo arranque */
    });
  });

  await PushNotifications.addListener('registrationError', (err) => {
    console.warn('[push] no se pudo registrar el dispositivo:', err);
  });

  // Al tocar la notificacion navegamos a donde diga el payload. Se comprueba
  // que sea una ruta interna: un `link` absoluto sacaria al usuario de la app.
  await PushNotifications.addListener('pushNotificationActionPerformed', (accion) => {
    const link = accion.notification.data?.link;
    if (typeof link === 'string' && link.startsWith('/')) {
      window.location.assign(link);
    }
  });

  await PushNotifications.register();
}
