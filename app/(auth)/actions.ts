'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signInSchema, signUpSchema } from '@/lib/validations/auth';

export type AuthState = { error?: string; ok?: true };

/**
 * Traduce mensajes de error de Supabase Auth al español.
 */
function translateAuthError(message: string): string {
  // Loguea el mensaje original de Supabase para diagnóstico (visible en logs de Vercel).
  console.error('[auth] Supabase error:', message);
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (lower.includes('email not confirmed')) return 'Aún no has confirmado tu email. Revisa tu bandeja.';
  if (lower.includes('user already registered')) return 'Ya existe una cuenta con ese email.';
  if (lower.includes('password should be at least')) return 'La contraseña debe tener al menos 8 caracteres.';
  if (lower.includes('email rate limit exceeded')) return 'Demasiados intentos. Espera unos minutos.';
  if (lower.includes('over_request_rate_limit') || lower.includes('rate limit')) return 'Demasiadas peticiones. Espera unos minutos.';
  if (lower.includes('signups not allowed') || lower.includes('signup is disabled')) return 'El registro está temporalmente deshabilitado.';
  if (lower.includes('invalid email')) return 'El email no es válido.';
  if (lower.includes('captcha')) return 'Verificación captcha fallida. Inténtalo de nuevo.';
  // Configuración de Supabase incorrecta (clave/URL mal en Vercel).
  if (lower.includes('invalid api key') || lower.includes('apikey') || lower.includes('no api key'))
    return 'Error de configuración del servidor (clave de API). Avisa al equipo.';
  if (lower.includes('project not found') || lower.includes('not found'))
    return 'Error de configuración del servidor (proyecto). Avisa al equipo.';
  if (lower.includes('network') || lower.includes('fetch failed') || lower.includes('fetch')) return 'No hemos podido conectar con el servidor. Comprueba tu conexión.';
  return 'Algo ha ido mal. Inténtalo de nuevo.';
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos no válidos' };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: translateAuthError(error.message) };

  // Determinar destino según rol
  const { data: { user } } = await supabase.auth.getUser();
  let dest = '/admin';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    dest = profile?.role === 'employer' || profile?.role === 'admin'
      ? '/admin'
      : '/dashboard/mi-perfil';
  }

  revalidatePath('/', 'layout');
  redirect(dest);
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    role: formData.get('role') ?? 'candidate',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos no válidos' };
  }
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
      },
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });
  if (error) return { error: translateAuthError(error.message) };

  redirect('/login?registered=1');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { error: 'Introduce tu email.' };

  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/recuperar/nueva-contrasena`,
  });
  if (error) return { error: translateAuthError(error.message) };

  return { ok: true };
}

export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get('password') ?? '');
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message) };

  redirect('/admin');
}
