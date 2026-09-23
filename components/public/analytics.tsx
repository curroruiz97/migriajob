'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, leerConsentimiento } from './cookie-banner';

/**
 * Google Analytics, con dos condiciones.
 *
 * LA PRIMERA ES EL CONSENTIMIENTO. No se carga nada —ni el script— hasta que
 * alguien pulsa "Aceptar todas". La política de cookies promete que la
 * analítica solo funciona si la aceptas, y la forma de cumplirlo es no traer
 * el script, no traerlo y pedirle que se porte bien.
 *
 * LA SEGUNDA ES QUÉ DIRECCIÓN SE ENVÍA. Las fichas del catálogo llevan el
 * nombre de la persona dentro de la dirección (/perfiles/nombre-apellido), y
 * once de ellas arrastran además un número largo de la importación. Mandar eso
 * a Google sería enviarle un listado de por quién se interesa cada visitante,
 * con nombre y apellidos. Así que de esas páginas se informa la ruta a secas,
 * sin el nombre: se sigue sabiendo cuánta gente mira fichas, que es el dato
 * que interesa, sin decir de quién.
 *
 * Por eso la vista de página se envía a mano y no automáticamente: es la única
 * forma de decidir qué se manda.
 */

const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** Rutas cuyo último tramo identifica a una persona. */
const ANONIMAS = ['/perfiles/'];

export function rutaParaAnalitica(pathname: string, search = ''): string {
  for (const prefijo of ANONIMAS) {
    // Solo las fichas, no el listado: /perfiles se queda como está.
    if (pathname.startsWith(prefijo) && pathname.length > prefijo.length) {
      return `${prefijo.replace(/\/$/, '')}/[perfil]`;
    }
  }
  return pathname + search;
}

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: la firma de gtag es variádica.
    gtag?: (...args: any[]) => void;
    // biome-ignore lint/suspicious/noExplicitAny: dataLayer es de Google.
    dataLayer?: any[];
  }
}

export function Analytics() {
  const pathname = usePathname();
  const [acepta, setAcepta] = useState(false);

  useEffect(() => {
    const revisar = () => setAcepta(leerConsentimiento() === 'accepted');
    revisar();
    window.addEventListener(CONSENT_EVENT, revisar);
    return () => window.removeEventListener(CONSENT_EVENT, revisar);
  }, []);

  // Cada cambio de página dentro de la web es una vista nueva: sin esto solo
  // contaría la primera, porque aquí no se recarga el navegador al navegar.
  useEffect(() => {
    if (!acepta || !ID || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: rutaParaAnalitica(pathname, window.location.search),
    });
  }, [acepta, pathname]);

  if (!acepta || !ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${ID}', { send_page_view: false, anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

/**
 * Marca algo que ha pasado (un formulario enviado, una cuenta creada).
 *
 * Si no hay consentimiento, gtag no existe y esto no hace nada: no hay que
 * comprobarlo en cada sitio donde se llama.
 */
export function marcarEvento(nombre: string, datos?: Record<string, string | number>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', nombre, datos);
}
