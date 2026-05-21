import { createClient } from '@/lib/supabase/server';
import { getCandidateByProfile, getProfile } from '@/lib/db/queries';
import { CandidatePerfil, type CandidateDefaults } from '@/components/employee/candidate-perfil';

export const metadata = { title: 'Mi perfil' };

type Lang = { language: string; level: string };
type Exp = { position: string; company: string; start_date: string; end_date: string; current: boolean; description: string };

function parseLanguages(value: unknown): Lang[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (typeof v === 'string') return { language: v, level: '' };
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>;
        return { language: String(o.language ?? o.name ?? o.label ?? ''), level: String(o.level ?? '') };
      }
      return { language: '', level: '' };
    })
    .filter((l) => l.language);
}

function parseExperiences(value: unknown): Exp[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => {
    const o = (v ?? {}) as Record<string, unknown>;
    return {
      position: String(o.position ?? o.title ?? ''),
      company: String(o.company ?? ''),
      start_date: String(o.start_date ?? ''),
      end_date: String(o.end_date ?? ''),
      current: Boolean(o.current),
      description: String(o.description ?? ''),
    };
  });
}

export default async function MiPerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [profile, candidate] = await Promise.all([
    getProfile(user!.id).catch(() => null),
    getCandidateByProfile(user!.id).catch(() => null),
  ]);

  const c = (candidate ?? {}) as Record<string, unknown>;
  const initials = (profile?.full_name ?? user?.email ?? 'M')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const languages = parseLanguages(c.languages);
  const skills = Array.isArray(c.skills) ? (c.skills as string[]).join(', ') : '';

  const defaults: CandidateDefaults = {
    fullName: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    email: user?.email ?? '',
    dateOfBirth: (c.date_of_birth as string | null) ?? '',
    nationality: (c.country_of_origin as string | null) ?? '',
    locationCity: (c.location_city as string | null) ?? '',
    locationCountry: (c.location_country as string | null) ?? '',
    headline: (c.headline as string | null) ?? '',
    yearsExperience: c.years_experience != null ? String(c.years_experience) : '',
    skills,
    bio: (c.bio as string | null) ?? '',
    desiredSalaryMin: c.desired_salary_min != null ? String(c.desired_salary_min) : '',
    desiredSalaryMax: c.desired_salary_max != null ? String(c.desired_salary_max) : '',
    preferredLocations: Array.isArray(c.preferred_locations) ? (c.preferred_locations as string[]).join(', ') : '',
    startAvailability: (c.start_availability as string | null) ?? '',
    willingToRelocate: Boolean(c.willing_to_relocate),
    languages,
    experiences: parseExperiences(c.experience),
  };

  // Completitud aproximada (sirve para decidir si abrir el modal automáticamente).
  const checks = [
    !!c.avatar_url,
    !!defaults.fullName,
    !!defaults.dateOfBirth,
    !!defaults.nationality,
    !!defaults.phone,
    !!defaults.locationCity,
    defaults.headline.length > 4,
    defaults.yearsExperience !== '',
    !!skills,
    languages.length > 0,
    defaults.startAvailability !== '',
    !!c.cv_url,
  ];
  const initialCompletion = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">Mi perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Un perfil completo recibe más contactos de empresas.
        </p>
      </div>

      <CandidatePerfil
        defaults={defaults}
        avatarUrl={(c.avatar_url as string | null) ?? null}
        cvUrl={(c.cv_url as string | null) ?? null}
        initials={initials}
        availability={(c.availability as 'open' | 'passive' | 'closed') ?? 'closed'}
        isPublic={Boolean(c.is_public)}
        initialCompletion={initialCompletion}
      />
    </div>
  );
}
