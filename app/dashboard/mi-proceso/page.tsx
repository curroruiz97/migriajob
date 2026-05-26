import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ListChecks,
  IdCard,
  FileSignature,
  PlaneTakeoff,
  Globe2,
  ClipboardList,
  Briefcase,
  Building2,
  MapPin,
  Wallet,
  Calendar,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Mi proceso' };

// Definición de los 5 bloques del PDF interno con sus checks. Cada check
// apunta a una columna booleana o de fecha de la tabla `candidate_journey`.
interface Check {
  key: string;
  label: string;
  /** true si está completado; null si la columna es fecha y devuelve la fecha en label */
  done?: boolean;
  /** Si es fecha, mostramos la fecha como label en vez de check. */
  date?: string | null;
}

interface JourneyRow {
  start_date: string | null;
  position: string | null;
  employer_company: string | null;
  salary: number | null;
  destination_city: string | null;
  doc_dni: boolean;
  doc_passport: boolean;
  doc_criminal_record: boolean;
  doc_medical: boolean;
  doc_precontract: boolean;
  doc_contract: boolean;
  doc_social_security: boolean;
  mig_file_submitted: boolean;
  mig_resolution: boolean;
  mig_visa_started: boolean;
  mig_visa_approved: boolean;
  inc_flight_confirmed: boolean;
  inc_housing_coordinated: boolean;
  inc_travel_date: string | null;
  inc_arrival_date: string | null;
  inc_effective_start: string | null;
  notes: string | null;
  updated_at: string;
}

