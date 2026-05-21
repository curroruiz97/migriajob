import Link from 'next/link';
import { CreditCard, Settings, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CompanyForm, type CompanyDefaults } from '@/components/admin/company-form';

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
    location: (c.location as string | null) ?? '',
    website: (c.website as string | null) ?? '',
    contact_name: (c.contact_name as string | null) ?? '',
    contact_email: (c.contact_email as string | null) ?? '',
    contact_phone: (c.contact_phone as string | null) ?? '',
    description: (c.description as string | null) ?? '',
    logo_url: (c.logo_url as string | null) ?? '',
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Perfil de empresa
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mantén actualizada la información de tu empresa para generar confianza en los candidatos.
        </p>
      </div>

      <CompanyForm defaults={defaults} />

      {/* Facturación (sí tiene sentido en el perfil de empresa) */}
      <Link
        href="/admin/facturacion"
        className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-foreground">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Datos de facturación y suscripción
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <Link
        href="/dashboard/configuracion"
        className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-foreground">
          <Settings className="h-4 w-4 text-muted-foreground" />
          Configuración de la cuenta
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}
