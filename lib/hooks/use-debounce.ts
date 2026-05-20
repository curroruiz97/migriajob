'use client';

import { useEffect, useState } from 'react';

/**
 * Devuelve un valor que se actualiza solo después de `delay` ms sin cambios.
 * Úsalo en buscadores para evitar fetch en cada keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
