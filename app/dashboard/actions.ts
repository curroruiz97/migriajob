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

    const str = (k: string) => String(formData.get(k) ?? '').trim() || null;
    const num = (k: string) => {
      const v = formData.get(k);
      return v ? Number(v) : null;
    };
    const list = (k: string) => {
      const raw = String(formData.get(k) ?? '').trim();
      return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
    };
    const json = (k: string) => {
      const raw = String(formData.get(k) ?? '').trim();
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const fullName = String(formData.get('fullName') ?? '').trim();
    const phone = str('phone');

    // profiles
    await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    // candidates (todos los campos del PASO 3; columnas nuevas vienen de la migración 0005)
    const candidateData = {
      full_name: fullName || null,
      phone: phone || null,
      headline: str('headline'),
      current_role: str('currentRole'),
      bio: str('bio'),
      years_experience: num('yearsExperience'),
      desired_salary_min: num('desiredSalaryMin'),
      desired_salary_max: num('desiredSalaryMax'),
      skills: list('skills'),
      location_city: str('locationCity'),
      location_country: str('locationCountry'),
      country_of_origin: str('nationality'),
      date_of_birth: str('dateOfBirth'),
      languages: json('languages'),
      experience: json('experiences'),
      preferred_locations: list('preferredLocations'),
      willing_to_relocate: formData.get('willingToRelocate') === 'true',
      start_availability: str('startAvailability'),
    };

    const { data: existing } = await supabase
      .from('candidates')
      .select('id, slug')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('candidates').insert({
        profile_id: user.id,
        slug: generateSlug(fullName, user.id.slice(0, 8)),
        ...candidateData,
      });
    } else {
      await supabase
        .from('candidates')
        .update({ ...candidateData, updated_at: new Date().toISOString() })
        .eq('profile_id', user.id);
    }

    revalidatePath('/dashboard/mi-perfil');
    return { ok: true as const };
  });
}

/**
 * Marca/desmarca una oferta como favorita del candidato actual.
 * Devuelve el nuevo estado (`saved`) para que el UI lo refleje.
 */
export async function toggleSavedJobAction(jobId: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();

    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (!candidate) {
      return { error: 'Completa tu perfil antes de guardar ofertas.' as string };
    }

    const { data: existing } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('candidate_id', candidate.id)
      .eq('job_id', jobId)
      .maybeSingle();

    if (existing) {
      await supabase.from('saved_jobs').delete().eq('id', existing.id);
      revalidatePath('/dashboard/ofertas');
      revalidatePath(`/dashboard/ofertas`);
      return { ok: true as const, saved: false };
    }

    await supabase.from('saved_jobs').insert({
      candidate_id: candidate.id,
      job_id: jobId,
    });
    revalidatePath('/dashboard/ofertas');
    return { ok: true as const, saved: true };
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

    // El error del insert se miraba: sin esto un mensaje rechazado por la
    // política de bloqueo (migración 0016) se daba por enviado y desaparecía.
    const { error: errorInsert } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: text,
    });
    if (errorInsert) {
      return {
        error: (errorInsert.code === '42501'
          ? 'No se puede enviar el mensaje en esta conversación.'
          : errorInsert.message) as string,
      };
    }
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
