import { cn } from '@/lib/utils';

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', BO: 'Bolivia', BR: 'Brasil', CL: 'Chile', CO: 'Colombia',
  CR: 'Costa Rica', CU: 'Cuba', DO: 'Rep. Dominicana', EC: 'Ecuador',
  SV: 'El Salvador', GT: 'Guatemala', HN: 'Honduras', MX: 'México',
  NI: 'Nicaragua', PA: 'Panamá', PY: 'Paraguay', PE: 'Perú',
  PR: 'Puerto Rico', UY: 'Uruguay', VE: 'Venezuela', ES: 'España',
};

export function countryName(code: string | null | undefined): string {
  if (!code) return '';
  return COUNTRY_NAMES[code.toUpperCase()] ?? code;
}

/**
 * Bandera de país como emoji (compatibilidad universal, sin assets externos).
 * code: ISO 3166-1 alpha-2 (AR, CO, VE, MX, ES…).
 */
export function CountryFlag({
  code,
  size = 'md',
  showName = false,
  className,
}: {
  code: string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}) {
  if (!code) return null;
  const cc = code.toUpperCase();
  // Convertir código país a emoji bandera (regional indicator symbols)
  const flag = String.fromCodePoint(
    ...cc.split('').map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );

  const sizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  }[size];

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={sizeClass} aria-hidden="true">{flag}</span>
      {showName && <span className="text-xs text-muted-foreground">{COUNTRY_NAMES[cc] ?? cc}</span>}
    </span>
  );
}
