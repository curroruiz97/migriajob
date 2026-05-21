import { createClient } from '@/lib/supabase/server';
import { CompanyPerfil, type CompanyDefaults } from '@/components/admin/company-perfil';

export const metadata = { title: 'Perfil de empresa' };

export default async function PerfilEmpresaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user!.id)
    .maybeSingle();

  const c = (company ?? {}) as Record<string, unknown>;
  const defaults: CompanyDefaults = {
    name: (c.name as string) ?? '',
    tax_id: (c.tax_id as string | null) ?? '',
    industry: (c.industry as string | null) ?? '',
    size: (c.size as string | null) ?? '',
    founded_year: c.founded_year != null ? String(c.founded_year) : '',
    website: (c.website as string | null) ?? '',
    contact_name: (c.contact_name as string | null) ?? '',
    contact_role: (c.contact_role as string | null) ?? '',
    contact_email: (c.contact_email as string | null) ?? '',
    contact_phone: (c.contact_phone as string | null) ?? '',
    city: (c.location as string | null) ?? '',
    province: (c.address_province as string | null) ?? '',
    description: (c.description as string | null) ?? '',
  };

  // Completitud aproximada (decide si abrir el modal automáticamente).
  const checks = [
    !!c.logo_url, !!defaults.name, !!defaults.tax_id, !!defaults.industry,
    !!defaults.contact_name, !!defaults.contact_role, !!defaults.contact_email,
    !!defaults.contact_phone, !!defaults.city, !!defaults.province,
  ];
  const initialCompletion = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 overflow-x-hidden">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">Perfil de empresa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa los datos de tu empresa para generar confianza en los candidatos.
        </p>
      </div>

      <CompanyPerfil
        defaults={defaults}
        logoUrl={(c.logo_url as string | null) ?? null}
        initialCompletion={initialCompletion}
      />
    </div>
  );
}
