import Link from 'next/link';
import { Users, ShieldCheck, BadgeCheck, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { searchProfiles } from '@/lib/db/queries';
import { ProfilesToolbar } from '@/components/public/profiles-toolbar';
import { ProfileFilters } from '@/components/public/profile-filters';
import { ProfileCard } from '@/components/public/profile-card';
import { ProfilesPagination } from '@/components/public/profiles-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const metadata = {
  title: 'Buscar talento · Profesionales latinos verificados | Migria',
  description:
    'Explora profesionales latinos cualificados. Filtra por país de origen, NIE, permiso de trabajo, homologación, ubicación y disponibilidad.',
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    view?: 'grid' | 'list';
    availability?: 'open' | 'passive' | 'closed';
    city?: string;
    expMin?: string;
    salaryMin?: string;
    countryOrigin?: string;
    workPermit?: string;
    hasNie?: string;
    verified?: string;
    inSpain?: string;
    page?: string;
  }>;
}

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Documentación verificada' },
  { icon: BadgeCheck, label: 'Evaluación técnica' },
  { icon: MapPin, label: 'Ya viviendo o en proceso' },
];

export default async function PerfilesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view === 'list' ? 'list' : 'grid';

  const { items: profiles, total, perPage } = await searchProfiles({
    q: params.q,
    availability: params.availability,
    city: params.city,
    experienceMin: params.expMin ? Number(params.expMin) : undefined,
    salaryMin: params.salaryMin ? Number(params.salaryMin) : undefined,
    countryOrigin: params.countryOrigin,
    workPermit: params.workPermit as never,
    hasNie: params.hasNie === 'true',
    verified: params.verified === 'true',
    inSpain: params.inSpain === 'true',
    page: params.page ? Number(params.page) : 1,
  }).catch(() => ({ items: [], total: 0, perPage: 20 }));

  // Chips de filtros activos
  const activeChips: Array<{ key: string; label: string }> = [];
  if (params.q) activeChips.push({ key: 'q', label: `"${params.q}"` });
  if (params.countryOrigin) activeChips.push({ key: 'countryOrigin', label: `País: ${params.countryOrigin}` });
  if (params.city) activeChips.push({ key: 'city', label: `📍 ${params.city}` });
  if (params.inSpain === 'true') activeChips.push({ key: 'inSpain', label: 'En España' });
  if (params.hasNie === 'true') activeChips.push({ key: 'hasNie', label: 'NIE vigente' });
  if (params.verified === 'true') activeChips.push({ key: 'verified', label: 'Verificados' });
  if (params.workPermit) activeChips.push({ key: 'workPermit', label: 'Permiso ' + params.workPermit });
  if (params.availability === 'open') activeChips.push({ key: 'availability', label: 'Disponible ahora' });
  if (params.expMin) activeChips.push({ key: 'expMin', label: `+${params.expMin} años` });
  if (params.salaryMin) activeChips.push({ key: 'salaryMin', label: `Desde ${params.salaryMin} €` });

  return (
    <div className="bg-background">
      {/* HERO — gemelo del de empleos, pero orientado a EMPRESAS que buscan talento */}
      <section className="relative overflow-hidden border-b border-border bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <Container size="xl" className="relative py-16 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge variant="soft" className="mb-5">
                <Users className="mr-1 h-3 w-3" />
                {total.toLocaleString('es-ES')} perfiles disponibles
              </Badge>
              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Talento latino{' '}
                <em className="text-gradient-primary not-italic">verificado</em>{' '}
                para tu equipo.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Profesionales evaluados técnicamente, con experiencia validada y documentación al
                día. <strong className="text-foreground">Filtra por país de origen, NIE,
                permiso y disponibilidad</strong> real.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="#filtros">
                    Empezar a filtrar <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/empresas">Soy empresa, busco talento</Link>
                </Button>
              </div>

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
                { value: total.toLocaleString('es-ES'), label: 'Perfiles' },
                {
                  value: new Set(profiles.map((p) => p.country_of_origin).filter(Boolean)).size,
                  label: 'Países',
                },
                {
                  value: profiles.filter((p) => p.availability === 'open').length,
                  label: 'Disponibles',
                },
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

      {/* CONTENIDO */}
      <Container size="xl" className="py-10" id="filtros">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-thin">
            <ProfileFilters />
          </aside>

          <div>
            <ProfilesToolbar count={total} />

            {/* Chips de filtros activos */}
            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            )}

            {profiles.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No hay perfiles que coincidan"
                description="Prueba con otros filtros o amplía tu búsqueda. Si llevas 'todos verificados + en España + NIE', es probable que necesites relajar alguno."
                className="mt-6"
              />
            ) : (
              <>
                <div
                  className={
                    view === 'grid'
                      ? 'mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
                      : 'mt-6 flex flex-col gap-3'
                  }
                >
                  {profiles.map((p) => (
                    <ProfileCard key={p.id} profile={p} view={view} />
                  ))}
                </div>
                <ProfilesPagination total={total} perPage={perPage} />
              </>
            )}
          </div>
        </div>
      </Container>

      {/* CTA */}
      <Container size="xl" className="pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <Sparkles className="mx-auto h-10 w-10" />
            <h2 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
              ¿Tu empresa necesita talento?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Solicita presupuesto. Captación internacional, formación previa y garantía de
              retención de hasta 6 meses.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/empresas">
                  Ver servicios para empresas <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contacto">Hablar con ventas</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
