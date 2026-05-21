'use client';

import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const JOB_TYPES = [
  { value: 'full_time', label: 'Jornada completa' },
  { value: 'part_time', label: 'Media jornada' },
  { value: 'contract', label: 'Contrato' },
  { value: 'internship', label: 'Prácticas' },
  { value: 'freelance', label: 'Freelance' },
];

const WORK_MODES = [
  { value: 'on_site', label: 'Presencial' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'remote', label: 'Remoto' },
];

const SALARY_BANDS = [
  { value: 18000, label: '18k+' },
  { value: 25000, label: '25k+' },
  { value: 35000, label: '35k+' },
  { value: 50000, label: '50k+' },
];

const PARSERS = {
  q: parseAsString.withDefault(''),
  type: parseAsString.withDefault(''),
  mode: parseAsString.withDefault(''),
  city: parseAsString.withDefault(''),
  salary: parseAsInteger,
};

export function OffersFilters() {
  const [filters, setFilters] = useQueryStates(PARSERS, { shallow: false });

  const activeCount =
    (filters.type ? 1 : 0) +
    (filters.mode ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.salary ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Buscador de ofertas (NO de candidatos) */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.q ?? ''}
          onChange={(e) => setFilters({ q: e.target.value })}
          placeholder="Buscar ofertas por puesto, empresa o ubicación…"
          className="h-11 rounded-full border-border/70 bg-muted/40 pl-10 pr-4 text-sm focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Buscar ofertas"
        />
      </div>

      {/* Filtros rápidos (envuelven en vertical; nunca scroll horizontal) */}
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        <FilterGroup
          label="Contrato"
          options={JOB_TYPES}
          value={filters.type ?? ''}
          onChange={(v) => setFilters({ type: v || null })}
        />
        <FilterGroup
          label="Modalidad"
          options={WORK_MODES}
          value={filters.mode ?? ''}
          onChange={(v) => setFilters({ mode: v || null })}
        />
        <FilterGroup
          label="Salario"
          options={SALARY_BANDS.map((s) => ({ value: String(s.value), label: s.label }))}
          value={filters.salary ? String(filters.salary) : ''}
          onChange={(v) => setFilters({ salary: v ? Number(v) : null })}
        />
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => setFilters({ type: null, mode: null, city: null, salary: null })}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" /> Limpiar ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}:
      </span>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? '' : opt.value)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              active
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-primary'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
