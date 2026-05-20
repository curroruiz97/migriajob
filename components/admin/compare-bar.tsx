'use client';

import Link from 'next/link';
import { ArrowRight, GitCompare, X } from 'lucide-react';
import { useCompare } from './compare-store';
import { Button } from '@/components/ui/button';

/**
 * Barra flotante inferior con los candidatos seleccionados para comparar.
 * Aparece automáticamente cuando hay items y se oculta cuando no hay.
 */
export function CompareBar() {
  const { items, toggle, clear } = useCompare();
  if (items.length === 0) return null;

  const ids = items.map((i) => i.id).join(',');

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-3 shadow-2xl backdrop-blur">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GitCompare className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {items.length} {items.length === 1 ? 'candidato' : 'candidatos'} para comparar
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {items.map((i) => i.name.split(' ')[0]).join(' · ')}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {items.length >= 2 && (
            <Button asChild size="sm">
              <Link href={`/admin/comparador?ids=${ids}`}>
                Comparar <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={clear}
            aria-label="Limpiar selección"
            title="Limpiar selección"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
