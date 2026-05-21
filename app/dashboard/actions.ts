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
    const locationCity = String(formData.get('locationCity') ?? '').trim() || null;
    const locationCountry = String(formData.get('locationCountry') ?? '').trim() || null;
    const languagesRaw = String(formData.get('languages') ?? '').trim();
    const languages = languagesRaw
      ? languagesRaw.split(',').map((s) => s.trim()).filter(Boolean)
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
        location_city: locationCity,
        location_country: locationCountry,
        languages,
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
          location_city: locationCity,
          location_country: locationCountry,
          languages,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', user.id);
    }

    revalidatePath('/dashboard/mi-perfil');
    return { ok: true as const };
  });
}

export async function applyToJobAction(jobId: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();

    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (!candidate) {
      return { error: 'Completa tu perfil antes de solicitar ofertas.' as string };
    }

    // Evita duplicados
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('candidate_id', candidate.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (!existing) {
      await supabase.from('applications').insert({
        candidate_id: candidate.id,
        job_id: jobId,
        status: 'submitted',
      });
    }

    revalidatePath('/dashboard/solicitudes');
    return { ok: true as const };
  });
}

export async function sendMessageAction(conversationId: string, body: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    const text = body.trim();
    if (!text) return { error: 'El mensaje está vacío.' as string };

    // Verifica que el usuario pertenece a la conversación
    const { data: conv } = await supabase
      .from('conversations')
      .select('id, employer_id, candidate_id')
      .eq('id', conversationId)
      .maybeSingle();
    if (!conv || (conv.employer_id !== user.id && conv.candidate_id !== user.id)) {
      return { error: 'No tienes acceso a esta conversación.' as string };
    }

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: text,
    });
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    revalidatePath(`/dashboard/mensajes/${conversationId}`);
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
