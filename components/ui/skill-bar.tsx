import { cn } from '@/lib/utils';

type Level = 'basic' | 'medium' | 'advanced' | 'expert';

const LEVEL_LABEL: Record<Level, string> = {
  basic: 'Básico',
  medium: 'Medio',
  advanced: 'Avanzado',
  expert: 'Experto',
};

const LEVEL_PERCENT: Record<Level, number> = {
  basic: 25,
  medium: 50,
  advanced: 75,
  expert: 100,
};

export function SkillBar({
  skill,
  level,
  years,
  className,
}: {
  skill: string;
  level: Level;
  years?: number | null;
  className?: string;
}) {
  const pct = LEVEL_PERCENT[level];
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{skill}</span>
        <span className="text-xs text-muted-foreground">
          {LEVEL_LABEL[level]}
          {years ? ` · ${years} ${years === 1 ? 'año' : 'años'}` : ''}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
