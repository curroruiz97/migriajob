'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

type Stage = 'new' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';

export async function updateProcessStageAction(processId: string, stage: Stage) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    await supabase
      .from('selection_processes')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', processId)
      .eq('employer_id', user.id);

    revalidatePath('/admin/procesos');
    revalidatePath('/admin');
    return { ok: true as const };
  });
}

export async function createProcessAction(candidateId: string, jobId?: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('selection_processes').insert({
      employer_id: user.id,
      candidate_id: candidateId,
      job_id: jobId ?? null,
      stage: 'new',
    });
    // Conflict (proceso ya existe) lo ignoramos silenciosamente
    if (error && !error.message.includes('duplicate')) return { error: error.message };

    revalidatePath('/admin/procesos');
    return { ok: true as const };
  });
}
