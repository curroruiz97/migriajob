import Link from 'next/link';
import {
  Search,
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Empleos disponibles | Migria',
  description:
    'Ofertas reales publicadas por empresas españolas: hostelería, industria, logística, mantenimiento y más.',
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Proceso legal completo' },
  { icon: Sparkles, label: 'Formación y acompañamiento' },
  { icon: Briefcase, label: 'Contratación en origen' },
];

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Jornada completa',
  part_time: 'Media jornada',
  contract: 'Contrato',
  internship: 'Prácticas',
  freelance: 'Freelance',
};
const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'Presencial', hybrid: 'Híbrido', remote: 'Teletrabajo',
};

interface JobRow {
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  job_type: string | null;
  work_mode: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  company: { name: string } | null;
}

function salaryText(min: number | null, max: number | null, cur: string | null): string | null {
  if (min == null && max == null) return null;
  const sym = !cur || cur === 'EUR' ? '€' : cur;
  const f = (n: number) => new Intl.NumberFormat('es-ES').format(n);
  if (min != null && max != null) return `${f(min)}–${f(max)} ${sym}/mes`;
  if (min != null) return `Desde ${f(min)} ${sym}/mes`;
  return `Hasta ${f(max as number)} ${sym}/mes`;
}

export default async function EmpleosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? '').toLowerCase().trim();

  const supabase = await createClient();
  const { data } = await supabase
    .from('jobs')
    .select('slug, title, description, location, job_type, work_mode, salary_min, salary_max, currency, company:companies(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const jobs: JobRow[] = (data ?? []) as unknown as JobRow[];

  const filtered = q
    ? jobs.filter((j) =>
        `${j.title} ${j.location ?? ''} ${j.description ?? ''} ${j.company?.name ?? ''}`
          .toLowerCase()
          .includes(q)
      )
    : jobs;

  const totalJobs = jobs.length;

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <Container size="xl" className="relative py-16 lg:py-20">
          <div>
            <Badge variant="soft" className="mb-5">
              <Zap className="mr-1 h-3 w-3" />
              {filtered.length} {filtered.length === 1 ? 'oferta activa' : 'ofertas activas'}
            </Badge>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Empleos <em className="text-gradient-primary not-italic">listos</em>{' '}
              para tu siguiente paso.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ofertas reales publicadas por empresas españolas.{' '}
              <strong className="text-foreground">Sin coste para el candidato</strong>.
            </p>

            <form
              action="/empleos"
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-surface p-1.5 shadow-md"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Cocinero, camarero, técnico, mozo de almacén…"
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="sm" className="rounded-full px-5">
                Buscar
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {HIGHLIGHTS.map((h) => (
                <span key={h.label} className="inline-flex items-center gap-1.5">
                  <h.icon className="h-3.5 w-3.5 text-primary" />
                  {h.label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* LISTADO */}
      <section className="border-b border-border bg-background py-16">
        <Container size="xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Badge variant="outline" className="mb-3">
                Ofertas activas
              </Badge>
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Empleos <em className="text-gradient-primary not-italic">activos</em> ahora mismo.
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {filtered.length === 0
                  ? 'No hay ofertas para esa búsqueda.'
                  : `Mostrando ${filtered.length} de ${totalJobs} ofertas.`}
              </p>
            </div>
            <Link
              href="/registro?role=candidate"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
            >
              Crear mi perfil <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {totalJobs === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface-muted/40 p-16 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="font-display mt-4 text-2xl text-foreground">
                Aún no hay ofertas publicadas
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Las empresas están preparando sus procesos. Crea tu perfil para que te
                contacten en cuanto haya vacantes.
              </p>
              <Button asChild className="mt-5">
                <Link href="/registro?role=candidate">Crear mi perfil</Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface-muted/40 p-16 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="font-display mt-4 text-2xl text-foreground">
                Sin resultados para tu búsqueda
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">Prueba con otras palabras.</p>
              <Button asChild variant="outline" className="mt-5">
                <Link href="/empleos">Ver todas las ofertas</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j) => (
                <Link
                  key={j.slug}
                  href={`/empleos/${j.slug}`}
                  className="card-hover group flex h-full flex-col rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    {j.company?.name && (
                      <Badge variant="soft" className="shrink-0 text-[10px]">
                        {j.company.name}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                    {j.title}
                  </h3>
                  {j.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {j.description}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4 text-[11px]">
                    {j.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {j.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2 py-0.5 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {JOB_TYPE_LABELS[j.job_type ?? ''] ?? '—'}
                    </span>
                    <Badge variant="soft" className="gap-1 text-[10px]">
                      {WORK_MODE_LABELS[j.work_mode ?? ''] ?? '—'}
                    </Badge>
                    {salaryText(j.salary_min, j.salary_max, j.currency) && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2 py-0.5 font-medium text-primary">
                        <Wallet className="h-3 w-3" /> {salaryText(j.salary_min, j.salary_max, j.currency)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-muted-foreground">
            ¿No encuentras tu oferta?{' '}
            <Link
              href="/registro?role=candidate"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Crea tu perfil
            </Link>{' '}
            y las empresas te encontrarán.
          </div>
        </Container>
      </section>

      {/* CTA */}
      <Container size="xl" className="py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <Sparkles className="mx-auto h-10 w-10" />
            <h2 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
              ¿Quieres aparecer aquí?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Crea tu perfil profesional. Las empresas españolas te contactan a ti.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/registro?role=candidate">
                  Crear perfil gratis <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/como-funciona">Cómo funciona</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
