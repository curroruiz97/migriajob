import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Badge tipo "Twitter verified" — perfil verificado por Migria.
 */
export function VerifiedBadge({
  size = 'md',
  className,
  showLabel = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}) {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-info',
        showLabel && 'rounded-full bg-info-soft px-2 py-0.5 text-xs font-medium',
        className
      )}
      title="Perfil verificado por Migria"
    >
      <BadgeCheck className={sizeMap[size]} fill="currentColor" stroke="white" strokeWidth={2.5} />
      {showLabel && <span>Verificado</span>}
    </span>
  );
}
