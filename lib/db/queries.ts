import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

// ============================================
// CANDIDATES (públicos) — foco del marketplace
// ============================================

export async function getFeaturedProfiles(): Promise<Candidate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidates')
    .select('*')
    .eq('is_public', true)
    .eq('availability', 'open')
    .order('views_count', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(6);
  return (data ?? []) as Candidate[];
}

export type ProfileFilters = {
  q?: string;
  availability?: 'open' | 'passive' | 'closed';
  workMode?: 'remote' | 'hybrid' | 'on_site';
  experienceMin?: number;
  experienceMax?: number;
  city?: string;
  skills?: string[];
  salaryMin?: number;
  page?: number;
  perPage?: number;
  // Filtros nicho-latino
  countryOrigin?: string;
  workPermit?: 'eu_citizen' | 'permanent' | 'temporary' | 'in_application' | 'needs_sponsorship';
  hasNie?: boolean;
  homologation?: 'verified' | 'in_progress' | 'not_required' | 'not_started';
  verified?: boolean;
  inSpain?: boolean;
};

export async function searchProfiles(filters: ProfileFilters = {}): Promise<Candidate[]> {
  const supabase = await createClient();
  const perPage = Math.min(filters.perPage ?? 20, 100);
  const offset = ((filters.page ?? 1) - 1) * perPage;

  let q = supabase.from('candidates').select('*').eq('is_public', true);

  if (filters.availability) q = q.eq('availability', filters.availability);
  if (filters.experienceMin != null) q = q.gte('years_experience', filters.experienceMin);
  if (filters.experienceMax != null) q = q.lte('years_experience', filters.experienceMax);
  if (filters.city) q = q.ilike('location_city', `%${filters.city}%`);
  if (filters.salaryMin != null) q = q.gte('desired_salary_min', filters.salaryMin);
  if (filters.countryOrigin) q = q.eq('country_of_origin', filters.countryOrigin);
  if (filters.workPermit) q = q.eq('work_permit', filters.workPermit);
  if (filters.hasNie) q = q.eq('has_nie', true);
  if (filters.homologation) q = q.eq('homologation', filters.homologation);
  if (filters.verified) q = q.eq('verified', true);
  if (filters.inSpain) q = q.eq('location_country', 'España');

  // Búsqueda full-text
  if (filters.q && filters.q.trim().length > 0) {
    q = q.textSearch('search_vector', filters.q, { type: 'plain', config: 'spanish' });
  }

  const { data } = await q
    .order('updated_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  return (data ?? []) as Candidate[];
}

export async function getProfileBySlug(slug: string): Promise<Candidate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidates')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();
  return (data as Candidate) ?? null;
}

export async function incrementProfileViews(candidateId: string) {
  // Usa RPC si tuvieras función o lo dejamos como fire-and-forget UPDATE
  const supabase = await createClient();
  // Lectura previa para incrementar (no atómico pero suficiente para demo).
  const { data: existing } = await supabase
    .from('candidates')
    .select('views_count')
    .eq('id', candidateId)
    .maybeSingle();
  if (existing) {
    await supabase
      .from('candidates')
      .update({ views_count: (existing.views_count ?? 0) + 1 })
      .eq('id', candidateId);
  }
}

// ============================================
// PROFILES / AUTH
// ============================================

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}

export async function getCandidateByProfile(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidates')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle();
  return data as Candidate | null;
}

// ============================================
// EMPLOYER — favoritos, notas, tags
// ============================================

export async function getEmployerFavorites(employerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('favorites')
    .select('*, candidate:candidates(*)')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false });
  return ((data ?? []) as Array<{ id: string; candidate_id: string; employer_id: string; created_at: string; candidate: Candidate }>).map(
    (r) => ({
      favorite: { id: r.id, candidateId: r.candidate_id, employerId: r.employer_id, createdAt: r.created_at },
      candidate: r.candidate,
    })
  );
}

export async function isFavorited(employerId: string, candidateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('employer_id', employerId)
    .eq('candidate_id', candidateId)
    .maybeSingle();
  return !!data;
}

