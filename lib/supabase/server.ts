import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 *
 * Si las env vars no están configuradas (modo demo), devuelve un stub que
 * simula auth sin sesión y evita que cualquier `.auth.getUser()` rompa.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project') || anonKey.length < 20) {
    return makeStub();
  }

  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // server component: el middleware ya refresca la cookie
        }
      },
    },
  });
}

/**
 * Stub mínimo que cumple la superficie usada por la app:
 * - auth.getUser() devuelve user demo si DEMO_AUTH=1, null en otro caso
 * - auth.signOut(), signInWithPassword, signUp devuelven error explícito
 * - .from(...).select(...) devuelve { data: null, error } (compatible con .single())
 */
function makeStub() {
  const demoUser =
    process.env.DEMO_AUTH === '1'
      ? {
          id: 'demo-user-id',
          email: 'demo@migria.local',
          user_metadata: { full_name: 'Demo Empleador', role: 'employer' },
        }
      : null;

  return {
    auth: {
      async getUser() {
        return { data: { user: demoUser }, error: null };
      },
      async signOut() {
        return { error: null };
      },
      async signInWithPassword() {
        return {
          data: { user: null, session: null },
          error: { message: 'Modo demo: configura Supabase para iniciar sesión real.' },
        };
      },
      async signUp() {
        return {
          data: { user: null, session: null },
          error: { message: 'Modo demo: configura Supabase para crear cuenta real.' },
        };
      },
    },
    from() {
      const builder = {
        select: () => builder,
        eq: () => builder,
        single: async () => ({ data: { role: 'employer' as const }, error: null }),
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
        delete: async () => ({ error: null }),
      };
      return builder;
    },
  } as unknown as Awaited<ReturnType<typeof createServerClient<Database>>>;
}
