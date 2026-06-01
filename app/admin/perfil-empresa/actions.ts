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
    // Campos añadidos por la migración 0004.
    const tax_id = String(formData.get('tax_id') ?? '').trim() || null;
    const foundedRaw = formData.get('founded_year');
    const founded_year = foundedRaw ? Number(foundedRaw) : null;
    const contact_name = String(formData.get('contact_name') ?? '').trim() || null;
    const contact_email = String(formData.get('contact_email') ?? '').trim() || null;
    const contact_phone = String(formData.get('contact_phone') ?? '').trim() || null;
    // Campos de la migración 0006.
    const contact_role = String(formData.get('contact_role') ?? '').trim() || null;
    const address_province = String(formData.get('address_province') ?? '').trim() || null;

    // Núcleo + columnas de 0004 (siempre presentes).
    const core = {
      name, industry, size, location, website, description, logo_url,
      tax_id, founded_year, contact_name, contact_email, contact_phone,
    };
    // Columnas de 0006 (se aplican aparte para no romper el guardado si aún no existen).
    const v6 = { contact_role, address_province };

    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    const companyId = existing?.id;
    if (companyId) {
      await supabase.from('companies').update(core).eq('id', companyId);
    } else {
      const { data: created } = await supabase
        .from('companies')
        .insert({ owner_id: user.id, slug: slugify(name, user.id.slice(0, 8)), ...core })
        .select('id')
        .maybeSingle();
      // companyId queda para el update de 0006
      if (created?.id) {
        await supabase.from('companies').update(v6).eq('id', created.id).then(() => {}, () => {});
      }
    }

    // Update defensivo de los campos 0006 (si las columnas no existen, se ignora el error).
    if (companyId) {
      await supabase.from('companies').update(v6).eq('id', companyId).then(() => {}, () => {});
    }

    revalidatePath('/admin/perfil-empresa');
    return { ok: true as const };
  });
}
