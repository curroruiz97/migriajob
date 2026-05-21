'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, X, Settings, ChevronRight, CreditCard, Building2 } from 'lucide-react';
import { updateCompanyAction } from '@/app/admin/perfil-empresa/actions';
import { uploadCompanyLogoAction } from '@/app/dashboard/storage-actions';
import { AvatarUpload } from '@/components/employee/file-uploads';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SECTORS = [
  'Hostelería y turismo',
  'Producción',
  'Logística y transporte',
  'Construcción y obra civil',
  'Mantenimiento y servicios técnicos',
  'Limpieza y servicios auxiliares',
  'Agricultura y agroindustria',
  'Otro',
];
const SIZES = ['1-10', '11-50', '51-200', '200+'];
const PROVINCIAS = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba',
  'A Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén',
  'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
  'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
  'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Bizkaia',
  'Zamora', 'Zaragoza', 'Ceuta', 'Melilla',
];

export interface CompanyDefaults {
  name: string;
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
  const [form, setForm] = useState(defaults);
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const { score, items } = useMemo(() => {
    const its = [
      { key: 'logo', label: 'Logotipo', done: !!logoUrl, w: 12 },
      { key: 'name', label: 'Nombre / razón social', done: form.name.trim() !== '', w: 12 },
      { key: 'cif', label: 'CIF / NIF', done: form.tax_id.trim() !== '', w: 10 },
      { key: 'sector', label: 'Sector de actividad', done: form.industry.trim() !== '', w: 10 },
      { key: 'cname', label: 'Persona de contacto', done: form.contact_name.trim() !== '', w: 10 },
      { key: 'crole', label: 'Cargo del contacto', done: form.contact_role.trim() !== '', w: 8 },
      { key: 'cemail', label: 'Email corporativo', done: form.contact_email.trim() !== '', w: 10 },
      { key: 'cphone', label: 'Teléfono', done: form.contact_phone.trim() !== '', w: 8 },
      { key: 'city', label: 'Ciudad', done: form.city.trim() !== '', w: 10 },
      { key: 'prov', label: 'Provincia', done: form.province.trim() !== '', w: 10 },
      // Opcionales (bonus)
      { key: 'size', label: 'Número de empleados', done: form.size.trim() !== '', w: 3, opt: true },
      { key: 'year', label: 'Año de fundación', done: form.founded_year.trim() !== '', w: 3, opt: true },
      { key: 'web', label: 'Sitio web', done: form.website.trim() !== '', w: 3, opt: true },
      { key: 'desc', label: 'Descripción', done: form.description.trim() !== '', w: 3, opt: true },
    ];
    return { score: Math.min(100, its.reduce((s, i) => s + (i.done ? i.w : 0), 0)), items: its };
  }, [form, logoUrl]);

