import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, User, Calendar, FileText, Hash, Flag, Phone, Mail,
  MapPin, Briefcase, Sparkles, Languages as LangIcon, Heart,
  FolderOpen, Info, Globe,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FavoriteButton } from '@/components/admin/favorite-button';
import { StartConversationButton } from '@/components/admin/start-conversation-button';
import { ReportDialog } from '@/components/moderation/report-dialog';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

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
interface LanguageItem { code?: string; language?: string; level?: string; }

/** Muestra el valor o "–" si está vacío/null */
function show(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined || v === '') return '–';
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  return String(v);
}

/** Calcula edad a partir de fecha de nacimiento */
function computeAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 && age <= 120 ? age : null;
}

/** Formatea fecha a dd/mm/yyyy */
function fmtDate(d: string | null | undefined): string {
  if (!d) return '–';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '–';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function CandidatoAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Rol del usuario
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>();
  const isAdmin = userProfile?.role === 'admin';

  // Candidato por slug (sin restricción de is_public)
  const { data: candidate } = await supabase
    .from('candidates')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Candidate>();
  if (!candidate) notFound();

  // Autorización
  let alreadyFavorite = false;

  if (isAdmin) {
    // Admin puede ver cualquier candidato (RLS lo permite)
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('employer_id', user.id)
      .eq('candidate_id', candidate.id)
      .maybeSingle();
    alreadyFavorite = !!fav;
  } else {
    // Employer: debe tener ofertas y el candidato haber aplicado
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();
    if (!company) notFound();
    const companyId = (company as { id: string }).id;

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

    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('employer_id', user.id)
      .eq('candidate_id', candidate.id)
      .maybeSingle();
    alreadyFavorite = !!fav;
  }

  // Resolver nombre/contacto (importados vs con cuenta)
  let fullName: string;
  let phone: string | null;
  let email: string | null;

  if (candidate.profile_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', candidate.profile_id)
      .maybeSingle<{ full_name: string | null; phone: string | null }>();
    fullName = profile?.full_name || candidate.full_name || candidate.headline || 'Candidato';
    phone = profile?.phone || candidate.phone;
    email = candidate.email;
  } else {
    fullName = candidate.full_name || candidate.headline || 'Candidato';
    phone = candidate.phone;
    email = candidate.email;
  }

  const initials = fullName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const age = computeAge(candidate.date_of_birth);
  const experiences = (Array.isArray(candidate.experience) ? candidate.experience : []) as ExperienceItem[];
  const languages = (Array.isArray(candidate.languages) ? candidate.languages : []) as LanguageItem[];
  const skills = candidate.skills ?? [];
  const preferredLocations = candidate.preferred_locations ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/admin/candidatos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a candidatos
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
            {candidate.availability && (
              <div className="mt-2">
                <Badge variant={AVAIL_TONE[candidate.availability] ?? 'soft'}>
                  {AVAIL_LABEL[candidate.availability] ?? candidate.availability}
                </Badge>
                {candidate.is_imported && (
                  <Badge variant="soft" className="ml-2">Importado</Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          {candidate.profile_id && (
            <StartConversationButton candidateUserId={candidate.profile_id} candidateName={fullName} />
          )}
          <FavoriteButton candidateId={candidate.id} initial={alreadyFavorite} />
          {/* DENUNCIAR EL PERFIL.
              Estaba solo en la ficha publica (/perfiles/[slug]), y una empresa
              con la sesion abierta lee los perfiles aqui: desde el menu,
              "Buscar candidatos" lleva a /admin/candidatos. Quien puede
              detectar una suplantacion es justamente quien esta leyendo el
              perfil, asi que la via tiene que estar donde se lee (directriz
              1.2). */}
          <ReportDialog
            targetType="candidate_profile"
            targetId={candidate.id}
            label="Denunciar perfil"
            variant="ghost"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          1. DATOS PERSONALES
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <User className="h-4 w-4 text-primary" /> Datos personales
        </h2>
        <div className="mt-4 divide-y divide-border/50">
          <Field label="Nombre completo" value={fullName} />
          <Field label="Fecha de nacimiento" value={fmtDate(candidate.date_of_birth)} />
          <Field label="Edad" value={age != null ? `${age} años` : null} />
          <Field label="Tipo de documento" value={candidate.document_type} />
          <Field label="Nro de documento" value={candidate.document_number} />
          <Field label="Nacionalidad" value={candidate.country_of_origin} />
          <Field label="Teléfono" value={phone} />
          <Field label="Email" value={email} />
          <Field label="Ciudad actual" value={candidate.location_city} />
          <Field label="País actual" value={candidate.location_country} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. PERFIL PROFESIONAL
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Briefcase className="h-4 w-4 text-primary" /> Perfil profesional
        </h2>
        <div className="mt-4 divide-y divide-border/50">
          <Field label="Titular profesional" value={candidate.headline} />
          <Field label="Años de experiencia" value={candidate.years_experience != null ? `${candidate.years_experience}` : null} />
          <Field
            label="Habilidades"
            value={skills.length > 0 ? null : null}
            custom={
              skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center rounded-full border border-border bg-surface-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              ) : undefined
            }
          />
          <Field
            label="Idiomas"
            value={languages.length > 0 ? null : null}
            custom={
              languages.length > 0 ? (
                <ul className="space-y-1">
                  {languages.map((l, i) => (
                    <li key={i} className="text-sm text-foreground">
                      {l.language ?? l.code ?? '–'}{' '}
                      <span className="text-muted-foreground">— {l.level ?? '–'}</span>
                    </li>
                  ))}
                </ul>
              ) : undefined
            }
          />
          <Field label="Descripción personal" value={candidate.bio} long />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. EXPERIENCIA LABORAL
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Experiencia laboral
        </h2>
        {experiences.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">–</p>
        ) : (
          <div className="mt-4 space-y-4">
            {experiences.map((e, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-4 divide-y divide-border/50">
                <Field label="Título" value={e.position || e.role} />
                <Field label="Empresa" value={e.company} />
                <Field label="Fecha de inicio" value={fmtDate(e.start_date || e.start)} />
                <Field label="Fecha de fin" value={e.current ? 'Actualidad' : fmtDate(e.end_date || e.end)} />
                <Field label="Descripción de funciones" value={e.description} long />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          4. PREFERENCIAS LABORALES
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Heart className="h-4 w-4 text-primary" /> Preferencias laborales
        </h2>
        <div className="mt-4 divide-y divide-border/50">
          <Field
            label="Salario esperado mínimo"
            value={candidate.desired_salary_min != null ? `${candidate.desired_salary_min.toLocaleString('es-ES')} €` : null}
          />
          <Field
            label="Salario esperado máximo"
            value={candidate.desired_salary_max != null ? `${candidate.desired_salary_max.toLocaleString('es-ES')} €` : null}
          />
          <Field
            label="Ubicaciones deseadas"
            value={preferredLocations.length > 0 ? preferredLocations.join(', ') : null}
          />
          <Field label="Disponibilidad de incorporación" value={candidate.start_availability} />
          <Field label="Dispuesto a trasladarse" value={candidate.willing_to_relocate != null ? (candidate.willing_to_relocate ? 'Sí' : 'No') : null} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. DOCUMENTACIÓN
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <FolderOpen className="h-4 w-4 text-primary" /> Documentación
        </h2>
        <div className="mt-4 divide-y divide-border/50">
          <Field
            label="Curriculum (PDF)"
            value={candidate.cv_url ? null : null}
            custom={
              candidate.cv_url ? (
                <a
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  href={candidate.cv_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText className="h-3.5 w-3.5" /> Descargar CV
                </a>
              ) : undefined
            }
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. INFORMACIÓN ADICIONAL
          ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Info className="h-4 w-4 text-primary" /> Información adicional
        </h2>
        <div className="mt-4 divide-y divide-border/50">
          <Field label="Fuente de reclutamiento" value={candidate.recruitment_source} />
        </div>
      </section>
    </div>
  );
}

/* ─── Componente auxiliar: fila de campo ─── */

function Field({
  label,
  value,
  long,
  custom,
}: {
  label: string;
  value?: string | number | null;
  long?: boolean;
  custom?: React.ReactNode;
}) {
  const displayed = custom ?? (
    <span className={long ? 'whitespace-pre-line' : ''}>
      {show(value)}
    </span>
  );

  return (
    <div className={`grid gap-1 py-2.5 text-sm sm:grid-cols-[180px_1fr] sm:gap-3`}>
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-foreground">{displayed}</span>
    </div>
  );
}
