import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  FolderOpen,
  Users,
  ChevronRight,
  Building2,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { JOURNEY_STAGES, getStageIndex, getStageProgress } from '@/lib/journey-stages';

export const metadata = { title: 'Expedientes — Control interno' };

type JourneyWithCandidate = {
  id: string;
  candidate_id: string;
  position: string | null;
  employer_company: string | null;
  destination_city: string | null;
  current_stage: string;
  stage_updated_at: string;
  updated_at: string;
  candidates: {
    full_name: string | null;
    email: string | null;
    slug: string | null;
    avatar_url: string | null;
    location_country: string | null;
  } | null;
};

export default async function ExpedientesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verificar que es admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') redirect('/admin');

  // Fetch journeys con datos del candidato
  let query = supabase
    .from('candidate_journey')
    .select('id, candidate_id, position, employer_company, destination_city, current_stage, stage_updated_at, updated_at, candidates(full_name, email, slug, avatar_url, location_country)')
    .order('updated_at', { ascending: false });

  if (params.stage) {
    query = query.eq('current_stage', params.stage as any);
  }

  const { data: journeys } = await query;
  const items = (journeys ?? []) as unknown as JourneyWithCandidate[];

  // Filtrar por búsqueda de texto si aplica
  const filtered = params.q
    ? items.filter((j) => {
        const q = params.q!.toLowerCase();
        return (
          j.candidates?.full_name?.toLowerCase().includes(q) ||
          j.candidates?.email?.toLowerCase().includes(q) ||
          j.position?.toLowerCase().includes(q) ||
          j.employer_company?.toLowerCase().includes(q)
        );
      })
    : items;

  // Contadores por etapa
  const stageCounts = new Map<string, number>();
  for (const j of items) {
    stageCounts.set(j.current_stage, (stageCounts.get(j.current_stage) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Control de expedientes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión interna del equipo Migria. {items.length} expediente{items.length !== 1 && 's'} activo{items.length !== 1 && 's'}.
        </p>
      </div>

      {/* Filtros por etapa */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/expedientes"
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            !params.stage
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-surface text-muted-foreground hover:bg-muted'
          )}
        >
          Todos ({items.length})
        </Link>
        {JOURNEY_STAGES.map((s) => {
          const count = stageCounts.get(s.key) ?? 0;
          if (count === 0 && params.stage !== s.key) return null;
          return (
            <Link
              key={s.key}
              href={`/admin/expedientes?stage=${s.key}`}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                params.stage === s.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted-foreground hover:bg-muted'
              )}
            >
              {s.number}. {s.title.replace(/[¡!]/g, '')} ({count})
            </Link>
          );
        })}
      </div>

      {/* Búsqueda */}
      <form className="flex gap-2">
        <input
          name="q"
          type="search"
          placeholder="Buscar por nombre, email, empresa..."
          defaultValue={params.q ?? ''}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {params.stage && <input type="hidden" name="stage" value={params.stage} />}
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Buscar
        </button>
      </form>

      {/* Lista de expedientes */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Sin expedientes"
          description={params.q ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no hay expedientes creados.'}
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {filtered.map((j) => {
            const stageIdx = getStageIndex(j.current_stage);
            const stageDef = JOURNEY_STAGES[stageIdx];
            const pct = getStageProgress(j.current_stage);

            return (
              <li key={j.id}>
                <Link
                  href={`/admin/expedientes/${j.id}`}
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50"
                >
                  {/* Avatar placeholder */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-sm">
                    {(j.candidates?.full_name ?? 'C')[0].toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {j.candidates?.full_name ?? 'Candidato importado'}
                      </span>
                      <Badge
                        variant={pct === 100 ? 'success' : pct >= 50 ? 'warning' : 'soft'}
                        className="text-[10px] shrink-0"
                      >
                        Etapa {stageDef?.number ?? '?'} · {pct}%
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      {j.employer_company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {j.employer_company}
                        </span>
                      )}
                      {j.position && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {j.position}
                        </span>
                      )}
                      {j.destination_city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {j.destination_city}
                        </span>
                      )}
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          pct === 100 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-primary'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
