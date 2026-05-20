import { cn } from '@/lib/utils';
import { CountryFlag } from './country-flag';

const LANG_TO_FLAG: Record<string, string> = {
  es: 'ES', en: 'GB', fr: 'FR', de: 'DE', it: 'IT', pt: 'PT', ca: 'ES',
  zh: 'CN', ja: 'JP', ar: 'SA', ru: 'RU',
};

const LANG_NAMES: Record<string, string> = {
  es: 'Español', en: 'Inglés', fr: 'Francés', de: 'Alemán', it: 'Italiano',
  pt: 'Portugués', ca: 'Catalán', zh: 'Chino', ja: 'Japonés', ar: 'Árabe', ru: 'Ruso',
};

const LEVEL_TONE: Record<string, string> = {
  native: 'bg-success-soft text-success',
  C2: 'bg-success-soft text-success',
  C1: 'bg-success-soft text-success',
  B2: 'bg-info-soft text-info',
  B1: 'bg-info-soft text-info',
  A2: 'bg-warning-soft text-warning',
  A1: 'bg-warning-soft text-warning',
};

export function LanguageChip({
  code,
  level,
  className,
}: {
  code: string;
  level: string;
  className?: string;
}) {
  const flagCode = LANG_TO_FLAG[code.toLowerCase()] ?? code.toUpperCase();
  const name = LANG_NAMES[code.toLowerCase()] ?? code.toUpperCase();
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1',
        className
      )}
    >
      <CountryFlag code={flagCode} size="sm" />
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', LEVEL_TONE[level] ?? 'bg-muted text-muted-foreground')}>
        {level === 'native' ? 'NATIVO' : level}
      </span>
    </div>
  );
}
