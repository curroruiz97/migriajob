'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';
import type { Json } from '@/lib/supabase/types';

type Frequency = 'off' | 'daily' | 'weekly' | 'instant';

export async function saveSearchAction(input: {
  name: string;
  filters: Record<string, unknown>;
  alertFrequency?: Frequency;
}) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' as const };

    if (!input.name?.trim()) return { error: 'Pon un nombre a la búsqueda' as const };

    await supabase.from('saved_searches').insert({
      user_id: user.id,
      name: input.name.trim(),
      filters: input.filters as Json,
      alert_frequency: input.alertFrequency ?? 'off',
    });
    revalidatePath('/admin/busquedas-guardadas');
    return { ok: true as const };
  });
}

export async function deleteSavedSearchAction(id: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' as const };

    await supabase
      .from('saved_searches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    revalidatePath('/admin/busquedas-guardadas');
    return { ok: true as const };
  });
}
