'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

export async function createTemplateAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const name = String(formData.get('name') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();
    if (!name) return { error: 'Pon un nombre a la plantilla' };
    if (!body) return { error: 'La plantilla está vacía' };

    const { error } = await supabase.from('message_templates').insert({
      employer_id: user.id,
      name,
      body,
    });
    if (error) return { error: error.message };

    revalidatePath('/admin/plantillas');
    return { ok: true as const };
  });
}

export async function deleteTemplateAction(id: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    await supabase
      .from('message_templates')
      .delete()
      .eq('id', id)
      .eq('employer_id', user.id);

    revalidatePath('/admin/plantillas');
    return { ok: true as const };
  });
}