  const initials = (form.name || 'E').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  function submit() {
    startSave(async () => {
      const fd = new FormData();
      fd.set('name', form.name);
      fd.set('tax_id', form.tax_id);
      fd.set('industry', form.industry);
      fd.set('size', form.size);
      fd.set('founded_year', form.founded_year);
      fd.set('website', form.website);
      fd.set('contact_name', form.contact_name);
      fd.set('contact_role', form.contact_role);
      fd.set('contact_email', form.contact_email);
      fd.set('contact_phone', form.contact_phone);
      fd.set('location', form.city); // ciudad → companies.location
      fd.set('address_province', form.province);
      fd.set('description', form.description);
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
            <AvatarFallback className="bg-accent-warm/15 text-accent-warm"><Building2 className="h-7 w-7" /></AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-foreground">{form.name || 'Tu empresa'}</h2>
            <p className="truncate text-sm text-muted-foreground">{form.industry || 'Añade el sector de actividad'}</p>
          </div>
          <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'soft'}>{score}%</Badge>
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
          <h3 className="text-sm font-semibold text-foreground">Secciones del perfil</h3>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-2 text-xs">
                {i.done ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" /> : <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />}
                <span className={i.done ? 'text-muted-foreground' : 'text-foreground'}>{i.label}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 w-full rounded-xl">Editar perfil</Button>
        </div>

        <Link href="/admin/facturacion" className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted">
          <span className="flex items-center gap-3 text-sm font-medium text-foreground"><CreditCard className="h-4 w-4 text-muted-foreground" /> Datos de facturación</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link href="/dashboard/configuracion" className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted">
          <span className="flex items-center gap-3 text-sm font-medium text-foreground"><Settings className="h-4 w-4 text-muted-foreground" /> Configuración de la cuenta</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Completar perfil de empresa">
          <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40 animate-in fade-in-0" />
          <div className="absolute inset-x-0 bottom-0 top-[5%] flex flex-col overflow-hidden rounded-t-3xl bg-background animate-in slide-in-from-bottom duration-300">
            <header className="flex items-center justify-between border-b border-border px-5 py-3" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
              <div>
                <p className="text-sm font-semibold text-foreground">Completar perfil de empresa</p>
                <p className="text-xs text-muted-foreground">{score}% completado</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </header>
            <div className="h-1.5 w-full bg-muted">
              <div className={cn('h-full transition-all duration-500', score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-accent-warm')} style={{ width: `${score}%` }} />
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
              <Section title="Datos de la empresa">
                <AvatarUpload currentUrl={logoUrl} initials={initials} label="Logotipo" uploadAction={uploadCompanyLogoAction} />
                <Grid>
                  <FieldEl label="Nombre comercial / razón social" full><Input value={form.name} onChange={set('name')} required /></FieldEl>
                  <FieldEl label="CIF / NIF"><Input value={form.tax_id} onChange={set('tax_id')} placeholder="B12345678" /></FieldEl>
                  <FieldEl label="Sector de actividad">
                    <SelectEl value={form.industry} onChange={set('industry')}>
                      <option value="">Selecciona…</option>
                      {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </SelectEl>
                  </FieldEl>
                  <FieldEl label="Número de empleados">
                    <SelectEl value={form.size} onChange={set('size')}>
                      <option value="">Selecciona…</option>
                      {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </SelectEl>
                  </FieldEl>
                  <FieldEl label="Año de fundación"><Input type="number" min={1900} max={2100} value={form.founded_year} onChange={set('founded_year')} placeholder="2015" /></FieldEl>
                  <FieldEl label="Sitio web" full><Input type="url" value={form.website} onChange={set('website')} placeholder="https://tuempresa.com" /></FieldEl>
                </Grid>
              </Section>

              <Separator />

              <Section title="Persona de contacto">
                <Grid>
                  <FieldEl label="Nombre del contacto"><Input value={form.contact_name} onChange={set('contact_name')} /></FieldEl>
                  <FieldEl label="Cargo del contacto"><Input value={form.contact_role} onChange={set('contact_role')} placeholder="Dir. RR. HH." /></FieldEl>
                  <FieldEl label="Email corporativo"><Input type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="rrhh@empresa.com" /></FieldEl>
                  <FieldEl label="Teléfono"><Input type="tel" value={form.contact_phone} onChange={set('contact_phone')} placeholder="+34 600 000 000" /></FieldEl>
                  <FieldEl label="Ciudad"><Input value={form.city} onChange={set('city')} placeholder="Madrid" /></FieldEl>
                  <FieldEl label="Provincia">
                    <SelectEl value={form.province} onChange={set('province')}>
                      <option value="">Selecciona…</option>
                      {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </SelectEl>
                  </FieldEl>
                </Grid>
              </Section>

              <Separator />

              <Section title="Sobre la empresa">
                <FieldEl label="Descripción" full>
                  <textarea value={form.description} onChange={set('description')} rows={5} maxLength={800} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Describe tu empresa, tu cultura de trabajo y qué ofreces a tus empleados" />
                  <p className="text-right text-[11px] text-muted-foreground">{form.description.length}/800</p>
                </FieldEl>
              </Section>
            </div>

            <div className="border-t border-border p-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function FieldEl({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('space-y-1.5', full && 'sm:col-span-2')}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function SelectEl({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={onChange} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </select>
  );
}
