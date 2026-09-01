import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Briefcase, ExternalLink, GraduationCap, Languages as LanguagesIcon,
  Linkedin, MapPin, Github, Globe, Heart, MessageSquare, ShieldCheck,
  PlayCircle, Share2, Sparkles, Calendar,
} from 'lucide-react';
import { ProfileJsonLd } from '@/components/public/profile-jsonld';
import { ShareButton } from '@/components/public/share-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CountryFlag, countryName } from '@/components/ui/country-flag';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { WorkPermitBadge, HomologationBadge, NieBadge } from '@/components/ui/documentation-badges';
import { LanguageChip } from '@/components/ui/language-chip';
import { SkillBar } from '@/components/ui/skill-bar';
import { getProfileBySlug, incrementProfileViews } from '@/lib/db/queries';
import { ReportDialog } from '@/components/moderation/report-dialog';

export const revalidate = 120;

interface ExperienceItem {
  company: string; role: string; start?: string; end?: string; description?: string;
}
interface EducationItem {
  school: string; degree?: string; yearStart?: number; yearEnd?: number;
}
interface LanguageItem { code: string; level: string; }

const AVAILABILITY_TONES: Record<string, string> = {
  open: 'bg-success-soft text-success',
  passive: 'bg-warning-soft text-warning',
  closed: 'bg-muted text-muted-foreground',
};
const AVAILABILITY_LABELS: Record<string, string> = {
  open: 'Disponible inmediatamente',
  passive: 'Abierto a oportunidades',
  closed: 'No disponible',
};

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return { title: 'Perfil no encontrado' };

  const title = profile.headline ?? profile.current_role ?? 'Perfil profesional';
  const country = profile.country_of_origin ? countryName(profile.country_of_origin) : '';
  const description =
    profile.bio?.slice(0, 160) ??
    `${title}${country ? ` · Profesional de ${country}` : ''} en Migria.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} · Migria`,
      description,
      type: 'profile',
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProfileDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  incrementProfileViews(profile.id).catch(() => {});

  const experience = (profile.experience as unknown as ExperienceItem[]) ?? [];
  const education = (profile.education as unknown as EducationItem[]) ?? [];
  const languages = (profile.languages as unknown as LanguageItem[]) ?? [];
  const skills = profile.skills ?? [];
  const initials = (profile.headline ?? 'M').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const location = [profile.location_city, profile.location_country].filter(Boolean).join(', ');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://migria.example';

  return (
    <div className="bg-background">
      <ProfileJsonLd profile={profile} baseUrl={baseUrl} />

      {/* HERO */}
      <section className="border-b border-border bg-hero-gradient">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <Avatar className="h-28 w-28 ring-4 ring-background sm:h-32 sm:w-32">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {profile.country_of_origin && (
                <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-2 ring-background text-2xl">
                  <CountryFlag code={profile.country_of_origin} size="lg" />
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                  {profile.headline ?? profile.current_role ?? 'Profesional'}
                </h1>
                {profile.verified && <VerifiedBadge size="lg" showLabel />}
              </div>

              {profile.current_role && profile.headline && (
                <p className="mt-2 text-lg text-muted-foreground">{profile.current_role}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {profile.country_of_origin && (
                  <span className="flex items-center gap-1.5">
                    <CountryFlag code={profile.country_of_origin} size="sm" />
                    De {countryName(profile.country_of_origin)}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {location}
                  </span>
                )}
                {profile.years_in_spain != null && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {profile.years_in_spain >= 1
                      ? `${Math.floor(profile.years_in_spain)} ${Math.floor(profile.years_in_spain) === 1 ? 'año' : 'años'} en España`
                      : `${Math.round(profile.years_in_spain * 12)} meses en España`}
                  </span>
                )}
                {profile.years_experience != null && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {profile.years_experience} {profile.years_experience === 1 ? 'año' : 'años'} de experiencia
                  </span>
                )}
              </div>

              <div className="mt-5">
                <Badge className={AVAILABILITY_TONES[profile.availability]}>
                  ● {AVAILABILITY_LABELS[profile.availability]}
                </Badge>
              </div>

              {/* Acciones */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Button size="lg">
                  <MessageSquare className="mr-1.5 h-4 w-4" /> Contactar
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="mr-1.5 h-4 w-4" /> Guardar
                </Button>
                <ShareButton size="lg" variant="ghost" title={profile.headline ?? 'Perfil'} text={`Perfil profesional en Migria`} label="Compartir" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* DOCUMENTACIÓN — el bloque que vende */}
            <Section title="Situación documental y legal" icon={ShieldCheck}>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <WorkPermitBadge status={profile.work_permit as never} />
                  {!profile.work_permit || profile.work_permit === 'not_specified' ? (
                    <span className="text-sm text-muted-foreground">Permiso no especificado</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <NieBadge has={profile.has_nie ?? false} />
                  {!profile.has_nie && (
                    <span className="text-sm text-muted-foreground">Sin NIE registrado</span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <HomologationBadge status={profile.homologation as never} />
                </div>
              </div>
              {profile.spanish && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nivel de español: <strong className="text-foreground">{profile.spanish === 'native' ? 'Nativo' : profile.spanish}</strong>
                </p>
              )}
            </Section>

            {/* About */}
            {profile.bio && (
              <Section title="Sobre mí">
                <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
                  {profile.bio}
                </p>
              </Section>
            )}

            {/* Vídeo de presentación */}
            {profile.intro_video_url && (
              <Section title="Vídeo de presentación" icon={PlayCircle}>
                <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                  <iframe
                    src={profile.intro_video_url}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                </div>
              </Section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <Section title="Experiencia profesional" icon={Briefcase}>
                <ul className="space-y-6">
                  {experience.map((e, idx) => (
                    <li key={idx} className="relative border-l-2 border-primary/40 pl-5">
                      <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                      <h3 className="font-semibold text-foreground">{e.role}</h3>
                      <p className="text-sm text-muted-foreground">
                        {e.company}
                        {(e.start || e.end) && (
                          <span className="ml-2 text-xs">
                            · {e.start ?? ''}{e.end ? ` – ${e.end}` : ' – Actualidad'}
                          </span>
                        )}
                      </p>
                      {e.description && (
                        <p className="mt-2 text-sm text-foreground">{e.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {education.length > 0 && (
              <Section title="Formación" icon={GraduationCap}>
                <ul className="space-y-3">
                  {education.map((e, idx) => (
                    <li key={idx}>
                      <h3 className="text-sm font-medium text-foreground">{e.degree ?? 'Estudios'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {e.school}
                        {(e.yearStart || e.yearEnd) && (
                          <span className="ml-2 text-xs">· {e.yearStart}{e.yearEnd ? `–${e.yearEnd}` : ''}</span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* SIDEBAR derecha */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Resumen rápido */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-foreground">Resumen rápido</h3>
              <Separator className="my-3" />
              <dl className="space-y-2 text-sm">
                {(profile.desired_salary_min || profile.desired_salary_max) && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Salario esperado</dt>
                    <dd className="font-medium text-foreground">
                      {profile.desired_salary_min?.toLocaleString('es-ES') ?? ''}
                      {profile.desired_salary_max
                        ? ` – ${profile.desired_salary_max.toLocaleString('es-ES')}`
                        : ''} €
                    </dd>
                  </div>
                )}
                {profile.modality && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Modalidad</dt>
                    <dd className="font-medium text-foreground capitalize">
                      {profile.modality === 'remote' ? 'Remoto' : profile.modality === 'hybrid' ? 'Híbrido' : 'Presencial'}
                    </dd>
                  </div>
                )}
                {profile.open_to_relocate && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Mudarse</dt>
                    <dd className="font-medium text-foreground">Abierto/a</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Vistas</dt>
                  <dd className="font-medium text-foreground">{profile.views_count ?? 0}</dd>
                </div>
              </dl>

              <Button className="mt-5 w-full" size="lg">
                <MessageSquare className="mr-1.5 h-4 w-4" /> Contactar ahora
              </Button>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <Section title="Habilidades" icon={Sparkles}>
                <div className="space-y-3">
                  {skills.slice(0, 6).map((s) => (
                    <SkillBar key={s} skill={s} level="advanced" />
                  ))}
                </div>
              </Section>
            )}

            {/* Idiomas */}
            {languages.length > 0 && (
              <Section title="Idiomas" icon={LanguagesIcon}>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <LanguageChip key={l.code} code={l.code} level={l.level} />
                  ))}
                </div>
              </Section>
            )}

            {/* Redes */}
            {(profile.linkedin_url || profile.github_url || profile.portfolio_url || profile.website_url) && (
              <Section title="Redes y portfolio">
                <div className="space-y-2">
                  {profile.linkedin_url && (
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {profile.github_url && (
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> GitHub
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {profile.portfolio_url && (
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Portfolio
                      </a>
                    </Button>
                  )}
                  {profile.website_url && (
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" /> Web
                      </a>
                    </Button>
                  )}
                </div>
              </Section>
            )}

            {/* Denunciar este perfil. Visible sin sesión a propósito: si la
                ficha es una suplantación, quien la reconoce suele llegar desde
                un buscador y no tiene cuenta. */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-base font-semibold text-foreground">
                ¿Este perfil no es real?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Avísanos si suplanta a alguien o la información es falsa.
              </p>
              <ReportDialog
                targetType="candidate_profile"
                targetId={profile.id}
                label="Denunciar perfil"
                variant="outline"
                className="mt-3 w-full"
              />
            </div>
          </aside>
        </div>
      </div>
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
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
