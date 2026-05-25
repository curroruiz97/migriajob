'use client';

import { useState, useTransition } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toggleSavedJobAction } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Botón "guardar como favorita" para ofertas reales (jobs en BD).
 *
 * - `compact`: muestra solo el icono (para listas/cards).
 * - sin compact: muestra icono + texto (para detalle).
 *
 * Usa optimistic update local; ante error, revierte. La persistencia ocurre
 * en `saved_jobs` (RLS limitada al propio candidato).
 */
export function SavedJobButton({
  jobId,
  initiallySaved,
  compact = false,
  className,
}: {
  jobId: string;
  initiallySaved: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (pending) return;
    const next = !saved;
    setSaved(next); // optimistic
    setError(null);
    startTransition(async () => {
      const res = await toggleSavedJobAction(jobId);
      if (res && 'error' in res && res.error) {
        setSaved(!next); // revert
        setError(res.error ?? 'No se pudo guardar la oferta.');
      } else if (res && 'saved' in res) {
        setSaved(Boolean(res.saved));
      }
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? 'Quitar de favoritos' : 'Guardar como favorita'}
        aria-pressed={saved}
        title={saved ? 'Guardada' : 'Guardar'}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-primary',
          saved && 'border-primary/30 bg-primary-soft text-primary',
          className
        )}
        disabled={pending}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Button
        type="button"
        variant={saved ? 'default' : 'outline'}
        size="lg"
        className="h-11 w-full rounded-xl text-sm font-semibold"
        onClick={toggle}
        disabled={pending}
        aria-pressed={saved}
      >
        {saved ? (
          <>
            <BookmarkCheck className="mr-1.5 h-4 w-4" />
            Guardada en favoritos
          </>
        ) : (
          <>
            <Bookmark className="mr-1.5 h-4 w-4" />
            Guardar oferta
          </>
        )}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
