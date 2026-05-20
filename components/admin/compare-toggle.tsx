'use client';

import { GitCompare } from 'lucide-react';
import { useCompare, useHasCompareProvider } from './compare-store';
import { cn } from '@/lib/utils';

export function CompareToggle({
  candidateId,
  candidateName,
  candidateSlug,
  className,
}: {
  candidateId: string;
  candidateName: string;
  candidateSlug: string | null;
  className?: string;
}) {
  const inAdmin = useHasCompareProvider();
  const { has, toggle } = useCompare();
  if (!inAdmin) return null; // Solo se muestra en zona admin
  const active = has(candidateId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ id: candidateId, name: candidateName, slug: candidateSlug });
      }}
      aria-label={active ? 'Quitar del comparador' : 'Añadir al comparador'}
      title={active ? 'Quitar del comparador' : 'Añadir al comparador'}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface text-muted-foreground hover:border-primary hover:text-primary',
        className
      )}
    >
      <GitCompare className="h-3.5 w-3.5" />
    </button>
  );
}
