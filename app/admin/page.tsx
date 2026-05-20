import Link from 'next/link';
import {
  Eye, MessageCircle, Workflow, UserCheck, ArrowUpRight,
  TrendingUp, Users, Sparkles, Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEmployerMetrics } from '@/lib/db/queries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const metrics = await getEmployerMetrics(user!.id).catch(() => ({
    favoritesCount: 0,
    totalCandidates: 0,
    pipeline: { new: 0, contacted: 0, interview: 0, offer: 0, hired: 0, rejected: 0 },
  }));

  const totalActive =
    metrics.pipeline.new + metrics.pipeline.contacted +
    metrics.pipeline.interview + metrics.pipeline.offer;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">¡Buenas, Francisco!</p>
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Tu centro de mando.
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/candidatos">
              <Search className="mr-1.5 h-4 w-4" /> Buscar talento
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/procesos">
              <Workflow className="mr-1.5 h-4 w-4" /> Ver pipeline
            </Link>
          </Button>
        </div>
      </div>

      {/* BENTO GRID — KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard icon={Eye} label="Favoritos guardados" value={metrics.favoritesCount} hint="perfiles" trend={+12} />
        <KpiCard icon={MessageCircle} label="Contactados" value={metrics.pipeline.contacted} hint="en conversación" trend={+3} />
        <KpiCard icon={Workflow} label="En proceso" value={totalActive} hint="candidatos activos" trend={+5} />
        <KpiCard icon={UserCheck} label="Contratados" value={metrics.pipeline.hired} hint="este mes" tone="success" trend={+1} />
      </div>

      {/* BENTO — pipeline + actividad */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Embudo de pipeline */}
        <section className="card-hover lg:col-span-2 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Embudo de selección</h2>
              <p className="mt-1 text-xs text-muted-foreground">Visualiza dónde se queda atascado tu pipeline</p>
            </div>
            <Link href="/admin/procesos" className="text-xs text-primary hover:underline">
              Ver kanban →
            </Link>
          </div>

          <div className="mt-6 space-y-2">
            {[
              { key: 'new', label: 'Nuevo', count: metrics.pipeline.new, total: 100 },
              { key: 'contacted', label: 'Contactado', count: metrics.pipeline.contacted, total: 100 },
              { key: 'interview', label: 'Entrevista', count: metrics.pipeline.interview, total: 100 },
              { key: 'offer', label: 'Oferta', count: metrics.pipeline.offer, total: 100 },
              { key: 'hired', label: 'Contratado', count: metrics.pipeline.hired, total: 100 },
            ].map((stage, idx) => {
              const max = Math.max(metrics.pipeline.new, metrics.pipeline.contacted, metrics.pipeline.interview, metrics.pipeline.offer, metrics.pipeline.hired, 1);
              const pct = (stage.count / max) * 100;
              const colors = ['bg-muted-foreground/30', 'bg-info', 'bg-primary', 'bg-warning', 'bg-success'];
              return (
                <div key={stage.key} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-muted-foreground">{stage.label}</span>
                  <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted/50">
                    <div
                      className={`h-full transition-all ${colors[idx]}`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 text-sm font-medium text-foreground">
                      {stage.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mercado disponible */}
        <section className="card-hover rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-surface to-accent/5 p-6">
          <div className="flex items-center justify-between">
            <Badge variant="soft">
              <Sparkles className="mr-1 h-3 w-3" /> Mercado
            </Badge>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
            Talento latino disponible
          </p>
          <div className="mt-3 font-display text-5xl text-foreground">
            <AnimatedCounter value={metrics.totalCandidates} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            profesionales públicos esperando ser descubiertos
          </p>
          <Button variant="outline" size="sm" asChild className="mt-5 w-full">
            <Link href="/admin/busqueda-avanzada">
              Búsqueda avanzada <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </section>
      </div>

      {/* TIP */}
      <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-5">
        <p className="text-sm text-foreground">
          <strong>💡 Consejo:</strong> Los empleadores que guardan filtros activan alertas automáticas
          y reciben notificación en cuanto un nuevo perfil cumple sus criterios.{' '}
          <Link href="/admin/busqueda-avanzada" className="text-primary underline">
            Crear primera búsqueda guardada →
          </Link>
        </p>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, hint, tone, trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
  tone?: 'success' | 'default';
  trend?: number;
}) {
  return (
    <div className="card-hover rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={tone === 'success' ? 'h-4 w-4 text-success' : 'h-4 w-4 text-muted-foreground'} />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">
          <AnimatedCounter value={value} />
        </span>
        {trend != null && trend > 0 && (
          <span className="inline-flex items-center text-xs text-success">
            <TrendingUp className="mr-0.5 h-3 w-3" />+{trend}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
