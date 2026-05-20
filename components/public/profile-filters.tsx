'use client';

import { useQueryStates, parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';
import { Search, X, MapPin, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CountryFlag } from '@/components/ui/country-flag';

const PARSERS = {
  q: parseAsString.withDefault(''),
  city: parseAsString.withDefault(''),
  availability: parseAsString.withDefault(''),
  expMin: parseAsInteger,
  salaryMin: parseAsInteger,
  countryOrigin: parseAsString.withDefault(''),
  workPermit: parseAsString.withDefault(''),
  hasNie: parseAsBoolean.withDefault(false),
  verified: parseAsBoolean.withDefault(false),
  inSpain: parseAsBoolean.withDefault(false),
};

const COUNTRIES_LATAM = [
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DO', name: 'Rep. Dominicana' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'MX', name: 'México' },
  { code: 'PE', name: 'Perú' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
];

export function ProfileFilters() {
  const [filters, setFilters] = useQueryStates(PARSERS, { shallow: false });

  const reset = () =>
    setFilters({
      q: '', city: '', availability: '', expMin: null, salaryMin: null,
      countryOrigin: '', workPermit: '', hasNie: false, verified: false, inSpain: false,
    });

  const activeCount = Object.entries(filters).filter(
    ([, v]) => v != null && v !== '' && v !== false
  ).length;

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="xs" onClick={reset} className="gap-1 text-xs">
            <X className="h-3 w-3" />
            Limpiar ({activeCount})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="q" className="text-xs">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="q"
            value={filters.q ?? ''}
            onChange={(e) => setFilters({ q: e.target.value })}
            placeholder="React, Médico, Diseño…"
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs">País de origen</Label>
        <div className="grid grid-cols-2 gap-1">
          {COUNTRIES_LATAM.map((c) => {
            const active = filters.countryOrigin === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setFilters({ countryOrigin: active ? '' : c.code })}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <CountryFlag code={c.code} size="sm" />
                <span className="truncate">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Documentación
        </Label>

        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
          <input
            type="checkbox"
            checked={filters.inSpain ?? false}
            onChange={(e) => setFilters({ inSpain: e.target.checked || null })}
            className="h-3.5 w-3.5 accent-primary"
          />
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          Ya están en España
        </label>

        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
          <input
            type="checkbox"
            checked={filters.hasNie ?? false}
            onChange={(e) => setFilters({ hasNie: e.target.checked || null })}
            className="h-3.5 w-3.5 accent-primary"
          />
          NIE vigente
        </label>

        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
          <input
            type="checkbox"
            checked={filters.verified ?? false}
            onChange={(e) => setFilters({ verified: e.target.checked || null })}
            className="h-3.5 w-3.5 accent-primary"
          />
          <BadgeCheck className="h-3.5 w-3.5 text-info" />
          Solo verificados
        </label>

        <div className="space-y-1.5 pt-2">
          <Label className="text-xs text-muted-foreground">Permiso de trabajo</Label>
          {[
            { value: '', label: 'Cualquiera' },
            { value: 'eu_citizen', label: 'Ciudadanía UE' },
            { value: 'permanent', label: 'Permanente' },
            { value: 'temporary', label: 'Temporal vigente' },
            { value: 'in_application', label: 'En trámite' },
          ].map((opt) => (
            <label
              key={opt.value || 'any'}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted"
            >
              <input
                type="radio"
                name="workPermit"
                checked={(filters.workPermit ?? '') === opt.value}
                onChange={() => setFilters({ workPermit: opt.value || null })}
                className="h-3.5 w-3.5 accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs">Disponibilidad</Label>
        <div className="space-y-1">
          {[
            { value: '', label: 'Cualquiera' },
            { value: 'open', label: 'Disponible ahora' },
            { value: 'passive', label: 'Abierto a oportunidades' },
          ].map((opt) => (
            <label
              key={opt.value || 'any'}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted"
            >
              <input
                type="radio"
                name="availability"
                checked={(filters.availability ?? '') === opt.value}
                onChange={() => setFilters({ availability: opt.value || null })}
                className="h-3.5 w-3.5 accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="city" className="text-xs">Ciudad en España</Label>
        <Input
          id="city"
          value={filters.city ?? ''}
          onChange={(e) => setFilters({ city: e.target.value })}
          placeholder="Madrid, Barcelona…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expMin" className="text-xs">Experiencia mínima (años)</Label>
        <Input
          id="expMin"
          type="number"
          min={0}
          max={40}
          value={filters.expMin ?? ''}
          onChange={(e) => setFilters({ expMin: e.target.value ? Number(e.target.value) : null })}
          placeholder="3"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salaryMin" className="text-xs">Salario mínimo (€)</Label>
        <Input
          id="salaryMin"
          type="number"
          min={0}
          step={1000}
          value={filters.salaryMin ?? ''}
          onChange={(e) => setFilters({ salaryMin: e.target.value ? Number(e.target.value) : null })}
          placeholder="35000"
        />
      </div>
    </div>
  );
}
