import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Cliente Supabase para Client Components.
 *
 * En modo demo (sin env vars) devuelve un stub que no hace nada — los
 * Client Components que dependen de auth siguen renderizando, pero las
 * mutaciones avisan que estás en demo.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project') || anonKey.length < 20) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null };
        },
        async signOut() {
          return { error: null };
        },
      },
      from() {
        return {
          select: () => ({ data: [], error: null }),
        };
      },
    } as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  return createBrowserClient<Database>(url, anonKey);
}
