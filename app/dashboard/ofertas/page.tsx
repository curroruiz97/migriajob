import Link from 'next/link';
import { Briefcase, MapPin, Clock, Wallet, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { OffersFilters } from '@/components/employee/offers-filters';

export const metadata = { title: 'Ofertas' };

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Jornada completa',
  part_time: 'Media jornada',
  contract: 'Contrato',
  internship: 'Prácticas',
  freelance: 'Freelance',
};
const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'Presencial',
  hybrid: 'Híbrido',
  remote: 'Remoto',
};

interface JobRow {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  job_type: string;
  work_mode: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  skills: string[] | null;
  company: { name: string } | null;
}

function salaryText(j: JobRow): string | null {
  if (j.salary_min == null && j.salary_max == null) return null;
  const cur = j.currency || '€';
  const fmt = (n: number) => `${(n / 1000).toFixed(0)}k`;
  if (j.salary_min != null && j.salary_max != null)
    return `${fmt(j.salary_min)}–${fmt(j.salary_max)} ${cur}`;
  const n = (j.salary_min ?? j.salary_max) as number;
  return `${fmt(n)}+ ${cur}`;
}

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    mode?: string;
    city?: string;
    salary?: string;
    n?: string;
  }>;
}

export default async function OfertasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const limit = Math.min(Number(params.n) || 20, 100);
  const supabase = await createClient();

  let query = supabase
    .from('jobs')
    .select('id, slug, title, location, job_type, work_mode, salary_min, salary_max, currency, skills, company:companies(name)')
    .eq('status', 'published');

  if (params.q?.trim()) {
    const q = params.q.trim();
    query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%`);
  }
  if (params.type) query = query.eq('job_type', params.type);
  if (params.mode) query = query.eq('work_mode', params.mode);
  if (params.city) query = query.ilike('location', `%${params.city}%`);
  if (params.salary) query = query.gte('salary_max', Number(params.salary));

  const { data } = await query
    .order('published_at', { ascending: false })
    .range(0, limit); // pide uno extra para saber si hay más

  const all = (data ?? []) as unknown as JobRow[];
  const hasMore = all.length > limit;
  const jobs = hasMore ? all.slice(0, limit) : all;

  // Conserva filtros activos para el enlace "Cargar más"
  const moreParams = new URLSearchParams();
  if (params.q) moreParams.set('q', params.q);
  if (params.type) moreParams.set('type', params.type);
  if (params.mode) moreParams.set('mode', params.mode);
  if (params.city) moreParams.set('city', params.city);
  if (params.salary) moreParams.set('salary', params.salary);
  moreParams.set('n', String(limit + 20));

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Ofertas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Empleos publicados por empresas españolas. Encuentra el tuyo.
        </p>
      </div>

      <OffersFilters />

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No hay ofertas que coincidan"
          description="Prueba con otros filtros o limpia la búsqueda."
          className="mt-6"
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => {
            const sal = salaryText(j);
            return (
              <Link
                key={j.id}
                href={`/dashboard/ofertas/${j.slug}`}
                className="card-hover group flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {j.title}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {j.company?.name ?? 'Empresa confidencial'}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
                    {j.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {j.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {JOB_TYPE_LABELS[j.job_type] ?? j.job_type}
                    </span>
                    <Badge variant="soft" className="gap-1 text-[10px]">
                      {WORK_MODE_LABELS[j.work_mode] ?? j.work_mode}
                    </Badge>
                    {sal && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2 py-0.5 font-medium text-primary">
                        <Wallet className="h-3 w-3" /> {sal}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:block" />
              </Link>
            );
          })}

          {hasMore && (
            <div className="pt-2 text-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/dashboard/ofertas?${moreParams.toString()}`}>Cargar más ofertas</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
