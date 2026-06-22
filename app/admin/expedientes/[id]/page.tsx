import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Wallet,
  Calendar,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JOURNEY_STAGES, getStageIndex, getStageProgress } from '@/lib/journey-stages';
import { StageManager } from './stage-manager';
import { PaymentsPanel } from './payments-panel';
import { ObservationsPanel } from './observations-panel';

export const metadata = { title: 'Detalle expediente' };

export default async function ExpedienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') redirect('/admin');

  // Fetch journey
  const { data: journey } = await supabase
    .from('candidate_journey')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!journey) notFound();

  // Fetch candidate info
  const { data: candidate } = await supabase
    .from('candidates')
    .select('full_name, email, phone, slug, avatar_url, location_country, country_of_origin')
    .eq('id', journey.candidate_id)
    .maybeSingle();

  // Fetch stage history
  const { data: stageHistory } = await supabase
    .from('journey_stage_history')
    .select('*')
    .eq('journey_id', id)
    .order('created_at', { ascending: false });

  // Fetch payments
  const { data: payments } = await supabase
    .from('expediente_payments')
    .select('*')
    .eq('journey_id', id)
    .order('created_at', { ascending: false });

  // Fetch receipts
  const { data: receipts } = await supabase
    .from('expediente_receipts')
    .select('*')
    .eq('journey_id', id)
    .order('created_at', { ascending: false });

  // Fetch observations
  const { data: observations } = await supabase
    .from('expediente_observations')
    .select('*')
    .eq('journey_id', id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  const pct = getStageProgress(journey.current_stage);
  const stageIdx = getStageIndex(journey.current_stage);
  const stageDef = JOURNEY_STAGES[stageIdx];

  const candidateName = candidate?.full_name ?? 'Candidato importado';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin/expedientes"
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
              {candidateName}
            </h1>
            <Badge variant={pct === 100 ? 'success' : pct >= 50 ? 'warning' : 'soft'}>
              Etapa {stageDef?.number} · {pct}%
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {stageDef?.title}
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                pct === 100 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-primary'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Datos del candidato y oferta */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Candidato
          </h2>
          <dl className="space-y-2">
            {[
              { icon: User, label: 'Nombre', value: candidate?.full_name },
              { icon: Mail, label: 'Email', value: candidate?.email },
              { icon: Phone, label: 'Teléfono', value: candidate?.phone },
              { icon: MapPin, label: 'País de origen', value: candidate?.country_of_origin },
            ].map((it) => (
              <div key={it.label} className="flex items-center gap-2 text-sm">
                <it.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <dt className="text-muted-foreground w-28 shrink-0">{it.label}:</dt>
                <dd className="font-medium text-foreground">{it.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Oferta
          </h2>
          <dl className="space-y-2">
            {[
              { icon: Briefcase, label: 'Puesto', value: journey.position },
              { icon: Building2, label: 'Empresa', value: journey.employer_company },
              { icon: MapPin, label: 'Ciudad destino', value: journey.destination_city },
              { icon: Wallet, label: 'Salario', value: journey.salary ? `${journey.salary.toLocaleString('es-ES')} €` : null },
              { icon: Calendar, label: 'Inicio gestión', value: journey.start_date ? new Date(journey.start_date).toLocaleDateString('es-ES') : null },
            ].map((it) => (
              <div key={it.label} className="flex items-center gap-2 text-sm">
                <it.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <dt className="text-muted-foreground w-28 shrink-0">{it.label}:</dt>
                <dd className="font-medium text-foreground">{it.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Stage Manager */}
      <StageManager
        journeyId={journey.id}
        currentStage={journey.current_stage}
        stageMessage={journey.stage_message}
        stageHistory={(stageHistory ?? []) as Array<{ id: string; stage: string; notes: string | null; changed_by: string | null; created_at: string }>}
      />

      {/* Payments */}
      <PaymentsPanel
        journeyId={journey.id}
        payments={(payments ?? []) as Array<{ id: string; concept: string; description: string | null; amount: number; currency: string; status: string; due_date: string | null; paid_at: string | null; payment_method: string | null; reference_number: string | null; created_at: string }>}
        receipts={(receipts ?? []) as Array<{ id: string; payment_id: string | null; file_name: string; file_url: string; description: string | null; created_at: string }>}
      />

      {/* Observations */}
      <ObservationsPanel
        journeyId={journey.id}
        observations={(observations ?? []) as Array<{ id: string; category: string; body: string; is_pinned: boolean; created_by: string | null; created_at: string }>}
      />
    </div>
  );
}
