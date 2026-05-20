'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'migria-cookie-consent';

type Consent = 'accepted' | 'rejected' | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setConsent((localStorage.getItem(STORAGE_KEY) as Consent) ?? null);
  }, []);

  if (!hydrated || consent !== null) return null;

  const choose = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
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
