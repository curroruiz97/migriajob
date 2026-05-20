import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Briefcase, MapPin, Clock, CheckCircle2,
  ShieldCheck, Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { CountryFlag } from '@/components/ui/country-flag';
import { JobCard } from '@/components/public/job-card';
import { JOBS, getJobBySlug, getRelatedJobs } from '@/lib/content/jobs';

export const revalidate = 3600;

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: 'Oferta no encontrada' };
  return {
    title: `${job.title} — ${job.countryName}`,
    description: job.shortDescription,
  };
}

export default async function JobDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();
  const related = getRelatedJobs(slug, 3);
  const Icon = job.icon;

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border bg-hero-gradient">
        <Container size="md" className="py-10 lg:py-14">
          <Link
            href="/empleos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Todas las ofertas
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:h-20 sm:w-20">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="flex-1">
              <Badge variant="soft" className="mb-3">
                {job.category}
              </Badge>
              <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <CountryFlag code={job.countryCode} size="sm" /> {job.countryName}
                </Badge>
                {job.city && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" /> {job.city}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" /> {job.type}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Briefcase className="h-3 w-3" /> {job.mode}
                </Badge>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENIDO */}
      <Container size="md" className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article className="space-y-10">
            <Section title="Sobre el puesto">
              {job.description.map((p, i) => (
                <p key={i} className="text-foreground leading-relaxed">{p}</p>
              ))}
            </Section>

            <Section title="Requisitos">
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex gap-2 text-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Lo que ofrecemos">
              <ul className="space-y-2">
                {job.offer.map((o, i) => (
                  <li key={i} className="flex gap-2 text-foreground">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Acompañamiento Migria" icon={ShieldCheck}>
              <p className="text-muted-foreground">
                Esta oferta incluye gestión migratoria completa: tramitación del visado, alta en Seguridad
                Social, recepción en aeropuerto, kit de bienvenida y seguimiento durante los primeros meses.
                No viajas solo.
              </p>
            </Section>
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-display text-lg text-foreground">Aplica ya</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Procesos abiertos, plazas limitadas. Sin coste para el candidato.
              </p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href="/contacto">
                  Solicitar información <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                <Link href="/registro?role=candidate">Crear mi perfil</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted/40 p-5 text-sm">
              <p className="font-semibold text-foreground">¿Eres empresa?</p>
              <p className="mt-1 text-muted-foreground">
                ¿Tienes vacantes parecidas? Pide presupuesto para tu plantilla.
              </p>
              <Link
                href="/empresas"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Ver para empresas <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </Container>

      {/* RELACIONADAS */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface-muted/40 py-16">
          <Container size="xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  Más ofertas
                </Badge>
                <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
                  Otras <em className="text-gradient-primary not-italic">oportunidades</em> similares.
                </h2>
              </div>
              <Link
                href="/empleos"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((j) => (
                <JobCard key={j.slug} job={j} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

function Section({
  title, icon: Icon, children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display flex items-center gap-2 text-2xl text-foreground">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}
