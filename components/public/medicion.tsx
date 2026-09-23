'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from './analytics';
import { CookieBanner } from './cookie-banner';

/**
 * Dónde se mide y dónde no.
 *
 * SE MIDE la web abierta y las pantallas de entrada (registro, inicio de
 * sesión, recuperar contraseña). Es el recorrido que interesa: de dónde viene
 * la gente y cuánta acaba creando una cuenta. El registro está en otro grupo de
 * rutas que la web pública, y por eso esto vive en el layout raíz y no en el de
 * marketing, que era donde estaba el banner antes.
 *
 * NO SE MIDE dentro del panel ni del área del candidato. No es por pudor: las
 * direcciones de ahí llevan datos de personas —/admin/candidatos/nombre-
 * apellido, expedientes, candidaturas— y cada página vista se le manda a Google
 * tal cual. Medir el uso interno no vale lo que cuesta.
 *
 * Como ahí tampoco se carga analítica, tampoco hay cookie que consentir, y por
 * eso el banner desaparece con ella.
 */

const ZONAS_SIN_MEDICION = ['/admin', '/dashboard'];

export function Medicion() {
  const pathname = usePathname();

  const esZonaPrivada = ZONAS_SIN_MEDICION.some(
    (zona) => pathname === zona || pathname.startsWith(`${zona}/`)
  );
  if (esZonaPrivada) return null;

  return (
    <>
      <Analytics />
      <CookieBanner />
    </>
  );
}
