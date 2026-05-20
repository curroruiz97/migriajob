/**
 * @deprecated — Modo demo eliminado. La app usa Supabase real.
 * Stub vacío para no romper imports si quedara alguno.
 */
import type { Database } from '@/lib/supabase/types';

export function isDemoMode() { return false; }
export const MOCK_CANDIDATES: Database['public']['Tables']['candidates']['Row'][] = [];
export function findMockBySlug(_slug: string) { return null; }
export function filterMock(_filters: unknown) { return []; }
export const DEMO_METRICS = {
  favoritesCount: 0,
  totalCandidates: 0,
  pipeline: { new: 0, contacted: 0, interview: 0, offer: 0, hired: 0, rejected: 0 },
};
