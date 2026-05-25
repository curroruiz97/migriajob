import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Users, MapPin, Briefcase, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getMatchScore } from '@/lib/db/queries';
import { OfferForm, type OfferDefaults } from '@/components/admin/offer-form';
import { ApplicantStatusSelect } from '@/components/admin/applicant-status-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Editar oferta' };

interface Candidate {
  id: string;
  slug: string | null;
  headline: string | null;
  current_role: string | null;
  location_city: string | null;
  avatar_url: string | null;
  years_experience: number | null;
}
interface AppRow {
  id: string;
  status: string;
  candidate: Candidate | null;
}

export default async function EditarOfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user!.id)
    .maybeSingle();

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!job || (company && job.company_id !== company.id)) notFound();
  const j = job as Record<string, unknown>;

  // País + ciudad: si la migración 0007 está aplicada usamos j.country; si no,
  // derivamos el país del texto de `location` ("Ciudad, País").
  const loc = (j.location as string | null) ?? '';
  const country = (j.country as string | null) || (loc.includes('Perú') ? 'Perú' : 'España');
  const city = loc.replace(/,?\s*(España|Perú)\s*$/i, '').trim();
  const startDate = j.start_date ? String(j.start_date).slice(0, 10) : '';
  // Categoría: columna 0007, o primer skill como respaldo.
  const category =
    (j.category as string | null) ||
    (Array.isArray(j.skills) && (j.skills as string[])[0] ? (j.skills as string[])[0] : '');

  const defaults: OfferDefaults = {
    title: (j.title as string) ?? '',
    category,
    description: (j.description as string) ?? '',
    requirements: (j.requirements as string | null) ?? '',
    country,
    city,
    job_type: (j.job_type as string) ?? 'full_time',
    work_mode: (j.work_mode as string) ?? 'on_site',
    salary_min: j.salary_min != null ? String(j.salary_min) : '',
    salary_max: j.salary_max != null ? String(j.salary_max) : '',
    start_date: startDate,
    status: (j.status as string) ?? 'published',
  };

  // Candidatos inscritos + matching
  const { data: appsData } = await supabase
    .from('applications')
    .select('id, status, candidate:candidates(id, slug, headline, current_role, location_city, avatar_url, years_experience)')
    .eq('job_id', id)
    .order('created_at', { ascending: false });
  const apps = (appsData ?? []) as unknown as AppRow[];

  const withScores = await Promise.all(
    apps.map(async (a) => ({
      ...a,
      match: a.candidate ? await getMatchScore(a.candidate.id, id).catch(() => 0) : 0,
    }))
  );

  // Cabecera de detalle: lo que el empleador "ve" de su propia oferta al
  // entrar. No hay botón de "Solicitar información" — esta vista es interna
  // del empleador: candidatos inscritos + edición.
  const jobTitle = (j.title as string) ?? 'Sin título';
  const jobStatus = (j.status as string) ?? 'draft';
  const jobLocation = (j.location as string | null) ?? null;
  const STATUS_LABEL: Record<string, string> = {
    published: 'Activa', paused: 'Pausada', draft: 'Borrador',
    archived: 'Cerrada', expired: 'Caducada',
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/ofertas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Mis ofertas
      </Link>

      {/* Detalle de la oferta (vista del propio empleador, sin CTA público) */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl leading-tight tracking-tight text-foreground">
              {jobTitle}
            </h1>
            {jobLocation && (
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {jobLocation}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {STATUS_LABEL[jobStatus] ?? jobStatus}
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl leading-tight tracking-tight text-foreground">
          Candidatos inscritos ({withScores.length})
        </h2>
        {withScores.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aún no hay candidaturas"
            description="Cuando alguien solicite esta oferta, aparecerá aquí con su % de match."
          />
        ) : (
          <div className="space-y-2">
            {withScores.map((a) => {
              const c = a.candidate;
              const initials = (c?.headline ?? c?.current_role ?? 'C')
                .split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              return (
                <div key={a.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-background">
                      {c?.avatar_url && <AvatarImage src={c.avatar_url} alt="" />}
                      <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {c?.headline ?? c?.current_role ?? 'Candidato'}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        {c?.location_city && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {c.location_city}
                          </span>
                        )}
                        {c?.years_experience != null && (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {c.years_experience} años
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-bold leading-none text-primary">{a.match}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">match</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <ApplicantStatusSelect applicationId={a.id} status={a.status} />
                    {c?.slug && (
                      <Link
                        href={`/perfiles/${c.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Ver perfil <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl leading-tight tracking-tight text-foreground">
          Editar oferta
        </h2>
        <OfferForm jobId={id} defaults={defaults} />
      </section>
    </div>
  );
}
