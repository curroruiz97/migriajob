import Link from 'next/link';
import { Briefcase, MapPin, Clock, Wallet, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { JOBS as CONTENT_JOBS } from '@/lib/content/jobs';
import { Badge } from '@/components/ui/badge';
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
  remote: 'Teletrabajo',
};
// Mapeo del contenido estático (mismo que alimenta migriajob.com/empleos) al enum.
const CONTENT_TYPE: Record<string, string> = {
  'Jornada completa': 'full_time',
  'Media jornada': 'part_time',
  'Por turnos': 'full_time',
};
const CONTENT_MODE: Record<string, string> = {
  Presencial: 'on_site',
  Teletrabajo: 'remote',
  Híbrido: 'hybrid',
};

interface FeedItem {
  slug: string;
  title: string;
  subtitle: string;
  location: string | null;
  jobType: string;
  workMode: string;
  salaryText: string | null;
  salaryMax: number | null;
}

function dbSalary(min: number | null, max: number | null, cur: string | null): string | null {
  if (min == null && max == null) return null;
  const c = cur || '€';
  const f = (n: number) => `${(n / 1000).toFixed(0)}k`;
  if (min != null && max != null) return `${f(min)}–${f(max)} ${c}`;
  return `${f((min ?? max) as number)}+ ${c}`;
}

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string; mode?: string; salary?: string }>;
}

export default async function OfertasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // 1) Ofertas reales publicadas por empresas (tabla jobs)
  const { data: dbData } = await supabase
    .from('jobs')
    .select('slug, title, location, job_type, work_mode, salary_min, salary_max, currency, company:companies(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const dbItems: FeedItem[] = ((dbData ?? []) as unknown as Array<Record<string, unknown>>).map((j) => ({
    slug: j.slug as string,
    title: j.title as string,
    subtitle: ((j.company as { name: string } | null)?.name) ?? 'Empresa confidencial',
    location: (j.location as string | null) ?? null,
    jobType: (j.job_type as string) ?? 'full_time',
    workMode: (j.work_mode as string) ?? 'on_site',
    salaryText: dbSalary(j.salary_min as number | null, j.salary_max as number | null, j.currency as string | null),
    salaryMax: (j.salary_max as number | null) ?? null,
  }));

  // 2) Ofertas curadas (mismo origen que la web) para que NUNCA esté vacío
  const contentItems: FeedItem[] = CONTENT_JOBS.map((j) => ({
    slug: j.slug,
    title: j.title,
    subtitle: j.category,
    location: j.city ?? j.countryName,
    jobType: CONTENT_TYPE[j.type] ?? 'full_time',
    workMode: CONTENT_MODE[j.mode] ?? 'on_site',
    salaryText: j.salary ?? null,
    salaryMax: null,
  }));

  // Merge: primero las de empresas, luego las curadas (sin duplicar slugs)
  const seen = new Set(dbItems.map((i) => i.slug));
  let items = [...dbItems, ...contentItems.filter((i) => !seen.has(i.slug))];

  // Filtros (solo si el usuario los aplica). Por defecto: TODAS.
  const q = (params.q ?? '').toLowerCase().trim();
  if (q) items = items.filter((i) => `${i.title} ${i.subtitle} ${i.location ?? ''}`.toLowerCase().includes(q));
  if (params.type) items = items.filter((i) => i.jobType === params.type);
  if (params.mode) items = items.filter((i) => i.workMode === params.mode);
  if (params.salary) items = items.filter((i) => i.salaryMax == null || i.salaryMax >= Number(params.salary));

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">Ofertas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Empleos activos en empresas españolas. Encuentra el tuyo.
        </p>
      </div>

      <OffersFilters />

      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No hay ofertas que coincidan"
          description="Prueba con otros filtros o limpia la búsqueda."
          className="mt-6"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((j) => (
            <Link
              key={j.slug}
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
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{j.subtitle}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
                  {j.location && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> <span className="truncate max-w-[140px]">{j.location}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {JOB_TYPE_LABELS[j.jobType] ?? j.jobType}
                  </span>
                  <Badge variant="soft" className="gap-1 text-[10px]">
                    {WORK_MODE_LABELS[j.workMode] ?? j.workMode}
                  </Badge>
                  {j.salaryText && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2 py-0.5 font-medium text-primary">
                      <Wallet className="h-3 w-3" /> {j.salaryText}
                    </span>
                  )}
                </div>
              </div>
              <ArrowUpRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:block" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
