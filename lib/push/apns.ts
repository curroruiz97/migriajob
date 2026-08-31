import http2 from 'node:http2';
import { createPrivateKey, sign as cryptoSign } from 'node:crypto';

/**
 * Envio de notificaciones push a APNs, el servicio de Apple.
 *
 * Por que hablamos con Apple directamente y no a traves de Firebase: el plugin
 * @capacitor/push-notifications devuelve un token de APNs en iOS. Para usar
 * Firebase habria que cambiar de plugin y arrastrar su fichero de configuracion
 * al proyecto nativo. Para una sola plataforma es un rodeo caro.
 *
 * APNs exige HTTP/2. El `fetch` de Node no lo habla, asi que usamos el modulo
 * http2 nativo. Nada de dependencias.
 */

const PROD_HOST = 'https://api.push.apple.com';
const SANDBOX_HOST = 'https://api.sandbox.push.apple.com';

export type ApnsEnvironment = 'production' | 'sandbox';

export interface PushMessage {
  title: string;
  body: string;
  /** Ruta interna a la que navegar al tocar la notificacion, p.ej. /dashboard/mensajes */
  link?: string;
  /** Numero para la burbuja del icono. Omitir si no se quiere tocar. */
  badge?: number;
}

export interface PushResult {
  ok: boolean;
  /** Cierto cuando Apple dice que el token ya no sirve y hay que borrarlo. */
  tokenInvalid: boolean;
  environment?: ApnsEnvironment;
  status?: number;
  reason?: string;
}

interface ApnsConfig {
  keyId: string;
  teamId: string;
  bundleId: string;
  privateKey: string;
}

function readConfig(): ApnsConfig | null {
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const bundleId = process.env.APNS_BUNDLE_ID;
  // En los paneles de despliegue los saltos de linea se pegan como \n literales.
  const privateKey = process.env.APNS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!keyId || !teamId || !bundleId || !privateKey) return null;
  return { keyId, teamId, bundleId, privateKey };
}

/** ¿Estan puestas las variables de entorno? Sirve para no romper en local. */
export function pushConfigured(): boolean {
  return readConfig() !== null;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Apple acepta el mismo token durante una hora y rechaza que se pida uno nuevo
// mas de una vez cada 20 minutos. Lo cacheamos 50 minutos.
let cachedToken: { value: string; expiresAt: number } | null = null;

function authToken(cfg: ApnsConfig): string {
  const ahora = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > ahora) return cachedToken.value;

  const header = base64url(JSON.stringify({ alg: 'ES256', kid: cfg.keyId }));
  const payload = base64url(JSON.stringify({ iss: cfg.teamId, iat: ahora }));
  const key = createPrivateKey(cfg.privateKey);
  // 'ieee-p1363' devuelve la firma en el formato r||s que espera JWT. Sin esto
  // Node firma en DER y Apple responde 403 InvalidProviderToken.
  const firma = cryptoSign('sha256', Buffer.from(`${header}.${payload}`), {
    key,
    dsaEncoding: 'ieee-p1363',
  });

  const jwt = `${header}.${payload}.${base64url(firma)}`;
  cachedToken = { value: jwt, expiresAt: ahora + 50 * 60 };
  return jwt;
}

function enviarA(
  host: string,
  cfg: ApnsConfig,
  deviceToken: string,
  message: PushMessage
): Promise<{ status: number; reason?: string }> {
  return new Promise((resolve, reject) => {
    const client = http2.connect(host);
    const cuerpo = JSON.stringify({
      aps: {
        alert: { title: message.title, body: message.body },
        sound: 'default',
        ...(message.badge === undefined ? {} : { badge: message.badge }),
      },
      ...(message.link ? { link: message.link } : {}),
    });

    const req = client.request({
      ':method': 'POST',
      ':path': `/3/device/${deviceToken}`,
      authorization: `bearer ${authToken(cfg)}`,
      'apns-topic': cfg.bundleId,
      'apns-push-type': 'alert',
      'apns-priority': '10',
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(cuerpo),
    });

    let status = 0;
    let datos = '';

    req.setEncoding('utf8');
    req.on('response', (headers) => {
      status = Number(headers[':status'] ?? 0);
    });
    req.on('data', (chunk) => {
      datos += chunk;
    });
    req.on('end', () => {
      client.close();
      let reason: string | undefined;
      if (datos) {
        try {
          reason = (JSON.parse(datos) as { reason?: string }).reason;
        } catch {
          reason = datos.slice(0, 200);
        }
      }
      resolve({ status, reason });
    });
    req.on('error', (err) => {
      client.close();
      reject(err);
    });

    req.end(cuerpo);
  });
}

/**
 * Envia a un dispositivo. Si no sabemos su entorno, prueba produccion y
 * reintenta en pruebas cuando Apple responde BadDeviceToken: es exactamente lo
 * que devuelve al recibir un token de una build de desarrollo.
 */
export async function sendApnsPush(
  deviceToken: string,
  message: PushMessage,
  environment?: ApnsEnvironment | null
): Promise<PushResult> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, tokenInvalid: false, reason: 'apns_not_configured' };

  const orden: ApnsEnvironment[] = environment
    ? [environment]
    : ['production', 'sandbox'];

  let ultimo: { status: number; reason?: string } | null = null;

  for (const env of orden) {
    const host = env === 'production' ? PROD_HOST : SANDBOX_HOST;
    try {
      const r = await enviarA(host, cfg, deviceToken, message);
      ultimo = r;
      if (r.status === 200) return { ok: true, tokenInvalid: false, environment: env, status: 200 };
      // Token de otro entorno: probamos el siguiente de la lista.
      if (r.reason === 'BadDeviceToken' && orden.length > 1) continue;
      // 410 Gone o Unregistered: el usuario desinstalo la app.
      const invalido = r.status === 410 || r.reason === 'Unregistered' || r.reason === 'BadDeviceToken';
      return { ok: false, tokenInvalid: invalido, environment: env, status: r.status, reason: r.reason };
    } catch (err) {
      ultimo = { status: 0, reason: err instanceof Error ? err.message : 'network_error' };
    }
  }

  return {
    ok: false,
    // Si ninguno de los dos entornos lo acepto, el token no sirve.
    tokenInvalid: ultimo?.reason === 'BadDeviceToken',
    status: ultimo?.status,
    reason: ultimo?.reason,
  };
}
