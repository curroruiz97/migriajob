import { createClient } from '@/lib/supabase/server';
import {
  getCandidateByProfile,
  getCandidateDetailedSkills,
  getCandidateMcerLanguages,
  getProfile,
} from '@/lib/db/queries';
import { ProfileForm } from './profile-form';
import { CompletenessWidget } from '@/components/employee/completeness-widget';
import { AvatarUpload, CvUpload } from '@/components/employee/file-uploads';

export const metadata = { title: 'Mi perfil' };

export default async function MiPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [profile, candidate] = await Promise.all([
    getProfile(user!.id).catch(() => null),
    getCandidateByProfile(user!.id).catch(() => null),
  ]);

  const [skills, languages] = candidate
    ? await Promise.all([
        getCandidateDetailedSkills(candidate.id).catch(() => []),
        getCandidateMcerLanguages(candidate.id).catch(() => []),
      ])
    : [[], []];

  const initials = (profile?.full_name ?? user?.email ?? 'M')
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mi perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantén actualizado tu perfil para que las empresas te encuentren.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <AvatarUpload currentUrl={candidate?.avatar_url ?? null} initials={initials} />
          <CvUpload currentUrl={candidate?.cv_url ?? null} />
          <ProfileForm
            defaults={{
              fullName: profile?.full_name ?? '',
              phone: profile?.phone ?? '',
              headline: candidate?.headline ?? '',
              currentRole: candidate?.current_role ?? '',
              bio: candidate?.bio ?? '',
              yearsExperience: candidate?.years_experience ?? null,
              desiredSalaryMin: candidate?.desired_salary_min ?? null,
              skills: candidate?.skills?.join(', ') ?? '',
            }}
          />
        </div>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <CompletenessWidget
            candidate={candidate}
            hasSkills={skills.length > 0}
            hasLanguages={languages.length > 0}
          />
        </aside>
      </div>
    </div>
  );
}
