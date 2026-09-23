'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// El nombre lleva "migria" de antes del cambio de marca. Se queda: cambiarlo
// haría que a todo el que ya respondió le volviese a salir el banner.
const STORAGE_KEY = 'migria-cookie-consent';

/** Se emite al elegir, para que la analítica se entere sin recargar. */
export const CONSENT_EVENT = 'consentimiento-cookies';

export type Consent = 'accepted' | 'rejected' | null;

/**
 * Qué eligió esta persona. Devuelve null si aún no ha elegido.
 *
 * Va con try/catch porque en ventana privada, o con el almacenamiento
 * bloqueado, leer localStorage no devuelve vacío: lanza. Y si esto revienta,
 * se lleva por delante la página entera.
 */
export function leerConsentimiento(): Consent {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Consent) ?? null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setConsent(leerConsentimiento());
  }, []);

  if (!hydrated || consent !== null) return null;

  const choose = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Sin dónde guardarlo, la elección vale solo para esta visita. Preferible
      // a que el botón no haga nada.
    }
    setConsent(value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-surface p-4 shadow-lg sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="text-sm text-foreground">
          Usamos cookies necesarias para que la app funcione y, opcionalmente, analítica anónima
          para mejorar el producto.{' '}
          <Link href="/cookies" className="text-primary underline-offset-2 hover:underline">
            Ver política
          </Link>.
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose('rejected')}>
            Solo necesarias
          </Button>
          <Button size="sm" onClick={() => choose('accepted')}>
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
}
