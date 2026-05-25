import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, Briefcase, MapPin, Phone, Globe, FileText,
  GraduationCap, Languages as LangIcon, Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StartConversationButton } from '@/components/admin/start-conversation-button';

export const metadata = { title: 'Perfil del candidato' };

const AVAIL_LABEL: Record<string, string> = {
  open: 'Disponible inmediatamente',
  passive: 'Abierto a oportunidades',
  closed: 'No disponible',
};
const AVAIL_TONE: Record<string, 'success' | 'warning' | 'soft'> = {
  open: 'success', passive: 'warning', closed: 'soft',
};

interface ExperienceItem { company?: string; position?: string; role?: string; start_date?: string; start?: string; end_date?: string; end?: string; current?: boolean; description?: string; }
interface EducationItem { school?: string; degree?: string; yearStart?: number; yearEnd?: number; }
interface LanguageItem { code?: string; language?: string; level?: string; }

/**
 * Vista del perfil de un candidato para el EMPLEADOR.
 *
 * - No requiere is_public=true: si el candidato ha aplicado a alguna oferta
 *   de la empresa actual, el empleador puede ver su perfil completo.
 * - Usa el shell de /admin (sidebar, topbar, bottom nav, safe areas).
 * - No depende del SEO/marketing del /perfiles/[slug] público (que rompía
 *   con perfiles privados).
 */
export default async function CandidatoAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Empresa actual.
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!company) notFound();
  const companyId = (company as { id: string }).id;

  // Candidato por slug (sin restricción de is_public).
  const { data: candidate } = await supabase
    .from('candidates')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<{
      id: string; profile_id: string; headline: string | null; current_role: string | null;
      bio: string | null; avatar_url: string | null; cv_url: string | null;
      location_city: string | null; location_country: string | null;
      years_experience: number | null; skills: string[] | null;
      languages: unknown; experience: unknown; education: unknown;
      availability: string | null;
      linkedin_url: string | null; github_url: string | null;
      portfolio_url: string | null; website_url: string | null;
      desired_salary_min: number | null; desired_salary_max: number | null;
    }>();
  if (!candidate) notFound();

  // Autorización: el candidato debe haber aplicado a una oferta de la empresa.
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('company_id', companyId);
  const jobIds = (jobs ?? []).map((j) => (j as { id: string }).id);
  if (jobIds.length === 0) notFound();

  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('candidate_id', candidate.id)
    .in('job_id', jobIds)
    .maybeSingle();
  if (!app) notFound();

  // Datos derivados.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', candidate.profile_id)
    .maybeSingle<{ full_name: string | null; phone: string | null }>();

  const fullName = profile?.full_name || candidate.headline || candidate.current_role || 'Candidato';
  const initials = fullName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const location = [candidate.location_city, candidate.location_country].filter(Boolean).join(', ');
  const experiences = (Array.isArray(candidate.experience) ? candidate.experience : []) as ExperienceItem[];
  const educations = (Array.isArray(candidate.education) ? candidate.education : []) as EducationItem[];
  const languages = (Array.isArray(candidate.languages) ? candidate.languages : []) as LanguageItem[];
  const skills = candidate.skills ?? [];
  const salary =
    candidate.desired_salary_min || candidate.desired_salary_max
      ? `${candidate.desired_salary_min?.toLocaleString('es-ES') ?? ''}${candidate.desired_salary_max ? ` – ${candidate.desired_salary_max.toLocaleString('es-ES')}` : ''} €`
      : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/admin/solicitudes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver
      </Link>

      {/* Cabecera */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            {candidate.avatar_url && <AvatarImage src={candidate.avatar_url} alt="" />}
            <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl leading-tight tracking-tight text-foreground">
              {fullName}
            </h1>
            {candidate.headline && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{candidate.headline}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              )}
              {candidate.years_experience != null && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {candidate.years_experience} años de experiencia
                </span>
              )}
            </div>
            {candidate.availability && (
              <div className="mt-3">
                <Badge variant={AVAIL_TONE[candidate.availability] ?? 'soft'}>
                  {AVAIL_LABEL[candidate.availability] ?? candidate.availability}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        <StartConversationButton candidateUserId={candidate.profile_id} candidateName={fullName} />
      </section>

      {/* Contacto */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">Datos de contacto</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {profile?.phone && (
            <li className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" /> {profile.phone}
            </li>
          )}
          {candidate.linkedin_url && (
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={candidate.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
            </li>
          )}
          {candidate.portfolio_url && (
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={candidate.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>
            </li>
          )}
          {candidate.cv_url && (
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={candidate.cv_url} target="_blank" rel="noreferrer">Descargar CV</a>
            </li>
          )}
          {!profile?.phone && !candidate.linkedin_url && !candidate.portfolio_url && !candidate.cv_url && (
            <li className="text-xs text-muted-foreground">
              El candidato no añadió datos extra. Usa el mensaje interno.
            </li>
          )}
        </ul>
      </section>

      {salary && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Salario esperado</h2>
          <p className="mt-2 text-base font-medium text-foreground">{salary}</p>
        </section>
      )}

      {candidate.bio && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Sobre el candidato</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{candidate.bio}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Briefcase className="h-4 w-4 text-primary" /> Experiencia
          </h2>
          <ul className="mt-3 space-y-4">
            {experiences.map((e, i) => {
              const role = e.position || e.role || 'Puesto';
              const start = e.start_date || e.start;
              const end = e.current ? 'Actualidad' : (e.end_date || e.end);
              return (
                <li key={i} className="relative border-l-2 border-primary/40 pl-4">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm font-semibold text-foreground">{role}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.company ?? ''}{(start || end) && ` · ${start ?? ''}${end ? ` – ${end}` : ''}`}
                  </p>
                  {e.description && <p className="mt-1 text-xs text-foreground">{e.description}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {educations.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" /> Formación
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {educations.map((e, i) => (
              <li key={i}>
                <p className="font-medium text-foreground">{e.degree ?? 'Estudios'}</p>
                <p className="text-xs text-muted-foreground">
                  {e.school ?? ''}{(e.yearStart || e.yearEnd) && ` · ${e.yearStart ?? ''}${e.yearEnd ? `–${e.yearEnd}` : ''}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> Habilidades
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full border border-border bg-surface-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LangIcon className="h-4 w-4 text-primary" /> Idiomas
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {languages.map((l, i) => (
              <li key={i} className="text-foreground">
                {l.language ?? l.code ?? '—'}{' '}
                <span className="text-muted-foreground">— {l.level ?? ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
