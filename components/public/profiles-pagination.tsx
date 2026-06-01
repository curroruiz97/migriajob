'use client';

import { useQueryState, parseAsInteger } from 'nuqs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Paginación para el listado de perfiles/candidatos. Lee y escribe el
 * parámetro `page` en la URL (compartible) vía nuqs, igual que el resto de
 * filtros. No se renderiza si solo hay una página.
 */
export function ProfilesPagination({
  total,
  perPage,
}: {
  total: number;
  perPage: number;
}) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  if (totalPages <= 1) return null;

  const go = (p: number) => setPage(p <= 1 ? null : Math.min(p, totalPages));

  // Ventana de páginas alrededor de la actual (1 … n-1 n n+1 … N)
  const pages: number[] = [];
  const from = Math.max(1, current - 1);
  const to = Math.min(totalPages, current + 1);
  for (let p = from; p <= to; p++) pages.push(p);

  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  return (
    <nav
      aria-label="Paginación de perfiles"
      className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Mostrando <strong className="text-foreground">{start.toLocaleString('es-ES')}</strong>–
        <strong className="text-foreground">{end.toLocaleString('es-ES')}</strong> de{' '}
        <strong className="text-foreground">{total.toLocaleString('es-ES')}</strong>
      </p>

      <div className="flex items-center gap-1">
        <PageBtn
          onClick={() => go(current - 1)}
          disabled={current <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </PageBtn>

        {from > 1 && (
          <>
            <PageBtn onClick={() => go(1)}>1</PageBtn>
            {from > 2 && <span className="px-1 text-muted-foreground">…</span>}
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} onClick={() => go(p)} active={p === current}>
            {p}
          </PageBtn>
        ))}

        {to < totalPages && (
          <>
            {to < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
            <PageBtn onClick={() => go(totalPages)}>{totalPages}</PageBtn>
          </>
        )}

        <PageBtn
          onClick={() => go(current + 1)}
          disabled={current >= totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </PageBtn>
      </div>
    </nav>
  );
}

function PageBtn({
  children,
  onClick,
  active = false,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface text-foreground hover:bg-muted',
        disabled && 'pointer-events-none opacity-40'
      )}
    >
      {children}
    </button>
  );
}
