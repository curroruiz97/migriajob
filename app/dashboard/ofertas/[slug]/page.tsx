import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Wallet, Building2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getJobBySlug } from '@/lib/db/queries';
import { Badge } from '@/components/ui/badge';
import { ApplyButton } from '@/components/employee/apply-button';

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

export default async function CandidateJobDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = (await getJobBySlug(slug)) as
    | (Record<string, unknown> & {
        id: string;
        title: string;
        location: string | null;
        job_type: string;
        work_mode: string;
        salary_min: number | null;
        salary_max: number | null;
        currency: string | null;
        description: string | null;
        requirements: string | null;
        benefits: string | null;
        skills: string[] | null;
        company: { name: string } | null;
      })
    | null;

  if (!job) notFound();

  // ¿Ya he aplicado?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let alreadyApplied = false;
  if (user) {
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();
    if (candidate) {
      const { data: app } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidate.id)
        .eq('job_id', job.id)
        .maybeSingle();
      alreadyApplied = !!app;
    }
  }

  const sal =
    job.salary_min != null || job.salary_max != null
      ? `${job.salary_min ? `${(job.salary_min / 1000).toFixed(0)}k` : ''}${
          job.salary_min && job.salary_max ? '–' : ''
        }${job.salary_max ? `${(job.salary_max / 1000).toFixed(0)}k` : '+'} ${job.currency || '€'}`
      : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/ofertas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Ofertas
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-primary-soft/40 text-primary ring-1 ring-primary/15">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl leading-tight tracking-tight text-foreground">
              {job.title}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {job.company?.name ?? 'Empresa confidencial'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {job.location && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2.5 py-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted/60 px-2.5 py-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
          </span>
          <Badge variant="soft">{WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}</Badge>
          {sal && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft/50 px-2.5 py-1 font-medium text-primary">
              <Wallet className="h-3.5 w-3.5" /> {sal}
            </span>
          )}
        </div>

        <div className="mt-5">
          <ApplyButton jobId={job.id} alreadyApplied={alreadyApplied} />
        </div>
      </div>

      {job.description && (
        <Section title="Descripción">
          <p className="whitespace-pre-line leading-relaxed text-foreground">{job.description}</p>
        </Section>
      )}
      {job.requirements && (
        <Section title="Requisitos">
          <p className="whitespace-pre-line leading-relaxed text-foreground">{job.requirements}</p>
        </Section>
      )}
      {job.benefits && (
        <Section title="Lo que ofrecen">
          <p className="whitespace-pre-line leading-relaxed text-foreground">{job.benefits}</p>
        </Section>
      )}
      {job.skills && job.skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <Badge key={s} variant="outline" className="font-normal">
                <CheckCircle2 className="mr-1 h-3 w-3 text-success" /> {s}
              </Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
