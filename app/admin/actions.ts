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

// ============ FAVORITES ============
export async function toggleFavoriteAction(candidateId: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('employer_id', user.id)
      .eq('candidate_id', candidateId)
      .maybeSingle();

    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id);
    } else {
      await supabase.from('favorites').insert({ employer_id: user.id, candidate_id: candidateId });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/candidatos');
    return { ok: true as const, favorited: !existing };
  });
}

// ============ NOTES ============
export async function addNoteAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    const candidateId = String(formData.get('candidateId'));
    const body = String(formData.get('body') ?? '').trim();
    if (!body) return { error: 'La nota no puede estar vacía' };

    await supabase.from('candidate_notes').insert({
      employer_id: user.id,
      candidate_id: candidateId,
      body,
    });
    revalidatePath('/admin/candidatos');
    return { ok: true as const };
  });
}

export async function deleteNoteAction(noteId: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    await supabase
      .from('candidate_notes')
      .delete()
      .eq('id', noteId)
      .eq('employer_id', user.id);
    revalidatePath('/admin/candidatos');
    return { ok: true as const };
  });
}

// ============ TAGS ============
export async function addTagAction(candidateId: string, label: string, color = 'zinc') {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    if (!label.trim()) return { error: 'Etiqueta vacía' };

    await supabase
      .from('candidate_tags')
      .insert({
        employer_id: user.id,
        candidate_id: candidateId,
        label: label.trim(),
        color,
      });
    revalidatePath('/admin/candidatos');
    return { ok: true as const };
  });
}

export async function removeTagAction(tagId: string) {
  return safeAction(async () => {
    const { user, supabase } = await requireUser();
    await supabase
      .from('candidate_tags')
      .delete()
      .eq('id', tagId)
      .eq('employer_id', user.id);
    revalidatePath('/admin/candidatos');
    return { ok: true as const };
  });
}
