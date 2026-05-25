'use client';

/**
 * Perfil de empresa — versión simplificada.
 *
 * Sólo se muestran los campos esenciales que el empleador necesita rellenar:
 *   - Logo (imagen de empresa)
 *   - Nombre de la empresa
 *   - Sector económico
 *   - Ubicación (texto libre)
 *   - Descripción de valores y cultura
 *
 * El resto de columnas (CIF, contacto, web, etc.) se mantienen en BD por
 * compatibilidad, pero no aparecen en la UI. Si en el futuro se quieren
 * editar, basta con devolverlos al modal.
 */

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Settings,
  ChevronRight,
  CreditCard,
  Building2,
} from 'lucide-react';
import { updateCompanyAction } from '@/app/admin/perfil-empresa/actions';
import { uploadCompanyLogoAction } from '@/app/dashboard/storage-actions';
import { AvatarUpload } from '@/components/employee/file-uploads';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SECTORS = [
  'Hostelería y turismo',
  'Producción',
  'Logística y transporte',
  'Construcción y obra civil',
  'Mantenimiento y servicios técnicos',
  'Limpieza y servicios auxiliares',
  'Agricultura y agroindustria',
  'Comercio y retail',
  'Servicios profesionales',
  'Otro',
];

export interface CompanyDefaults {
  name: string;
  /** Mantenidos en el tipo pero NO mostrados en el form simplificado. */
  tax_id: string;
  industry: string;
  size: string;
  founded_year: string;
  website: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  province: string;
  description: string;
}

export function CompanyPerfil({
  defaults,
  logoUrl,
  initialCompletion,
}: {
  defaults: CompanyDefaults;
  logoUrl: string | null;
  initialCompletion: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialCompletion < 50);
  // Los campos visibles + un "location" único (texto libre). Mapeamos city <-> location.
  const [form, setForm] = useState({
    name: defaults.name,
    industry: defaults.industry,
    location: defaults.city || defaults.province || '',
    description: defaults.description,
  });
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Completitud — pesos basados sólo en lo visible.
  const { score, items } = useMemo(() => {
    const its = [
      { key: 'logo', label: 'Logotipo / imagen de empresa', done: !!logoUrl, w: 15 },
      { key: 'name', label: 'Nombre de la empresa', done: form.name.trim() !== '', w: 25 },
      { key: 'sector', label: 'Sector económico', done: form.industry.trim() !== '', w: 20 },
      { key: 'loc', label: 'Ubicación', done: form.location.trim() !== '', w: 20 },
      { key: 'desc', label: 'Valores y cultura de la empresa', done: form.description.trim() !== '', w: 20 },
    ];
    return {
      score: Math.min(100, its.reduce((s, i) => s + (i.done ? i.w : 0), 0)),
      items: its,
    };
  }, [form, logoUrl]);

  const initials = (form.name || 'E').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  function submit() {
    startSave(async () => {
      const fd = new FormData();
      fd.set('name', form.name);
      fd.set('industry', form.industry);
      // Mapeamos location -> columna `location` (que la action ya espera como ciudad).
      fd.set('location', form.location);
      fd.set('description', form.description);
      // Preservamos los datos ocultos no editables aquí (no se sobreescriben con vacío).
      fd.set('tax_id', defaults.tax_id);
      fd.set('size', defaults.size);
      fd.set('founded_year', defaults.founded_year);
      fd.set('website', defaults.website);
      fd.set('contact_name', defaults.contact_name);
      fd.set('contact_role', defaults.contact_role);
      fd.set('contact_email', defaults.contact_email);
      fd.set('contact_phone', defaults.contact_phone);
      fd.set('address_province', defaults.province);

      const res = await updateCompanyAction(null, fd);
      if (!res || !('error' in res)) {
        setSaved(true);
        router.refresh();
        setOpen(false);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            {logoUrl && <AvatarImage src={logoUrl} alt="" />}
            <AvatarFallback className="bg-accent-warm/15 text-accent-warm">
              <Building2 className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-foreground">
              {form.name || 'Tu empresa'}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {form.industry || 'Añade el sector de actividad'}
            </p>
          </div>
          <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'soft'}>
            {score}%
          </Badge>
        </div>

        {score < 100 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-accent-warm/30 bg-accent-warm/10 px-5 py-3.5 text-left transition-colors hover:bg-accent-warm/15"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium text-accent-warm">
              <AlertTriangle className="h-4 w-4" /> Tu perfil está al {score}% — Completar perfil
            </span>
            <ChevronRight className="h-4 w-4 text-accent-warm" />
          </button>
        )}

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Estado del perfil</h3>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-2 text-xs">
                {i.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />
                )}
                <span className={i.done ? 'text-muted-foreground' : 'text-foreground'}>
                  {i.label}
                </span>
              </li>
            ))}
          </ul>
          <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 w-full rounded-xl">
            Editar perfil
          </Button>
        </div>

        <Link
          href="/admin/facturacion"
          className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
            <CreditCard className="h-4 w-4 text-muted-foreground" /> Datos de facturación
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/dashboard/configuracion"
          className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
            <Settings className="h-4 w-4 text-muted-foreground" /> Configuración de la cuenta
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Completar perfil de empresa"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 animate-in fade-in-0"
          />
          <div className="absolute inset-x-0 bottom-0 top-[5%] flex flex-col overflow-hidden rounded-t-3xl bg-background animate-in slide-in-from-bottom duration-300">
            <header
              className="flex items-center justify-between border-b border-border px-5 py-3"
              style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Perfil de empresa</p>
                <p className="text-xs text-muted-foreground">{score}% completado</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="h-1.5 w-full bg-muted">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-accent-warm'
                )}
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
              <section>
                <h3 className="font-display text-lg text-foreground">Imagen y datos básicos</h3>
                <div className="mt-3 space-y-3">
                  <AvatarUpload
                    currentUrl={logoUrl}
                    initials={initials}
                    label="Imagen de empresa"
                    uploadAction={uploadCompanyLogoAction}
                  />
                  <div className="space-y-1.5">
                    <Label>Nombre de la empresa</Label>
                    <Input value={form.name} onChange={set('name')} required placeholder="Mi Empresa S.L." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sector económico</Label>
                    <select
                      value={form.industry}
                      onChange={set('industry')}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecciona…</option>
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Ubicación de la empresa</Label>
                    <Input
                      value={form.location}
                      onChange={set('location')}
                      placeholder="Ej: Madrid, España"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-display text-lg text-foreground">Valores y cultura</h3>
                <div className="mt-3 space-y-1.5">
                  <Label>Describe los valores y la cultura de tu empresa</Label>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    rows={7}
                    maxLength={1200}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Cuéntales a los candidatos cómo trabajáis, qué valores guían vuestro día a día y qué hace especial a tu empresa."
                  />
                  <p className="text-right text-[11px] text-muted-foreground">
                    {form.description.length}/1200
                  </p>
                </div>
              </section>
            </div>

            <div
              className="border-t border-border p-4"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
            >
              <Button onClick={submit} disabled={saving} className="h-11 w-full rounded-xl text-sm font-semibold">
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {saved && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-success/30 bg-success-soft px-4 py-2 text-sm text-success shadow-md">
          Perfil de empresa actualizado.
        </div>
      )}
    </>
  );
}
