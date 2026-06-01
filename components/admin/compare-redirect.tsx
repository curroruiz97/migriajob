'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'migria-compare';

/**
 * Si la página del comparador se carga sin ?ids= pero hay candidatos
 * en localStorage, redirige automáticamente añadiendo los IDs a la URL.
 */
export function CompareRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('ids')) return; // ya tiene IDs, no hacer nada
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const items = JSON.parse(raw) as { id: string }[];
      if (items.length >= 2) {
        const ids = items.map((i) => i.id).join(',');
        router.replace(`/admin/comparador?ids=${ids}`);
      }
    } catch {}
  }, [router, searchParams]);

  return null;
}
