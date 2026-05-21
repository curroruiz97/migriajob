'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

async function requireEmployer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  return { user, supabase, companyId: company?.id ?? null };
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || 'oferta'}-${suffix}`;
}

type JobStatus = 'published' | 'paused' | 'archived';

function parseJobForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const requirements = String(formData.get('requirements') ?? '').trim() || null;
  const country = String(formData.get('country') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  // El listado de candidatos muestra `location`: componemos "Ciudad, País".
  const location = [city, country].filter(Boolean).join(', ') || null;
  const job_type = String(formData.get('job_type') ?? 'full_time');
  const work_mode = String(formData.get('work_mode') ?? 'on_site');
  const salaryMinRaw = formData.get('salary_min');
  const salaryMaxRaw = formData.get('salary_max');
  const salary_min = salaryMinRaw ? Number(salaryMinRaw) : null;
  const salary_max = salaryMaxRaw ? Number(salaryMaxRaw) : null;
  const start_date = String(formData.get('start_date') ?? '').trim() || null;
  // La categoría también se guarda como skill para el matching y la búsqueda.
  const skills = category ? [category] : [];
  const statusRaw = String(formData.get('status') ?? 'published');
  const status: JobStatus = (['published', 'paused', 'archived'] as const).includes(
    statusRaw as JobStatus
  )
    ? (statusRaw as JobStatus)
    : 'published';
  return { title, category, description, requirements, country, city, location, job_type, work_mode, salary_min, salary_max, start_date, skills, status };
}

export async function createJobAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { supabase, companyId } = await requireEmployer();
    if (!companyId) return { error: 'Completa primero el perfil de tu empresa.' as string };

    const j = parseJobForm(formData);
    if (!j.title || !j.category || !j.description || !j.requirements || !j.city) {
      return { error: 'Completa los campos obligatorios (título, categoría, descripción, requisitos y ciudad).' as string };
    }

    // Columnas garantizadas (presentes desde el esquema inicial).
    const { data: created, error } = await supabase
      .from('jobs')
      .insert({
        company_id: companyId,
        title: j.title,
        slug: slugify(j.title),
        description: j.description,
        requirements: j.requirements,
        location: j.location,
        job_type: j.job_type as never,
        work_mode: j.work_mode as never,
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        skills: j.skills,
        status: j.status as never,
        published_at: j.status === 'published' ? new Date().toISOString() : null,
      })
      .select('id')
      .maybeSingle();
    if (error) return { error: 'No se pudo publicar la oferta. Inténtalo de nuevo.' as string };

    // Columnas de la migración 0007 (defensivo: si aún no existen, se ignora).
    if (created?.id) {
      await supabase
        .from('jobs')
        .update({ category: j.category, country: j.country, start_date: j.start_date })
        .eq('id', created.id)
        .then(() => {}, () => {});
    }

    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}

export async function updateJobAction(jobId: string, _prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { supabase, companyId } = await requireEmployer();
    if (!companyId) return { error: 'Empresa no encontrada.' as string };

    const j = parseJobForm(formData);
    if (!j.title || !j.category || !j.description || !j.requirements || !j.city) {
      return { error: 'Completa los campos obligatorios (título, categoría, descripción, requisitos y ciudad).' as string };
    }

    await supabase
      .from('jobs')
      .update({
        title: j.title,
        description: j.description,
        requirements: j.requirements,
        location: j.location,
        job_type: j.job_type as never,
        work_mode: j.work_mode as never,
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        skills: j.skills,
        status: j.status as never,
        published_at: j.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('company_id', companyId);

    // Columnas de la migración 0007 (defensivo).
    await supabase
      .from('jobs')
      .update({ category: j.category, country: j.country, start_date: j.start_date })
      .eq('id', jobId)
      .eq('company_id', companyId)
      .then(() => {}, () => {});

    revalidatePath('/admin/ofertas');
    revalidatePath(`/admin/ofertas/${jobId}`);
    return { ok: true as const };
  });
}

export async function setJobStatusAction(jobId: string, status: JobStatus) {
  return safeAction(async () => {
    const { supabase, companyId } = await requireEmployer();
    if (!companyId) return { error: 'Empresa no encontrada.' as string };
    await supabase
      .from('jobs')
      .update({
        status: status as never,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .eq('company_id', companyId);
    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}

export async function duplicateJobAction(jobId: string) {
  return safeAction(async () => {
    const { supabase, companyId } = await requireEmployer();
    if (!companyId) return { error: 'Empresa no encontrada.' as string };

    const { data: src } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('company_id', companyId)
      .maybeSingle();
    if (!src) return { error: 'Oferta no encontrada.' as string };

    const s = src as Record<string, unknown> & { title: string };
    await supabase.from('jobs').insert({
      company_id: companyId,
      title: `${s.title} (copia)`,
      slug: slugify(s.title),
      description: s.description as string,
      requirements: (s.requirements as string | null) ?? null,
      location: (s.location as string | null) ?? null,
      job_type: s.job_type as never,
      work_mode: s.work_mode as never,
      salary_min: (s.salary_min as number | null) ?? null,
      salary_max: (s.salary_max as number | null) ?? null,
      skills: (s.skills as string[] | null) ?? [],
      status: 'draft' as never,
      published_at: null,
    });

    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
) {
  return safeAction(async () => {
    const { supabase } = await requireEmployer();
    await supabase
      .from('applications')
      .update({ status: status as never, updated_at: new Date().toISOString() })
      .eq('id', applicationId);
    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}
