import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ListChecks,
  Trophy,
  FileText,
  Send,
  ClipboardCheck,
  Search,
  Handshake,
  Clock,
  CheckCircle,
  Building,
  Plane,
  PartyPopper,
  Briefcase,
  Building2,
  MapPin,
  Wallet,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { JOURNEY_STAGES, getStageIndex, getStageProgress } from '@/lib/journey-stages';

export const metadata = { title: 'Mi proceso' };

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy, FileText, Send, ClipboardCheck, Search,
  Handshake, Clock, CheckCircle, Building, Plane, PartyPopper,
};

interface JourneyRow {
  id: string;
  candidate_id: string;
  start_date: string | null;
  position: string | null;
  employer_company: string | null;
  salary: number | null;
  destination_city: string | null;
  current_stage: string;
  stage_updated_at: string;
  stage_message: string | null;
  notes: string | null;
  updated_at: string;
}

interface StageHistoryRow {
  id: string;
  stage: string;
  notes: string | null;
  created_at: string;
}

export default async function MiProcesoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle();
  const candidateId = (candidate as { id?: string } | null)?.id;

  let journey: JourneyRow | null = null;
  let stageHistory: StageHistoryRow[] = [];

  if (candidateId) {
    const { data } = await supabase
      .from('candidate_journey')
      .select('id, candidate_id, start_date, position, employer_company, salary, destination_city, current_stage, stage_updated_at, stage_message, notes, updated_at')
      .eq('candidate_id', candidateId)
      .maybeSingle();
    journey = (data as JourneyRow | null) ?? null;

    if (journey) {
      const { data: history } = await supabase
        .from('journey_stage_history')
        .select('id, stage, notes, created_at')
        .eq('journey_id', journey.id)
        .order('created_at', { ascending: true });
      stageHistory = (history as StageHistoryRow[] | null) ?? [];
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Mi proceso
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Seguimiento en tiempo real de tu proceso migratorio. El equipo de Migria actualiza
          cada etapa a medida que avanzas.
        </p>
      </div>

      {!journey ? (
        <EmptyState
          icon={ListChecks}
          title="Aún no tienes proceso abierto"
          description="Cuando una empresa te seleccione y empecemos a tramitar tu incorporación, este apartado mostrará el estado de cada etapa."
          action={
            <Button asChild>
              <Link href="/dashboard/ofertas">Ver ofertas</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Progress bar global */}
          <ProgressHeader journey={journey} />

          {/* Info de la oferta */}
          {(journey.position || journey.employer_company) && (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                Tu oferta
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Calendar, label: 'Inicio de gestión', value: fmtDate(journey.start_date) },
                  { icon: Briefcase, label: 'Puesto', value: journey.position },
                  { icon: Building2, label: 'Empresa', value: journey.employer_company },
                  {
                    icon: Wallet,
                    label: 'Salario',
                    value: journey.salary != null ? `${journey.salary.toLocaleString('es-ES')} €/año` : null,
                  },
                  { icon: MapPin, label: 'Ciudad destino', value: journey.destination_city },
                ].map((it) => (
                  <div key={it.label} className="flex items-start gap-2 rounded-xl border border-border bg-surface-muted/30 p-3">
                    <it.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.label}</dt>
                      <dd className={cn('mt-0.5 text-sm', it.value ? 'font-medium text-foreground' : 'text-muted-foreground/60')}>
                        {it.value ?? '—'}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Timeline de 11 etapas */}
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-5 text-sm font-semibold text-foreground">Etapas del proceso</h2>
            <Timeline currentStage={journey.current_stage} stageMessage={journey.stage_message} stageHistory={stageHistory} />
          </section>

          {/* Observaciones del equipo */}
          {journey.notes && (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Mensaje del equipo Migria
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {journey.notes}
              </p>
            </section>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Última actualización: {fmtDate(journey.updated_at) ?? '—'}
          </p>
        </>
      )}
    </div>
  );
}

/* ──────────────── helpers ──────────────── */

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function ProgressHeader({ journey }: { journey: JourneyRow }) {
  const currentIdx = getStageIndex(journey.current_stage);
  const pct = getStageProgress(journey.current_stage);
  const currentDef = JOURNEY_STAGES[currentIdx];
  const isComplete = journey.current_stage === 'bienvenido';

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {isComplete ? '¡Proceso completado!' : 'Progreso general'}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Etapa {currentDef?.number ?? 1} de {JOURNEY_STAGES.length}
            {currentDef && ` — ${currentDef.title}`}
          </p>
        </div>
        <Badge variant={isComplete ? 'success' : pct >= 50 ? 'warning' : 'soft'}>
          {pct}%
        </Badge>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            isComplete ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </section>
  );
}

function Timeline({
  currentStage,
  stageMessage,
  stageHistory,
}: {
  currentStage: string;
  stageMessage: string | null;
  stageHistory: StageHistoryRow[];
}) {
  const currentIdx = getStageIndex(currentStage);
  const historyMap = new Map<string, StageHistoryRow>();
  for (const h of stageHistory) {
    historyMap.set(h.stage, h);
  }

  return (
    <ol className="relative space-y-0">
      {JOURNEY_STAGES.map((stage, i) => {
        const isPast = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isFuture = i > currentIdx;
        const isLast = i === JOURNEY_STAGES.length - 1;
        const IconComp = STAGE_ICONS[stage.icon] ?? Circle;
        const historyEntry = historyMap.get(stage.key);

        return (
          <li key={stage.key} className="relative flex gap-4">
            {/* Vertical line connector */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[19px] top-10 w-0.5 -bottom-0',
                  isPast ? 'bg-success' : isCurrent ? 'bg-gradient-to-b from-primary to-muted' : 'bg-muted'
                )}
              />
            )}

            {/* Circle / icon */}
            <div className="relative z-10 flex shrink-0">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  isPast && 'border-success bg-success text-white',
                  isCurrent && 'border-primary bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/10',
                  isFuture && 'border-muted bg-surface text-muted-foreground/40'
                )}
              >
                {isPast ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <IconComp className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={cn('flex-1 pb-8', isLast && 'pb-0')}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase tracking-wider',
                        isPast && 'text-success',
                        isCurrent && 'text-primary',
                        isFuture && 'text-muted-foreground/50'
                      )}
                    >
                      Etapa {stage.number}
                    </span>
                    {isCurrent && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        Actual
                      </Badge>
                    )}
                    {isPast && (
                      <Badge variant="success" className="text-[10px] px-1.5 py-0">
                        Completada
                      </Badge>
                    )}
                  </div>
                  <h3
                    className={cn(
                      'mt-0.5 text-sm font-semibold',
                      isPast && 'text-foreground',
                      isCurrent && 'text-foreground',
                      isFuture && 'text-muted-foreground/60'
                    )}
                  >
                    {stage.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-0.5 text-xs',
                      isFuture ? 'text-muted-foreground/40' : 'text-muted-foreground'
                    )}
                  >
                    {stage.subtitle}
                  </p>
                </div>
                {historyEntry && (
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {fmtDate(historyEntry.created_at)}
                  </span>
                )}
              </div>

              {/* Expanded content for current stage */}
              {isCurrent && (
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary-soft/30 p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {stageMessage ?? stage.description}
                  </p>
                </div>
              )}

              {/* History note if present */}
              {isPast && historyEntry?.notes && (
                <p className="mt-1 text-xs italic text-muted-foreground">
                  {historyEntry.notes}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
