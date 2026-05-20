'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';

const DEFAULT_STAGES = [
  { name: 'Nuevo', color: 'zinc', position: 0, is_terminal: false },
  { name: 'Contactado', color: 'blue', position: 1, is_terminal: false },
  { name: 'Entrevista', color: 'violet', position: 2, is_terminal: false },
  { name: 'Oferta', color: 'amber', position: 3, is_terminal: false },
  { name: 'Contratado', color: 'green', position: 4, is_terminal: true },
  { name: 'Descartado', color: 'red', position: 5, is_terminal: true },
];

function slugify(text: string, fallback: string): string {
  const base = (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || fallback;
}

export async function createCompanyAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' as const };

    const name = String(formData.get('name') ?? '').trim();
    if (name.length < 2) return { error: 'Nombre demasiado corto' as const };

    const website = String(formData.get('website') ?? '').trim() || null;
    const industry = String(formData.get('industry') ?? '').trim() || null;
    const size = String(formData.get('size') ?? '').trim() || null;
    const location = String(formData.get('location') ?? '').trim() || null;
    const description = String(formData.get('description') ?? '').trim() || null;

    // Genera slug único añadiendo sufijo si colisiona
    let slug = slugify(name, user.id.slice(0, 8));
    const { data: collision } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (collision) slug = `${slug}-${user.id.slice(0, 6)}`;

    const { error: companyError } = await supabase.from('companies').insert({
      owner_id: user.id,
      slug,
      name,
      website,
      industry,
      size,
      location,
      description,
    });
    if (companyError) return { error: companyError.message };

    // Asegurar que el rol del profile es 'employer'
    await supabase.from('profiles').update({ role: 'employer' }).eq('id', user.id);

    // Sembrar pipeline_stages por defecto
    await supabase.from('pipeline_stages').insert(
      DEFAULT_STAGES.map((s) => ({ ...s, employer_id: user.id }))
    );

    revalidatePath('/admin');
    redirect('/admin');
  });
}