export default async function MiProcesoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Resuelve el candidato del usuario actual.
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle();
  const candidateId = (candidate as { id?: string } | null)?.id;

  let journey: JourneyRow | null = null;
  if (candidateId) {
    const { data } = await supabase
      .from('candidate_journey')
      .select('*')
      .eq('candidate_id', candidateId)
      .maybeSingle();
    journey = (data as JourneyRow | null) ?? null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Mi proceso
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Seguimiento paso a paso de tu candidatura y de la documentación legal para trabajar
          en España. El equipo de Migria actualiza esta información a medida que avanzas.
        </p>
      </div>

      {!journey ? (
        <EmptyState
          icon={ListChecks}
          title="Aún no tienes proceso abierto"
          description="Cuando una empresa te seleccione y empecemos a tramitar tu incorporación, este apartado mostrará el estado de cada paso (documentación, visado, viaje…)."
          action={
            <Button asChild>
              <Link href="/dashboard/ofertas">Ver ofertas</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Resumen global */}
          <SummaryCard journey={journey} />

          {/* Bloque 1 — Información base */}
          <BlockCard
            title="Información de la oferta"
            subtitle="Datos del puesto al que has sido seleccionado"
            icon={Briefcase}
            tone="primary"
          >
            <InfoGrid
              items={[
                { icon: Calendar, label: 'Inicio de gestión', value: fmtDate(journey.start_date) },
                { icon: Briefcase, label: 'Puesto', value: journey.position },
                { icon: Building2, label: 'Empresa', value: journey.employer_company },
                {
                  icon: Wallet,
                  label: 'Salario',
                  value: journey.salary != null ? `${journey.salary.toLocaleString('es-ES')} €/año` : null,
                },
                { icon: MapPin, label: 'Ciudad destino', value: journey.destination_city },
              ]}
            />
          </BlockCard>

          {/* Bloque 2 */}
          <BlockCard
            title="Documentación personal"
            subtitle="Documentos básicos para iniciar el expediente"
            icon={IdCard}
            tone="warning"
            checks={[
              { key: 'doc_dni', label: 'DNI', done: journey.doc_dni },
              { key: 'doc_passport', label: 'Pasaporte', done: journey.doc_passport },
              { key: 'doc_criminal_record', label: 'Certificado de antecedentes penales', done: journey.doc_criminal_record },
              { key: 'doc_medical', label: 'Evaluación médica', done: journey.doc_medical },
            ]}
          />

          {/* Bloque 3 */}
          <BlockCard
            title="Documentación contractual"
            subtitle="Compromiso laboral con la empresa española"
            icon={FileSignature}
            tone="info"
            checks={[
              { key: 'doc_precontract', label: 'Precontrato', done: journey.doc_precontract },
              { key: 'doc_contract', label: 'Contrato legal firmado', done: journey.doc_contract },
              { key: 'doc_social_security', label: 'Alta en Seguridad Social', done: journey.doc_social_security },
            ]}
          />

          {/* Bloque 4 */}
          <BlockCard
            title="Proceso migratorio"
            subtitle="Visado y autorización de residencia y trabajo"
            icon={Globe2}
            tone="accent"
            checks={[
              { key: 'mig_file_submitted', label: 'Expediente ingresado en extranjería', done: journey.mig_file_submitted },
              { key: 'mig_resolution', label: 'Resolución de extranjería', done: journey.mig_resolution },
              { key: 'mig_visa_started', label: 'Visado iniciado', done: journey.mig_visa_started },
              { key: 'mig_visa_approved', label: 'Visado aprobado', done: journey.mig_visa_approved },
            ]}
          />

          {/* Bloque 5 */}
          <BlockCard
            title="Incorporación"
            subtitle="Llegada a España y comienzo del puesto"
            icon={PlaneTakeoff}
            tone="success"
            checks={[
              { key: 'inc_flight_confirmed', label: 'Vuelo confirmado', done: journey.inc_flight_confirmed },
              { key: 'inc_housing_coordinated', label: 'Vivienda coordinada', done: journey.inc_housing_coordinated },
              { key: 'inc_travel_date', label: 'Fecha de viaje', date: journey.inc_travel_date },
              { key: 'inc_arrival_date', label: 'Fecha de llegada', date: journey.inc_arrival_date },
              { key: 'inc_effective_start', label: 'Incorporación efectiva', date: journey.inc_effective_start },
            ]}
          />

          {/* Observaciones */}
          {journey.notes && (
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ClipboardList className="h-4 w-4 text-primary" />
                Observaciones del equipo Migria
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
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function SummaryCard({ journey }: { journey: JourneyRow }) {
  const checks = [
    journey.doc_dni, journey.doc_passport, journey.doc_criminal_record, journey.doc_medical,
    journey.doc_precontract, journey.doc_contract, journey.doc_social_security,
    journey.mig_file_submitted, journey.mig_resolution, journey.mig_visa_started, journey.mig_visa_approved,
    journey.inc_flight_confirmed, journey.inc_housing_coordinated,
  ];
  const dateChecks = [journey.inc_travel_date, journey.inc_arrival_date, journey.inc_effective_start];
  const totalSteps = checks.length + dateChecks.length;
  const done = checks.filter(Boolean).length + dateChecks.filter((d) => !!d).length;
  const pct = totalSteps > 0 ? Math.round((done / totalSteps) * 100) : 0;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Progreso general</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {done} de {totalSteps} pasos completados
          </p>
        </div>
        <Badge variant={pct >= 80 ? 'success' : pct >= 40 ? 'warning' : 'soft'}>
          {pct}%
        </Badge>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full transition-all duration-500',
            pct >= 80 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </section>
  );
}

function BlockCard({
  title,
  subtitle,
  icon: Icon,
  tone,
  checks,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'primary' | 'warning' | 'info' | 'accent' | 'success';
  checks?: Check[];
  children?: React.ReactNode;
}) {
  const toneClass = {
    primary: 'bg-primary-soft text-primary',
    warning: 'bg-warning-soft text-warning',
    info: 'bg-info-soft text-info',
    accent: 'bg-accent-warm/15 text-accent-warm',
    success: 'bg-success-soft text-success',
  }[tone];

  const total = checks ? checks.length : 0;
  const completed = checks
    ? checks.filter((c) => (c.date !== undefined ? !!c.date : !!c.done)).length
    : 0;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <header className="flex items-start gap-3">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', toneClass)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {checks && (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {completed}/{total}
          </span>
        )}
      </header>

      <div className="mt-4">
        {checks ? (
          <ul className="space-y-2">
            {checks.map((c) => {
              const done = c.date !== undefined ? !!c.date : !!c.done;
              return (
                <li
                  key={c.key}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors',
                    done && 'border-success/30 bg-success-soft/30'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                    )}
                    <span
                      className={cn(
                        'text-sm',
                        done ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {c.label}
                    </span>
                  </div>
                  {c.date !== undefined && c.date && (
                    <span className="shrink-0 text-xs font-medium text-success">
                      {fmtDate(c.date)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string | null }>;
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
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
  );
}
