import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Kind = 'search' | 'inbox' | 'favorites' | 'pipeline' | 'celebrate' | 'plant';

const ILLUSTRATIONS: Record<Kind, ReactNode> = {
  search: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <circle cx="80" cy="70" r="42" stroke="hsl(var(--primary))" strokeWidth="3" />
      <line x1="115" y1="105" x2="155" y2="145" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" />
      <circle cx="68" cy="60" r="6" fill="hsl(var(--accent-warm))" />
      <circle cx="92" cy="60" r="6" fill="hsl(var(--accent-warm))" />
      <path d="M 70 82 Q 80 92 90 82" stroke="hsl(var(--accent-warm))" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="180" cy="30" r="4" fill="hsl(var(--accent))" opacity="0.4" />
      <circle cx="20" cy="120" r="3" fill="hsl(var(--accent-warm))" opacity="0.5" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <path d="M40 60 L160 60 L160 130 L40 130 Z" stroke="hsl(var(--primary))" strokeWidth="3" fill="hsl(var(--primary-soft))" />
      <path d="M40 60 L100 100 L160 60" stroke="hsl(var(--primary))" strokeWidth="3" />
      <circle cx="100" cy="40" r="14" fill="hsl(var(--success))" />
      <path d="M93 40 L99 46 L108 36" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  favorites: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <path
        d="M100 130 L60 90 C 40 70 50 40 75 50 C 90 55 100 70 100 70 C 100 70 110 55 125 50 C 150 40 160 70 140 90 Z"
        fill="hsl(var(--primary-soft))"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="160" cy="40" r="3" fill="hsl(var(--accent))" />
      <circle cx="40" cy="110" r="3" fill="hsl(var(--accent-warm))" />
      <circle cx="170" cy="110" r="2" fill="hsl(var(--primary))" />
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <rect x="20" y="40" width="40" height="100" rx="6" fill="hsl(var(--muted))" />
      <rect x="80" y="40" width="40" height="100" rx="6" fill="hsl(var(--info-soft))" />
      <rect x="140" y="40" width="40" height="100" rx="6" fill="hsl(var(--success-soft))" />
      <rect x="28" y="50" width="24" height="14" rx="3" fill="white" />
      <rect x="28" y="70" width="24" height="14" rx="3" fill="white" />
      <rect x="88" y="50" width="24" height="14" rx="3" fill="white" />
    </svg>
  ),
  celebrate: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <circle cx="100" cy="90" r="35" fill="hsl(var(--accent-warm))" opacity="0.3" />
      <text x="100" y="100" textAnchor="middle" fontSize="40">🎉</text>
      <line x1="40" y1="40" x2="50" y2="50" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      <line x1="160" y1="40" x2="150" y2="50" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="80" r="3" fill="hsl(var(--primary))" />
      <circle cx="170" cy="100" r="3" fill="hsl(var(--accent-warm))" />
    </svg>
  ),
  plant: (
    <svg viewBox="0 0 200 160" fill="none" className="h-32 w-32">
      <path d="M80 130 L120 130 L115 150 L85 150 Z" fill="hsl(var(--primary))" />
      <line x1="100" y1="60" x2="100" y2="130" stroke="hsl(var(--success))" strokeWidth="3" />
      <ellipse cx="80" cy="80" rx="20" ry="12" fill="hsl(var(--success))" transform="rotate(-30 80 80)" />
      <ellipse cx="120" cy="80" rx="20" ry="12" fill="hsl(var(--success))" transform="rotate(30 120 80)" />
      <ellipse cx="100" cy="60" rx="18" ry="14" fill="hsl(var(--success))" />
    </svg>
  ),
};

interface IllustratedEmptyProps {
  kind?: Kind;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function IllustratedEmpty({
  kind = 'search', title, description, action, className,
}: IllustratedEmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted/40 px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-4">{ILLUSTRATIONS[kind]}</div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
