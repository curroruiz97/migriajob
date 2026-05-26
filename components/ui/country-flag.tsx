import { cn } from '@/lib/utils';

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', BO: 'Bolivia', BR: 'Brasil', CL: 'Chile', CO: 'Colombia',
  CR: 'Costa Rica', CU: 'Cuba', DO: 'Rep. Dominicana', EC: 'Ecuador',
  SV: 'El Salvador', GT: 'Guatemala', HN: 'Honduras', MX: 'México',
  NI: 'Nicaragua', PA: 'Panamá', PY: 'Paraguay', PE: 'Perú',
  PR: 'Puerto Rico', UY: 'Uruguay', VE: 'Venezuela', ES: 'España',
};

/**
 * Mapping inverso para tolerar valores legacy en BD donde se guardó el
 * nombre completo en lugar del código ISO. Se compara sin acentos.
 *
 * Ejemplo:
 *   country_of_origin = "Perú"    → code = "PE"
 *   country_of_origin = "España"  → code = "ES"
 */
const NAME_TO_CODE: Record<string, string> = {};
for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
  NAME_TO_CODE[normalize(name)] = code;
}
// Alias adicionales para nombres comunes alternativos
NAME_TO_CODE[normalize('República Dominicana')] = 'DO';

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Resuelve el código ISO a partir de un código o nombre completo. */
function resolveCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Caso 1: ya es código ISO de 2 letras → usar tal cual
  if (/^[a-z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();
  // Caso 2: es nombre largo → buscar en el mapa inverso
  return NAME_TO_CODE[normalize(trimmed)] ?? null;
}

export function countryName(code: string | null | undefined): string {
  if (!code) return '';
  const resolved = resolveCode(code);
  if (resolved) return COUNTRY_NAMES[resolved] ?? resolved;
  // Si no podemos mapear, devolvemos el texto original (mejor algo que un código basura)
  return code;
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
  // Acepta tanto código ISO ("PE") como nombre completo ("Perú"). Si el valor
  // no se puede resolver a un código de 2 letras válido, no renderizamos
  // bandera (evita generar emojis basura como 🇵🇪🇷? a partir de "Perú").
  const cc = resolveCode(code);
  if (!cc) return null;

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
