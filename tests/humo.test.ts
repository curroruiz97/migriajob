import { describe, expect, test } from 'bun:test';

/**
 * Pruebas de humo contra el sitio desplegado.
 *
 * No sustituyen a unas pruebas de flujo —para eso hace falta una base de datos
 * de pruebas—, pero cubren lo que más caro sale y más fácil es romper sin
 * enterarse: que las páginas públicas siguen en pie, que las privadas siguen
 * cerradas y que la base de datos no vuelve a quedar abierta.
 *
 * Esa última es la importante. El 1 de septiembre de 2026 se descubrió que la
 * clave pública podía leer el correo, el teléfono y el número de documento de
 * más de mil candidatos, y el 22 de septiembre que podía listar la tabla de
 * perfiles entera. Las dos cosas están cerradas; esto es lo que avisaría si
 * alguien las reabriera sin darse cuenta.
 *
 * Se salta con SMOKE=0 (por ejemplo, para trabajar sin red).
 */

const BASE = process.env.SMOKE_URL ?? 'https://www.migriajob.com';
const SUPABASE = 'https://pagxshxrvkoeyjwzxqrl.supabase.co';
const activo = process.env.SMOKE !== '0';

// La clave pública viaja dentro del JavaScript del sitio: es pública por
// diseño, y es exactamente la que tendría cualquiera que quisiera fisgar.
const CLAVE_PUBLICA = process.env.SMOKE_ANON_KEY ?? '';

const prueba = activo ? test : test.skip;

async function estado(ruta: string): Promise<number> {
  const r = await fetch(`${BASE}${ruta}`, { redirect: 'manual' });
  return r.status;
}

describe('las páginas públicas siguen en pie', () => {
  for (const ruta of ['/', '/empleos', '/perfiles', '/contacto', '/migria-espana', '/empresas']) {
    prueba(`${ruta} responde 200`, async () => {
      expect(await estado(ruta)).toBe(200);
    }, 20_000);
  }

  prueba('el sitemap tiene contenido', async () => {
    const r = await fetch(`${BASE}/sitemap.xml`);
    const xml = await r.text();
    expect(r.status).toBe(200);
    expect(xml).toContain('<loc>');
  }, 20_000);

  prueba('el fichero de Search Console sigue donde Google lo busca', async () => {
    // Borrarlo retira la verificación de la propiedad.
    expect(await estado('/googlebffa0c58308130ff.html')).toBe(200);
  }, 20_000);
});

describe('las zonas privadas siguen cerradas', () => {
  for (const ruta of ['/admin', '/admin/expedientes', '/dashboard', '/admin/moderacion']) {
    prueba(`${ruta} manda a iniciar sesión`, async () => {
      const r = await fetch(`${BASE}${ruta}`, { redirect: 'manual' });
      expect([302, 307]).toContain(r.status);
      expect(r.headers.get('location') ?? '').toContain('/login');
    }, 20_000);
  }
});

describe('las cabeceras de seguridad no se han caído', () => {
  prueba('están las cuatro', async () => {
    const r = await fetch(`${BASE}/`);
    const h = r.headers;
    expect(h.get('x-content-type-options')).toBe('nosniff');
    expect(h.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(h.get('content-security-policy')).toContain('frame-ancestors');
    // La cámara tiene que seguir permitida: la foto de perfil se hace con ella.
    expect(h.get('permissions-policy')).toContain('camera=(self)');
  }, 20_000);
});

describe('la base de datos no está abierta a cualquiera', () => {
  const conClave = CLAVE_PUBLICA ? prueba : test.skip;

  conClave('la tabla de perfiles no se puede leer sin sesión', async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/profiles?select=id&limit=1`, {
      headers: { apikey: CLAVE_PUBLICA, Authorization: `Bearer ${CLAVE_PUBLICA}` },
    });
    // 401: la base de datos rechaza. Un 200 aquí significa que se ha vuelto a
    // abrir el acceso y que hay nombres y teléfonos al alcance de cualquiera.
    expect(r.status).toBe(401);
  }, 20_000);

  conClave('un candidato no devuelve sus datos de contacto sin sesión', async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/candidates?select=*&limit=1`, {
      headers: { apikey: CLAVE_PUBLICA, Authorization: `Bearer ${CLAVE_PUBLICA}` },
    });
    expect(r.status).toBe(401);
  }, 20_000);

  conClave('las consultas del formulario de contacto no las lee cualquiera', async () => {
    const r = await fetch(`${SUPABASE}/rest/v1/contact_requests?select=*`, {
      headers: { apikey: CLAVE_PUBLICA, Authorization: `Bearer ${CLAVE_PUBLICA}` },
    });
    const filas = r.status === 200 ? await r.json() : [];
    // Puede responder 200 con lista vacía (las políticas filtran) o 401.
    expect(filas).toHaveLength(0);
  }, 20_000);
});
