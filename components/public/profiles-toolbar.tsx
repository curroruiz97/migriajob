'use client';

import { useQueryState, parseAsStringEnum } from 'nuqs';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfilesToolbar({ count }: { count: number }) {
  const [view, setView] = useQueryState(
    'view',
    parseAsStringEnum(['grid', 'list']).withDefault('grid').withOptions({
      shallow: false,
    })
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-sm">
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{count.toLocaleString('es-ES')}</strong>{' '}
        {count === 1 ? 'perfil encontrado' : 'perfiles encontrados'}
      </p>

      <div
        role="tablist"
        aria-label="Cambiar vista"
        className="flex items-center gap-0.5 rounded-full border border-border bg-muted/40 p-0.5"
      >
        <ViewButton
          icon={LayoutGrid}
          label="Cuadrícula"
          active={view === 'grid'}
          onClick={() => setView('grid')}
        />
        <ViewButton
          icon={List}
          label="Lista"
          active={view === 'list'}
          onClick={() => setView('list')}
        />
      </div>
    </div>
  );
}

function ViewButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof LayoutGrid;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
        active
          ? 'bg-surface text-foreground shadow-sm ring-1 ring-border'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
