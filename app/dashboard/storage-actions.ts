'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_CV_TYPES = ['application/pdf'];
const ALLOWED_IMG_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  return { user, supabase };
}

export async function uploadCvAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    const file = formData.get('cv') as File | null;
    if (!file || file.size === 0) return { error: 'Selecciona un PDF' };
    if (file.size > MAX_CV_BYTES) return { error: 'El CV no puede pesar más de 5 MB' };
    if (!ALLOWED_CV_TYPES.includes(file.type)) return { error: 'Solo se aceptan PDF' };

    const path = `${user.id}/cv-${Date.now()}.pdf`;
    const { error: upErr } = await supabase.storage
      .from('cvs')
      .upload(path, file, { contentType: 'application/pdf', upsert: false });
    if (upErr) return { error: upErr.message };

    const { data: signed } = await supabase.storage
      .from('cvs')
      .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 días

    if (signed?.signedUrl) {
      await supabase
        .from('candidates')
        .update({ cv_url: signed.signedUrl, updated_at: new Date().toISOString() })
        .eq('profile_id', user.id);
    }

    revalidatePath('/dashboard/mi-perfil');
    return { ok: true as const };
  });
}

export async function uploadCompanyLogoAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    const file = formData.get('avatar') as File | null;
    if (!file || file.size === 0) return { error: 'Selecciona una imagen' };
    if (file.size > MAX_AVATAR_BYTES) return { error: 'La imagen no puede pesar más de 2 MB' };
    if (!ALLOWED_IMG_TYPES.includes(file.type)) return { error: 'Formato no admitido (PNG, JPG o WebP)' };

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${user.id}/logo.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) return { error: upErr.message };

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;

    await supabase.from('companies').update({ logo_url: url }).eq('owner_id', user.id);

    revalidatePath('/admin/perfil-empresa');
    return { ok: true as const };
  });
}

export async function uploadAvatarAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    const file = formData.get('avatar') as File | null;
    if (!file || file.size === 0) return { error: 'Selecciona una imagen' };
    if (file.size > MAX_AVATAR_BYTES) return { error: 'La imagen no puede pesar más de 2 MB' };
    if (!ALLOWED_IMG_TYPES.includes(file.type)) return { error: 'Formato no admitido (PNG, JPG o WebP)' };

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) return { error: upErr.message };

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;

    await Promise.all([
      supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id),
      supabase.from('candidates').update({ avatar_url: url }).eq('profile_id', user.id),
    ]);

    revalidatePath('/dashboard/mi-perfil');
    revalidatePath('/perfiles');
    return { ok: true as const };
  });
}
