import { BadgeCheck, MessageSquare, Sparkles, ArrowUpRight } from 'lucide-react';
import { CountryFlag } from '@/components/ui/country-flag';

/**
 * Mockup visual premium del producto Migria. Sustituye al carrusel de tarjetas.
 * Layout: panel central tipo dashboard + dos badges flotantes + halo de fondo.
 * Inspiración: Linear / Stripe / Vercel hero.
 */
export function HeroFloatingCards() {
  return (
    <div
      className="relative h-[500px] w-full hidden lg:block"
      aria-hidden="true"
      style={{ perspective: '1800px' }}
    >
      {/* Halo radial detrás */}
      <div
        className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl"
        style={{ transform: 'translateZ(-100px) scale(0.9)' }}
      />

      {/* Mockup principal: panel "Talento destacado" */}
      <div
        className="absolute right-0 top-6 w-[380px] rounded-2xl border border-border/80 bg-surface/95 p-5 shadow-2xl backdrop-blur"
        style={{
          transform: 'rotateY(-12deg) rotateX(4deg) translateZ(40px)',
          boxShadow: '0 40px 80px -30px rgba(35,18,11,.35), 0 0 0 1px rgba(255,255,255,.05)',
        }}
      >
        {/* Topbar mock */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive/60" />
            <span className="h-2 w-2 rounded-full bg-warning/60" />
            <span className="h-2 w-2 rounded-full bg-success/60" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">migria.app/admin</span>
        </div>

        {/* Header */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Talento</p>
            <p className="font-display text-lg leading-tight text-foreground">Pipeline activo</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            En vivo
          </span>
        </div>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Vistos', value: '247' },
            { label: 'Entrevista', value: '18' },
            { label: 'Oferta', value: '6' },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-surface-muted/40 p-2 text-center">
              <p className="font-display text-xl text-foreground">{k.value}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Lista candidatos */}
        <div className="mt-4 space-y-2">
          {[
            { name: 'María F. Vargas', role: 'Sr Frontend', country: 'VE', dot: 'bg-success' },
            { name: 'Carlos R. Gómez', role: 'Product Designer', country: 'CO', dot: 'bg-success' },
            { name: 'Diana S. Bravo', role: 'Médica internista', country: 'EC', dot: 'bg-warning' },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-primary-foreground">
                  {c.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                </div>
                <span className="absolute -bottom-1 -right-1 text-sm">
                  <CountryFlag code={c.country} size="sm" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-xs font-semibold text-foreground">{c.name}</p>
                  <BadgeCheck className="h-3 w-3 text-info" fill="currentColor" stroke="white" strokeWidth={2.5} />
                </div>
                <p className="truncate text-[10px] text-muted-foreground">{c.role}</p>
              </div>
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
            </div>
          ))}
        </div>

        {/* Footer mock */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex -space-x-1.5">
            {['VE', 'CO', 'PE', 'AR'].map((c) => (
              <span
                key={c}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-surface ring-2 ring-surface text-xs"
              >
                <CountryFlag code={c} size="xs" />
              </span>
            ))}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground ring-2 ring-surface">
              +9
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-primary">
            Ver todo <ArrowUpRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>

      {/* Badge flotante TOP-LEFT: notificación */}
      <div
        className="absolute left-0 top-0 w-[260px] rounded-xl border border-border bg-surface/95 p-3 shadow-xl backdrop-blur"
        style={{
          transform: 'rotateY(8deg) rotateX(-2deg) translateZ(80px)',
          animation: 'slide-up 800ms cubic-bezier(.22,1,.36,1) 200ms backwards',
        }}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-soft">
            <MessageSquare className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Nuevo mensaje</p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
              <span className="font-medium text-foreground">Carlos R.</span> respondió a tu propuesta.
            </p>
          </div>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      {/* Badge flotante BOTTOM-LEFT: stat con sparkline */}
      <div
        className="absolute left-4 bottom-4 w-[240px] rounded-xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur"
        style={{
          transform: 'rotateY(8deg) rotateX(2deg) translateZ(60px)',
          animation: 'slide-up 800ms cubic-bezier(.22,1,.36,1) 400ms backwards',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Match score</p>
            <p className="font-display text-3xl text-foreground">92%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Mini sparkline SVG */}
        <svg viewBox="0 0 100 30" className="mt-3 h-6 w-full">
          <defs>
            <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,22 L15,18 L30,20 L45,12 L60,15 L75,8 L90,5 L100,3 L100,30 L0,30 Z"
            fill="url(#sparkGrad)"
          />
          <path
            d="M0,22 L15,18 L30,20 L45,12 L60,15 L75,8 L90,5 L100,3"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Halo decorativo TOP-RIGHT */}
      <div
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent-warm/20 blur-3xl"
        style={{ transform: 'translateZ(-50px)' }}
      />
    </div>
  );
}
