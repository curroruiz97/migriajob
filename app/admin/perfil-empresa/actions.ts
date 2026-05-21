'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

function slugify(name: string, fallback: string): string {
  const base = (name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || fallback;
}

export async function updateCompanyAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const name = String(formData.get('name') ?? '').trim();
    if (!name) return { error: 'El nombre de la empresa es obligatorio.' as string };
    const industry = String(formData.get('industry') ?? '').trim() || null;
    const size = String(formData.get('size') ?? '').trim() || null;
    const location = String(formData.get('location') ?? '').trim() || null;
    const website = String(formData.get('website') ?? '').trim() || null;
    const description = String(formData.get('description') ?? '').trim() || null;
    const logo_url = String(formData.get('logo_url') ?? '').trim() || null;

    const { data: existing } = await supabase
      .from('companies')
      .select('id, slug')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('companies')
        .update({ name, industry, size, location, website, description, logo_url })
        .eq('id', existing.id);
    } else {
      await supabase.from('companies').insert({
        owner_id: user.id,
        name,
        slug: slugify(name, user.id.slice(0, 8)),
        industry,
        size,
        location,
        website,
        description,
        logo_url,
      });
    }

    revalidatePath('/admin/perfil-empresa');
    return { ok: true as const };
  });
}
