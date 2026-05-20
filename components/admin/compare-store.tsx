'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'migria-compare';
const MAX_ITEMS = 4;

type Item = { id: string; name: string; slug: string | null };

interface CompareContextValue {
  items: Item[];
  has: (id: string) => boolean;
  toggle: (item: Item) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((item: Item) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev.filter((i) => i.id !== item.id);
      if (prev.length >= MAX_ITEMS) return prev;
      return [...prev, item];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, has, toggle, clear }), [items, has, toggle, clear]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (ctx) return ctx;
  // Fallback noop para usar el hook fuera del provider (páginas públicas)
  return {
    items: [],
    has: () => false,
    toggle: () => {},
    clear: () => {},
  };
}

/** Devuelve true solo si hay un CompareProvider real (zona admin). */
export function useHasCompareProvider(): boolean {
  return useContext(CompareContext) !== null;
}
