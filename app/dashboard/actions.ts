'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  return { user, supabase };
}

function generateSlug(name: string, fallback: string): string {
  const base = (name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || fallback;
}

export async function updateProfileAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();

    const fullName = String(formData.get('fullName') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim() || null;
    const headline = String(formData.get('headline') ?? '').trim() || null;
    const currentRole = String(formData.get('currentRole') ?? '').trim() || null;
    const bio = String(formData.get('bio') ?? '').trim() || null;
    const yearsRaw = formData.get('yearsExperience');
    const yearsExperience = yearsRaw ? Number(yearsRaw) : null;
    const salaryRaw = formData.get('desiredSalaryMin');
    const desiredSalaryMin = salaryRaw ? Number(salaryRaw) : null;
    const skillsRaw = String(formData.get('skills') ?? '').trim();
    const skills = skillsRaw
      ? skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Update profile
    await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    // Upsert candidate row
    const { data: existing } = await supabase
      .from('candidates')
      .select('id, slug')
      .eq('profile_id', user.id)
      .maybeSingle();

    const slug = existing?.slug ?? generateSlug(fullName, user.id.slice(0, 8));

    if (!existing) {
      await supabase.from('candidates').insert({
        profile_id: user.id,
        slug,
        headline,
        current_role: currentRole,
        bio,
        years_experience: yearsExperience,
        desired_salary_min: desiredSalaryMin,
        skills,
      });
    } else {
      await supabase
        .from('candidates')
        .update({
          headline,
          current_role: currentRole,
          bio,
          years_experience: yearsExperience,
          desired_salary_min: desiredSalaryMin,
          skills,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', user.id);
    }

    revalidatePath('/dashboard/mi-perfil');
    return { ok: true as const };
  });
}

export async function updateAvailabilityAction(
  availability: 'open' | 'passive' | 'closed',
  isPublic: boolean
) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    await supabase
      .from('candidates')
      .update({
        availability,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', user.id);

    revalidatePath('/dashboard/disponibilidad');
    revalidatePath('/perfiles');
    return { ok: true as const };
  });
}
