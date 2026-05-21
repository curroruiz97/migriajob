import { createClient } from '@/lib/supabase/server';
import { getCandidateByProfile, getProfile } from '@/lib/db/queries';
import { ProfilePanel } from '@/components/employee/profile-panel';
import { AvatarUpload, CvUpload } from '@/components/employee/file-uploads';

export const metadata = { title: 'Mi perfil' };

function languagesToString(value: unknown): string {
  if (!Array.isArray(value)) return '';
  return value
    .map((v) => {
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>;
        return String(o.label ?? o.name ?? o.language ?? '');
      }
      return '';
    })
    .filter(Boolean)
    .join(', ');
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

  const initials = (profile?.full_name ?? user?.email ?? 'M')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hasExperience =
    Array.isArray(candidate?.experience) && (candidate?.experience as unknown[]).length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantén tu perfil completo para que las empresas te encuentren y contacten.
        </p>
      </div>

      <AvatarUpload currentUrl={candidate?.avatar_url ?? null} initials={initials} />
      <CvUpload currentUrl={candidate?.cv_url ?? null} />

      <ProfilePanel
        defaults={{
          fullName: profile?.full_name ?? '',
          phone: profile?.phone ?? '',
          headline: candidate?.headline ?? '',
          currentRole: candidate?.current_role ?? '',
          bio: candidate?.bio ?? '',
          yearsExperience:
            candidate?.years_experience != null ? String(candidate.years_experience) : '',
          desiredSalaryMin:
            candidate?.desired_salary_min != null ? String(candidate.desired_salary_min) : '',
          skills: candidate?.skills?.join(', ') ?? '',
          locationCity: candidate?.location_city ?? '',
          locationCountry: candidate?.location_country ?? '',
          languages: languagesToString(candidate?.languages),
        }}
        availability={(candidate?.availability as 'open' | 'passive' | 'closed') ?? 'closed'}
        isPublic={candidate?.is_public ?? false}
        hasAvatar={!!candidate?.avatar_url}
        hasCv={!!candidate?.cv_url}
        hasExperience={hasExperience}
      />
    </div>
  );
}
