import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Wallet, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getJobBySlug } from '@/lib/db/queries';
import { getJobBySlug as getContentJob } from '@/lib/content/jobs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplyButton } from '@/components/employee/apply-button';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Jornada completa', part_time: 'Media jornada', contract: 'Contrato',
  internship: 'Prácticas', freelance: 'Freelance',
};
const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'Presencial', hybrid: 'Híbrido', remote: 'Teletrabajo',
};

export default async function CandidateJobDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1) ¿Es una oferta real de empresa (BD)?
  const dbJob = (await getJobBySlug(slug).catch(() => null)) as
    | (Record<string, unknown> & {
        id: string; title: string; location: string | null; job_type: string; work_mode: string;
        salary_min: number | null; salary_max: number | null; currency: string | null;
        description: string | null; requirements: string | null; benefits: string | null;
        skills: string[] | null; company: { name: string } | null;
      })
    | null;

  if (dbJob) {
    const { data: { user } } = await supabase.auth.getUser();
    let alreadyApplied = false;
    if (user) {
      const { data: candidate } = await supabase.from('candidates').select('id').eq('profile_id', user.id).maybeSingle();
      if (candidate) {
        const { data: app } = await supabase
          .from('applications').select('id').eq('candidate_id', candidate.id).eq('job_id', dbJob.id).maybeSingle();
        alreadyApplied = !!app;
      }
    }
    const sal = dbJob.salary_min != null || dbJob.salary_max != null
      ? `${dbJob.salary_min ? `${(dbJob.salary_min / 1000).toFixed(0)}k` : ''}${dbJob.salary_min && dbJob.salary_max ? '–' : ''}${dbJob.salary_max ? `${(dbJob.salary_max / 1000).toFixed(0)}k` : '+'} ${dbJob.currency || '€'}`
      : null;
    return (
      <Shell
        title={dbJob.title}
        subtitle={dbJob.company?.name ?? 'Empresa confidencial'}
        location={dbJob.location}
        jobType={JOB_TYPE_LABELS[dbJob.job_type] ?? dbJob.job_type}
        workMode={WORK_MODE_LABELS[dbJob.work_mode] ?? dbJob.work_mode}
        salary={sal}
        cta={<ApplyButton jobId={dbJob.id} alreadyApplied={alreadyApplied} />}
      >
        {dbJob.description && <Section title="Descripción"><p className="whitespace-pre-line leading-relaxed text-foreground">{dbJob.description}</p></Section>}
        {dbJob.requirements && <Section title="Requisitos"><p className="whitespace-pre-line leading-relaxed text-foreground">{dbJob.requirements}</p></Section>}
        {dbJob.benefits && <Section title="Lo que ofrecen"><p className="whitespace-pre-line leading-relaxed text-foreground">{dbJob.benefits}</p></Section>}
      </Shell>
    );
  }

  // 2) Oferta curada (contenido, mismo origen que la web)
  const c = getContentJob(slug);
  if (!c) notFound();
  return (
    <Shell
      title={c.title}
      subtitle={c.category}
      location={c.city ?? c.countryName}
      jobType={c.type}
      workMode={c.mode}
      salary={c.salary ?? null}
      cta={
        <Button asChild size="lg" className="h-11 w-full rounded-xl text-sm font-semibold">
          <Link href="/contacto">Solicitar información <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      }
    >
      <Section title="Sobre el puesto">
        {c.description.map((p, i) => <p key={i} className="leading-relaxed text-foreground">{p}</p>)}
      </Section>
      <Section title="Requisitos">
        <ul className="space-y-2">
          {c.requirements.map((r, i) => (
            <li key={i} className="flex gap-2 text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span>{r}</span></li>
          ))}
        </ul>
      </Section>
      <Section title="Lo que ofrecemos">
        <ul className="space-y-2">
          {c.offer.map((o, i) => (
            <li key={i} className="flex gap-2 text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{o}</span></li>
          ))}
        </ul>
      </Section>
    </Shell>
  );
}

function Shell({
  title, subtitle, location, jobType, workMode, salary, cta, children,
}: {
  title: string; subtitle: string; location: string | null; jobType: string; workMode: string;
  salary: string | null; cta: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Link href="/dashboard/ofertas" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Ofertas
      </Link>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl leading-tight tracking-tight text-foreground">{title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {location && <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2.5 py-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {location}</span>}
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2.5 py-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {jobType}</span>
          <Badge variant="soft">{workMode}</Badge>
          {salary && <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2.5 py-1 font-medium text-primary"><Wallet className="h-3.5 w-3.5" /> {salary}</span>}
        </div>
        <div className="mt-5">{cta}</div>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm">{children}</div>
    </div>
  );
}