export async function getCandidateNotes(employerId: string, candidateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidate_notes')
    .select('*')
    .eq('employer_id', employerId)
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getCandidateTags(employerId: string, candidateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidate_tags')
    .select('*')
    .eq('employer_id', employerId)
    .eq('candidate_id', candidateId);
  return data ?? [];
}

// ============================================
// SELECTION PROCESSES (kanban)
// ============================================

export async function getEmployerProcesses(employerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('selection_processes')
    .select('*, candidate:candidates(*)')
    .eq('employer_id', employerId)
    .order('updated_at', { ascending: false });
  return ((data ?? []) as Array<Database['public']['Tables']['selection_processes']['Row'] & { candidate: Candidate }>).map(
    (r) => ({
      process: {
        id: r.id,
        employerId: r.employer_id,
        companyId: r.company_id,
        jobId: r.job_id,
        candidateId: r.candidate_id,
        stage: r.stage,
        notes: r.notes,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      },
      candidate: r.candidate,
    })
  );
}

// ============================================
// MESSAGES
// ============================================

export async function getConversations(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('conversations')
    .select('*')
    .or(`employer_id.eq.${userId},candidate_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  return data ?? [];
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at');
  return data ?? [];
}

// ============================================
// JOBS
// ============================================

export async function getPublishedJobs(opts?: { limit?: number; offset?: number }) {
  const supabase = await createClient();
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return data ?? [];
}

export async function getJobBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}

// ============================================
// EMPLOYER METRICS (para dashboard)
// ============================================

export async function getEmployerMetrics(employerId: string) {
  const supabase = await createClient();
  const [favsCount, processesData, totalCandidates] = await Promise.all([
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('employer_id', employerId),
    supabase.from('selection_processes').select('stage').eq('employer_id', employerId),
    supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('is_public', true),
  ]);

  const stageCounts: Record<string, number> = {
    new: 0, contacted: 0, interview: 0, offer: 0, hired: 0, rejected: 0,
  };
  for (const row of processesData.data ?? []) {
    stageCounts[row.stage] = (stageCounts[row.stage] ?? 0) + 1;
  }

  return {
    favoritesCount: favsCount.count ?? 0,
    totalCandidates: totalCandidates.count ?? 0,
    pipeline: {
      new: stageCounts.new,
      contacted: stageCounts.contacted,
      interview: stageCounts.interview,
      offer: stageCounts.offer,
      hired: stageCounts.hired,
      rejected: stageCounts.rejected,
    },
  };
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotifications(userId: string, opts?: { onlyUnread?: boolean; limit?: number }) {
  const supabase = await createClient();
  let q = supabase.from('notifications').select('*').eq('user_id', userId);
  if (opts?.onlyUnread) q = q.is('read_at', null);
  const { data } = await q
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 50);
  return data ?? [];
}

export async function getUnreadNotificationsCount(userId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null);
  return count ?? 0;
}

// ============================================
// SAVED SEARCHES
// ============================================

export async function getSavedSearches(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ============================================
// PIPELINE STAGES
// ============================================

export async function getPipelineStages(employerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('employer_id', employerId)
    .order('position');
  return data ?? [];
}

// ============================================
// PROFILE COMPLETENESS & MATCH SCORE (RPC)
// ============================================

export async function getProfileCompleteness(candidateId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('profile_completeness', { p_candidate_id: candidateId });
  return Number(data ?? 0);
}

export async function getMatchScore(candidateId: string, jobId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('compute_match_score', {
    p_candidate_id: candidateId,
    p_job_id: jobId,
  });
  return Number(data ?? 0);
}

// ============================================
// CANDIDATE SKILLS / LANGUAGES detallados
// ============================================

export async function getCandidateDetailedSkills(candidateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidate_skills')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('skill');
  return data ?? [];
}

export async function getCandidateMcerLanguages(candidateId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('candidate_languages').select('*').eq('candidate_id', candidateId);
  return data ?? [];
}
