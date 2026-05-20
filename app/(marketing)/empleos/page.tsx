import Link from 'next/link';
import {
  Search,
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { JobCard } from '@/components/public/job-card';
import { JOBS, SECTORS, type SectorFilter } from '@/lib/content/jobs';

export const metadata = {
  title: 'Empleos disponibles | Migria',
  description:
    'Ofertas reales en hostelería (cocina, sala, hotel), industria, logística, mantenimiento y más. Talento hispanoamericano para empresas españolas.',
};

interface PageProps {
  searchParams: Promise<{ q?: string; sector?: string }>;
}

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Proceso legal completo' },
  { icon: Sparkles, label: 'Formación y acompañamiento' },
  { icon: Briefcase, label: 'Contratación en origen' },
];

export default async function EmpleosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? '').toLowerCase().trim();
  const sectorRaw = (params.sector ?? 'Todos') as SectorFilter;
  const sector = (SECTORS as readonly string[]).includes(sectorRaw)
    ? sectorRaw
    : 'Todos';

  const filtered = JOBS.filter((j) => {
    if (sector !== 'Todos' && j.sector !== sector) return false;
    if (
      q &&
      !`${j.title} ${j.category} ${j.shortDescription} ${j.city ?? ''}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });

  const totalJobs = JOBS.length;
  const countries = Array.from(new Set(JOBS.map((j) => j.countryCode))).length;
  const sectorsCount = Array.from(new Set(JOBS.map((j) => j.sector))).length;

  return (
    <div className="bg-background">
      {/* HERO — editorial style matching home */}
      <section className="relative overflow-hidden border-b border-border bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <Container size="xl" className="relative py-16 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge variant="soft" className="mb-5">
                <Zap className="mr-1 h-3 w-3" />
                {filtered.length} ofertas activas
              </Badge>
              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Empleos <em className="text-gradient-primary not-italic">listos</em>{' '}
                para tu siguiente paso.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Ofertas reales en empresas españolas — desde hostelería (cocina, sala, hotel) hasta
                industria, logística y mantenimiento.{' '}
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
                {sector !== 'Todos' && (
                  <input type="hidden" name="sector" value={sector} />
                )}
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

            {/* Mini stats column */}
            <div className="hidden shrink-0 grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface/60 backdrop-blur-sm lg:grid">
              {[
                { value: totalJobs, label: 'Ofertas' },
                { value: sectorsCount, label: 'Sectores' },
                { value: countries, label: 'Países' },
              ].map((s) => (
                <div key={s.label} className="px-6 py-5 text-center">
                  <div className="font-display text-3xl text-foreground">{s.value}</div>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FILTROS — píldoras refinadas por sector */}
      <section className="sticky top-16 z-10 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Container size="xl" className="overflow-x-auto py-3.5">
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">
              Sector
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex gap-2">
              {SECTORS.map((s) => {
                const url =
                  s === 'Todos'
                    ? '/empleos'
                    : `/empleos?sector=${encodeURIComponent(s)}`;
                const active = sector === s;
                const count =
                  s === 'Todos'
                    ? totalJobs
                    : JOBS.filter((j) => j.sector === s).length;
                return (
                  <Link
                    key={s}
                    href={url}
                    className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-surface text-muted-foreground hover:border-primary/40 hover:bg-primary-soft hover:text-primary'
                    }`}
                  >
                    {s}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold leading-4 ${
                        active
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary-soft group-hover:text-primary'
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* JOBS LIST — grid premium estilo Talento destacado */}
      <section className="border-b border-border bg-background py-16">
        <Container size="xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Badge variant="outline" className="mb-3">
                Ofertas activas
              </Badge>
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                {sector === 'Todos' ? (
                  <>
                    Empleos <em className="text-gradient-primary not-italic">activos</em>{' '}
                    ahora mismo.
                  </>
                ) : (
                  <>
                    Sector <em className="text-gradient-primary not-italic">{sector}</em>
                  </>
                )}
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {filtered.length === 0
                  ? 'No hay ofertas para esa búsqueda.'
                  : `Mostrando ${filtered.length} de ${totalJobs} ofertas — captación, formación previa y trámites legales incluidos.`}
              </p>
            </div>
            <Link
              href="/registro?role=candidate"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
            >
              Crear mi perfil <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface-muted/40 p-16 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="font-display mt-4 text-2xl text-foreground">
                Sin resultados para tu búsqueda
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con otro sector o limpia el filtro.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href="/empleos">Ver todas las ofertas</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((job, i) => (
                <JobCard
                  key={job.slug}
                  job={job}
                  featured={i === 0 && sector === 'Todos'}
                />
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
