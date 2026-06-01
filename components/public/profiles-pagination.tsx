'use client';

import { useQueryState, parseAsInteger, parseAsStringLiteral } from 'nuqs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PER_PAGE_OPTIONS = [20, 50, 100] as const;

/**
 * Paginación para el listado de perfiles/candidatos. Lee y escribe los
 * parámetros `page` y `perPage` en la URL (compartible) vía nuqs, igual que
 * el resto de filtros. No se renderiza si total <= 0.
 */
export function ProfilesPagination({
  total,
  perPage: perPageProp,
}: {
  total: number;
  perPage: number;
}) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  const [, setPerPage] = useQueryState(
    'perPage',
    parseAsStringLiteral(['20', '50', '100']).withDefault('20').withOptions({ shallow: false })
  );

  const perPage = perPageProp;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);

  const go = (p: number) => setPage(p <= 1 ? null : Math.min(p, totalPages));

  const changePerPage = (value: string) => {
    setPerPage(value === '20' ? null : value as '20' | '50' | '100');
    setPage(null); // volver a página 1 al cambiar tamaño
  };

  if (total <= 0) return null;

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
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Mostrando <strong className="text-foreground">{start.toLocaleString('es-ES')}</strong>–
          <strong className="text-foreground">{end.toLocaleString('es-ES')}</strong> de{' '}
          <strong className="text-foreground">{total.toLocaleString('es-ES')}</strong>
        </p>

        <select
          value={String(perPage)}
          onChange={(e) => changePerPage(e.target.value)}
          aria-label="Resultados por página"
          className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={String(n)}>
              {n} / pág
            </option>
          ))}
        </select>
      </div>

      {totalPages > 1 && (
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
      )}
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
