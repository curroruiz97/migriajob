'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';
import { normalizarEstado, type JobStatus } from '@/lib/ofertas/estados';
import {
  upsertSelectionStage,
  applicationStatusToStage,
} from '@/lib/actions/selection-process';

/**
 * Quién está tocando una oferta.
 *
 * Una empresa solo puede tocar las suyas, y eso se garantiza filtrando por su
 * company_id en cada consulta. Pero el equipo de Talnet no tiene empresa
 * propia, así que ese filtro le dejaba fuera de todo: al intentar editar
 * cualquier oferta se encontraba un «Empresa no encontrada». El dueño del
 * producto no podía corregir ni retirar la oferta de un cliente sin pedírselo
 * al cliente.
 *
 * La base de datos ya lo permitía —hay una política expresa de que los
 * administradores gestionan cualquier oferta—; era el código el que estorbaba.
 */
async function requireEmployer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const [{ data: company }, { data: perfil }] = await Promise.all([
    supabase.from('companies').select('id').eq('owner_id', user.id).maybeSingle(),
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: string }>(),
  ]);

  return {
    user,
    supabase,
    companyId: (company?.id as string | undefined) ?? null,
    esEquipo: perfil?.role === 'admin',
  };
}

/**
 * El filtro de propiedad, en un sitio. Para una empresa acota a lo suyo; para
 * el equipo no acota nada, porque puede con todas.
 *
 * Se escribe como un `.eq` condicional y no como dos consultas para que no haya
 * forma de olvidarse del filtro en una rama.
 */
// biome-ignore lint/suspicious/noExplicitAny: el tipo del builder de PostgREST no se puede nombrar aquí.
function soloSuyas<T extends { eq: (col: string, val: any) => T }>(
  consulta: T,
  companyId: string | null,
  esEquipo: boolean
): T {
  return esEquipo ? consulta : consulta.eq('company_id', companyId);
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
  const statusRaw = String(formData.get('status') ?? 'draft');
  const status = normalizarEstado(statusRaw);
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

    const { error } = await supabase.from('jobs').insert({
      company_id: companyId,
      title: j.title,
      slug: slugify(j.title),
      description: j.description,
      requirements: j.requirements,
      category: j.category,
      country: j.country,
      start_date: j.start_date,
      location: j.location,
      job_type: j.job_type as never,
      work_mode: j.work_mode as never,
      salary_min: j.salary_min,
      salary_max: j.salary_max,
      skills: j.skills,
      status: j.status as never,
      published_at: j.status === 'published' ? new Date().toISOString() : null,
    });
    if (error) return { error: 'No se pudo publicar la oferta. Inténtalo de nuevo.' as string };

    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}

export async function updateJobAction(jobId: string, _prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { supabase, companyId, esEquipo } = await requireEmployer();
    if (!companyId && !esEquipo) return { error: 'Empresa no encontrada.' as string };

    const j = parseJobForm(formData);
    if (!j.title || !j.category || !j.description || !j.requirements || !j.city) {
      return { error: 'Completa los campos obligatorios (título, categoría, descripción, requisitos y ciudad).' as string };
    }

    // Editar una oferta no es volver a publicarla: si ya estaba publicada se
    // respeta su fecha original. Antes cada guardado la resellaba con la fecha
    // de hoy, y la oferta reaparecía como recién puesta en los listados.
    const { data: previa } = await supabase
      .from('jobs')
      .select('published_at')
      .eq('id', jobId)
      .maybeSingle<{ published_at: string | null }>();

    const publishedAt =
      j.status === 'published'
        ? (previa?.published_at ?? new Date().toISOString())
        : null;

    const consulta = supabase
      .from('jobs')
      .update({
        title: j.title,
        description: j.description,
        requirements: j.requirements,
        category: j.category,
        country: j.country,
        start_date: j.start_date,
        location: j.location,
        job_type: j.job_type as never,
        work_mode: j.work_mode as never,
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        skills: j.skills,
        status: j.status as never,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      });

    const { error } = await soloSuyas(consulta.eq('id', jobId), companyId, esEquipo);
    if (error) return { error: 'No se pudieron guardar los cambios. Inténtalo de nuevo.' as string };

    revalidatePath('/admin/ofertas');
    revalidatePath(`/admin/ofertas/${jobId}`);
    return { ok: true as const };
  });
}

export async function setJobStatusAction(jobId: string, status: JobStatus) {
  return safeAction(async () => {
    const { supabase, companyId, esEquipo } = await requireEmployer();
    if (!companyId && !esEquipo) return { error: 'Empresa no encontrada.' as string };
    const { error } = await soloSuyas(
      supabase
        .from('jobs')
        .update({
          status: status as never,
          published_at: status === 'published' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId),
      companyId,
      esEquipo
    );
    if (error) return { error: 'No se pudo cambiar el estado de la oferta.' as string };
    revalidatePath('/admin/ofertas');
    return { ok: true as const };
  });
}

export async function duplicateJobAction(jobId: string) {
  return safeAction(async () => {
    const { supabase, companyId, esEquipo } = await requireEmployer();
    if (!companyId && !esEquipo) return { error: 'Empresa no encontrada.' as string };

    const { data: src } = await soloSuyas(
      supabase.from('jobs').select('*').eq('id', jobId),
      companyId,
      esEquipo
    ).maybeSingle();
    if (!src) return { error: 'Oferta no encontrada.' as string };

    // La copia se queda en la empresa de la oferta original, no en la de quien
    // copia: si el equipo duplica la oferta de un cliente, sigue siendo suya.
    const s = src as Record<string, unknown> & { title: string; company_id: string };
    await supabase.from('jobs').insert({
      company_id: s.company_id,
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
    const { user, supabase } = await requireEmployer();
    // NB: la tabla `applications` no tiene columna `updated_at` (ver migración
    // 0001). El intento anterior de setearla hacía fallar el UPDATE.
    const { error } = await supabase
      .from('applications')
      .update({ status: status as never })
      .eq('id', applicationId);
    if (error) return { error: error.message };

    // Mantener sincronizado el kanban "Mis procesos" con el estado de la
    // solicitud (shortlisted → contacted, hired → hired, rejected → rejected).
    const { data: app } = await supabase
      .from('applications')
      .select('candidate_id, job_id, candidate:candidates(profile_id)')
      .eq('id', applicationId)
      .maybeSingle();
    const candidate = (app as unknown as { candidate: { profile_id: string } | null } | null)?.candidate;
    const jobId = (app as unknown as { job_id: string } | null)?.job_id ?? null;
    if (candidate?.profile_id) {
      await upsertSelectionStage(supabase, {
        employerId: user.id,
        candidateProfileId: candidate.profile_id,
        targetStage: applicationStatusToStage(status),
        jobId,
      });
      revalidatePath('/admin/procesos');
    }

    // Revalidar todas las pantallas donde aparece el estado:
    //   - listado y detalle de solicitudes del empleador
    //   - vista de oferta del empleador (lista de candidatos inscritos)
    //   - listado de solicitudes del candidato
    revalidatePath('/admin/solicitudes');
    revalidatePath(`/admin/solicitudes/${applicationId}`);
    revalidatePath('/admin/ofertas');
    revalidatePath('/dashboard/solicitudes');
    return { ok: true as const };
  });
}
