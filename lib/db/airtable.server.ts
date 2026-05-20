import 'server-only';

/**
 * @deprecated — La fuente de datos pasó de Airtable a Supabase/Drizzle.
 * Este archivo es un stub vacío para que las páginas legacy de bordful
 * (app/(marketing)/jobs y similares) no rompan el build hasta que se
 * eliminen o redirijan a /perfiles.
 */

import type { Job } from './airtable';

export async function getJobs(): Promise<Job[]> {
  return [];
}

export async function getJobBySlug(): Promise<Job | null> {
  return null;
}

export async function getJobsBySearchParams(): Promise<Job[]> {
  return [];
}
