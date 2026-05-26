'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';
import { upsertSelectionStage } from '@/lib/actions/selection-process';

export async function sendMessageAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const conversationId = String(formData.get('conversationId') ?? '');
    const body = String(formData.get('body') ?? '').trim();
    if (!conversationId) return { error: 'Conversación inválida' };
    if (!body) return { error: 'El mensaje no puede estar vacío' };

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body,
    });
    if (error) return { error: error.message };

    // Si el remitente es el empleador, asegurar que el candidato aparece en
    // el kanban "Mis procesos" como 'contacted' (no degrada si ya está más
    // avanzado). Identificamos al candidato leyendo la conversación.
    const { data: conv } = await supabase
      .from('conversations')
      .select('employer_id, candidate_id')
      .eq('id', conversationId)
      .maybeSingle<{ employer_id: string; candidate_id: string }>();
    if (conv && conv.employer_id === user.id) {
      await upsertSelectionStage(supabase, {
        employerId: user.id,
        candidateProfileId: conv.candidate_id,
        targetStage: 'contacted',
      });
      revalidatePath('/admin/procesos');
    }

    revalidatePath(`/admin/mensajes/${conversationId}`);
    revalidatePath('/admin/mensajes');
    return { ok: true as const };
  });
}

export async function markConversationReadAction(conversationId: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

    revalidatePath('/admin/mensajes');
    revalidatePath(`/admin/mensajes/${conversationId}`);
    return { ok: true as const };
  });
}

export async function startConversationAction(candidateUserId: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    // ¿Existe ya?
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('employer_id', user.id)
      .eq('candidate_id', candidateUserId)
      .maybeSingle();

    if (existing) {
      return { ok: true as const, id: existing.id };
    }

    const { data: created, error } = await supabase
      .from('conversations')
      .insert({ employer_id: user.id, candidate_id: candidateUserId })
      .select('id')
      .single();
    if (error || !created) return { error: error?.message ?? 'No se pudo crear' };

    // El simple hecho de abrir conversación cuenta como "contacto" — añade
    // al candidato al kanban en la columna 'Contactado'.
    await upsertSelectionStage(supabase, {
      employerId: user.id,
      candidateProfileId: candidateUserId,
      targetStage: 'contacted',
    });

    revalidatePath('/admin/mensajes');
    revalidatePath('/admin/procesos');
    return { ok: true as const, id: created.id };
  });
}
