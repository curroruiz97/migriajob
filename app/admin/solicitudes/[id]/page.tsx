import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Globe,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ApplicantStatusSelect } from '@/components/admin/applicant-status-select';
import { StartConversationButton } from '@/components/admin/start-conversation-button';

export const metadata = { title: 'Solicitud' };

const STATUS_LABEL: Record<string, { label: string; tone: 'success' | 'warning' | 'soft' | 'destructive' }> = {
  submitted: { label: 'Nueva solicitud', tone: 'warning' },
  reviewing: { label: 'En revisión', tone: 'soft' },
  shortlisted: { label: 'Preseleccionada', tone: 'success' },
  rejected: { label: 'Descartada', tone: 'destructive' },
  hired: { label: 'Contratada', tone: 'success' },
};

// Tipos derivados de la respuesta (Supabase devuelve arrays cuando hace embed).
interface ProfileEmbed {
  full_name: string | null;
  phone: string | null;
}
interface CandidateEmbed {
  id: string;
  slug: string | null;
  profile_id: string;
  headline: string | null;
  current_role: string | null;
  bio: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  location_city: string | null;
  location_country: string | null;
  years_experience: number | null;
  skills: string[] | null;
  languages: unknown;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  profile: ProfileEmbed | ProfileEmbed[] | null;
}
interface JobEmbed {
  id: string;
  title: string;
  company_id: string;
}
interface AppRow {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string | null;
  job: JobEmbed | JobEmbed[] | null;
  candidate: CandidateEmbed | CandidateEmbed[] | null;
}

/** Supabase devuelve arrays para embeds con relación 1:N pero objetos para 1:1.
 *  Por defensa, aceptamos ambos y devolvemos el primer elemento si es array. */
function pickOne<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  if (Array.isArray(v)) return v[0] ?? null;
  return v;
}

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: appRaw } = await supabase
    .from('applications')
    .select(`
      id, status, created_at, cover_letter,
      job:jobs(id, title, company_id),
      candidate:candidates(
        id, slug, profile_id, headline, current_role, bio, avatar_url, cv_url,
        location_city, location_country, years_experience, skills, languages,
        linkedin_url, github_url, portfolio_url,
        profile:profiles(full_name, phone)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (!appRaw) notFound();
  const app = appRaw as unknown as AppRow;

  const j = pickOne(app.job);
  const c = pickOne(app.candidate);
  const p = pickOne(c?.profile ?? null);

  // Verifica que la oferta pertenece a la empresa del usuario actual.
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!company || j?.company_id !== (company as { id: string }).id) notFound();

  const fullName: string = p?.full_name || c?.headline || c?.current_role || 'Candidato';
  const initials = fullName.split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase();
  const st = STATUS_LABEL[app.status] ?? STATUS_LABEL.submitted;

  const langs: Array<{ language?: string; level?: string }> = Array.isArray(c?.languages)
    ? (c.languages as Array<{ language?: string; level?: string }>)
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/admin/solicitudes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Solicitudes
      </Link>

      {/* Card cabecera */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            {c?.avatar_url && <AvatarImage src={c.avatar_url} alt="" />}
            <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl leading-tight tracking-tight text-foreground">
              {fullName}
            </h1>
            {c?.headline && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{c.headline}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {c?.location_city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {c.location_city}
                  {c.location_country ? `, ${c.location_country}` : ''}
                </span>
              )}
              {c?.years_experience != null && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {c.years_experience} años de experiencia
                </span>
              )}
            </div>
          </div>
          <Badge variant={st.tone}>{st.label}</Badge>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Solicitud para la oferta{' '}
          {j ? (
            <Link href={`/admin/ofertas/${j.id}`} className="font-medium text-primary hover:underline">
              {j.title}
            </Link>
          ) : (
            <span className="text-foreground">—</span>
          )}
        </p>

        {/* Acciones principales */}
        <div className="mt-5 flex flex-wrap gap-2">
          {c?.profile_id && (
            <StartConversationButton candidateUserId={c.profile_id} candidateName={fullName} />
          )}
          {c?.slug && (
            <Link
              href={`/admin/candidatos/${c.slug}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              Ver perfil completo
            </Link>
          )}
          <ApplicantStatusSelect applicationId={app.id} status={app.status} />
        </div>
      </section>

      {/* Datos de contacto */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">Datos de contacto</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {p?.phone && (
            <li className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" /> {p.phone}
            </li>
          )}
          {c?.linkedin_url && (
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={c.linkedin_url} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          )}
          {c?.portfolio_url && (
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={c.portfolio_url} target="_blank" rel="noreferrer">
                Portfolio
              </a>
            </li>
          )}
          {c?.cv_url && (
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <a className="text-primary hover:underline" href={c.cv_url} target="_blank" rel="noreferrer">
                Descargar CV
              </a>
            </li>
          )}
          {!p?.phone && !c?.linkedin_url && !c?.portfolio_url && !c?.cv_url && (
            <li className="text-xs text-muted-foreground">
              El candidato no ha añadido datos de contacto adicionales. Usa el mensaje interno para
              concretar entrevista.
            </li>
          )}
        </ul>
      </section>

      {/* Sobre el candidato */}
      {c?.bio && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Sobre el candidato</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{c.bio}</p>
        </section>
      )}

      {/* Habilidades */}
      {Array.isArray(c?.skills) && c.skills.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Habilidades</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.skills.map((s: string) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-surface-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Idiomas */}
      {langs.length > 0 && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Idiomas</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {langs.map((l, i) => (
              <li key={i} className="text-foreground">
                {l.language ?? '—'}{' '}
                <span className="text-muted-foreground">— {l.level ?? ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Carta de presentación si la tuviera */}
      {app.cover_letter && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Mensaje del candidato</h2>
          <p className="mt-2 flex items-start gap-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            {app.cover_letter}
          </p>
        </section>
      )}
    </div>
  );
}
