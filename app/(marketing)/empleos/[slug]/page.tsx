import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Briefcase, MapPin, Clock, Wallet, Building2, ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getJobBySlug } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Jornada completa', part_time: 'Media jornada', contract: 'Contrato',
  internship: 'Prácticas', freelance: 'Freelance',
};
const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'Presencial', hybrid: 'Híbrido', remote: 'Teletrabajo',
};

function salaryText(min: number | null, max: number | null, cur: string | null): string | null {
  if (min == null && max == null) return null;
  const sym = !cur || cur === 'EUR' ? '€' : cur;
  const f = (n: number) => new Intl.NumberFormat('es-ES').format(n);
  if (min != null && max != null) return `${f(min)}–${f(max)} ${sym}/mes`;
  if (min != null) return `Desde ${f(min)} ${sym}/mes`;
  return `Hasta ${f(max as number)} ${sym}/mes`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug).catch(() => null);
  if (!job) return { title: 'Oferta no encontrada' };
  const j = job as { title: string; description: string | null };
  return {
    title: j.title,
    description: (j.description ?? '').slice(0, 160),
  };
}

export default async function JobDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = (await getJobBySlug(slug).catch(() => null)) as
    | (Record<string, unknown> & {
        id: string; title: string; description: string | null;
        requirements: string | null; benefits: string | null;
        location: string | null; job_type: string; work_mode: string;
        salary_min: number | null; salary_max: number | null; currency: string | null;
        skills: string[] | null; company: { name: string } | null;
      })
    | null;

  if (!job) notFound();

  const sal = salaryText(job.salary_min, job.salary_max, job.currency);

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
              <Briefcase className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="flex-1">
              {job.company?.name && (
                <Badge variant="soft" className="mb-3 gap-1">
                  <Building2 className="h-3 w-3" /> {job.company.name}
                </Badge>
              )}
              <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {job.location && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" /> {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Briefcase className="h-3 w-3" /> {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
                </Badge>
                {sal && (
                  <Badge variant="outline" className="gap-1 border-primary/30 bg-primary-soft/50 text-primary">
                    <Wallet className="h-3 w-3" /> {sal}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENIDO */}
      <Container size="md" className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article className="space-y-10">
            {job.description && (
              <Section title="Sobre el puesto">
                <p className="whitespace-pre-line leading-relaxed text-foreground">
                  {job.description}
                </p>
              </Section>
            )}

            {job.requirements && (
              <Section title="Requisitos">
                <p className="whitespace-pre-line leading-relaxed text-foreground">
                  {job.requirements}
                </p>
              </Section>
            )}

            {job.benefits && (
              <Section title="Lo que ofrecen">
                <p className="whitespace-pre-line leading-relaxed text-foreground">
                  {job.benefits}
                </p>
              </Section>
            )}

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
                Crea tu perfil en Migria y envía tu candidatura en un clic.
              </p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href={`/login?redirectTo=/dashboard/ofertas/${slug}`}>
                  Aplicar a esta oferta <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                <Link href="/registro?role=candidate">Crear mi perfil</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted/40 p-5 text-sm">
              <p className="font-semibold text-foreground">¿Eres empresa?</p>
              <p className="mt-1 text-muted-foreground">
                Publica tus vacantes y recibe candidatos verificados.
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
