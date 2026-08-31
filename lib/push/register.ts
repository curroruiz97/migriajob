/**
 * Registro del dispositivo para notificaciones push. Se llama desde
 * NativeBootstrap, solo dentro de la app.
 *
 * El permiso se pide en el arranque a proposito y no antes de la primera
 * notificacion: en un marketplace de empleo el valor esta claro desde el minuto
 * uno (te avisamos cuando una empresa te escribe o cuando alguien se inscribe a
 * tu oferta), y pedirlo mas tarde, descolgado de cualquier accion, confunde mas.
 *
 * OJO CON LAS TRAZAS: la primera version de este fichero era silenciosa —el
 * envio del token tenia un catch vacio y no se registraba ni el estado de la
 * respuesta—. Resultado: el dispositivo no se guardaba y no habia forma de
 * saber en que punto se rompia la cadena. Cada paso deja ahora una linea con
 * prefijo [push]. Son cuatro lineas por arranque y valen su peso en oro el dia
 * que un usuario diga que no le llegan los avisos.
 *
 * Todo con import() dinamico para que los paquetes @capacitor/* no se evaluen
 * en el servidor ni rompan el build.
 */

let yaRegistrado = false;

async function enviarToken(token: string, plataforma: string): Promise<void> {
  try {
    const res = await fetch('/api/me/device-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, platform: plataforma }),
    });
    if (res.ok) {
      console.log('[push] dispositivo guardado');
      return;
    }
    // 401 = todavia no hay sesion. No es un error del sistema de push: el
    // usuario aun no ha entrado. Se reintentara en el proximo arranque.
    console.warn('[push] el servidor rechazo el token:', res.status, await res.text());
  } catch (err) {
    console.warn('[push] no se pudo enviar el token (sin red?):', err);
  }
}

export async function registerPushDevice(): Promise<void> {
  if (yaRegistrado) {
    console.log('[push] ya registrado en esta carga');
    return;
  }

  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return;

  const plataforma = Capacitor.getPlatform();
  console.log('[push] arrancando registro en', plataforma);
  if (plataforma !== 'ios' && plataforma !== 'android') return;

  let PushNotifications;
  try {
    ({ PushNotifications } = await import('@capacitor/push-notifications'));
  } catch (err) {
    console.warn('[push] el plugin no esta disponible:', err);
    return;
  }

  let permiso = await PushNotifications.checkPermissions();
  console.log('[push] permiso actual:', permiso.receive);
  if (permiso.receive === 'prompt' || permiso.receive === 'prompt-with-rationale') {
    permiso = await PushNotifications.requestPermissions();
    console.log('[push] permiso tras preguntar:', permiso.receive);
  }
  // Si el usuario dice que no, no insistimos. Puede activarlo desde los
  // ajustes del sistema cuando quiera.
  if (permiso.receive !== 'granted') {
    console.warn('[push] permiso denegado, no se registra nada');
    return;
  }

  yaRegistrado = true;

  await PushNotifications.addListener('registration', (token) => {
    console.log('[push] Apple devolvio token, largo', token.value.length);
    void enviarToken(token.value, plataforma);
  });

  await PushNotifications.addListener('registrationError', (err) => {
    // Aqui aparece lo que responde Apple cuando el alta falla: perfil sin la
    // capacidad de notificaciones, identificador que no coincide, dispositivo
    // sin conexion con APNs...
    console.error('[push] Apple rechazo el registro:', JSON.stringify(err));
  });

  // Al tocar la notificacion navegamos a donde diga el payload. Se comprueba
  // que sea una ruta interna: un `link` absoluto sacaria al usuario de la app.
  await PushNotifications.addListener('pushNotificationActionPerformed', (accion) => {
    const link = accion.notification.data?.link;
    if (typeof link === 'string' && link.startsWith('/')) {
      window.location.assign(link);
    }
  });

  console.log('[push] llamando a register()');
  try {
    await PushNotifications.register();
    console.log('[push] register() ha vuelto sin error; esperando el token de Apple');
  } catch (err) {
    console.error('[push] register() ha fallado:', err);
  }
}
