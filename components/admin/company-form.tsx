'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { updateCompanyAction } from '@/app/admin/perfil-empresa/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Result = { ok?: true } | { error: string } | null;

export interface CompanyDefaults {
  name: string;
  tax_id: string;
  industry: string;
  size: string;
  founded_year: string;
  website: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  description: string;
  logo_url: string;
}

const SECTORS = [
  'Hostelería y turismo',
  'Producción',
  'Logística',
  'Construcción',
  'Mantenimiento',
  'Limpieza',
  'Agricultura',
  'Otro',
];
const SIZES = ['1-10', '11-50', '51-200', '200+'];

export function CompanyForm({ defaults }: { defaults: CompanyDefaults }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<Result, FormData>(updateCompanyAction, null);

  // Refresca la ruta al guardar para que el logo del topbar se actualice (Bug 4/6).
  useEffect(() => {
    if (state && 'ok' in state && state.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      {state && 'ok' in state && state.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> Perfil de empresa actualizado.
        </div>
      )}
      {state && 'error' in state && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}

      <Section title="Datos de la empresa">
        <Field label="Nombre comercial / razón social" full>
          <Input name="name" defaultValue={defaults.name} required placeholder="Grupo Hostelero S.L." />
        </Field>
        <Field label="CIF / NIF">
          <Input name="tax_id" defaultValue={defaults.tax_id} placeholder="B12345678" />
        </Field>
        <Field label="Año de fundación">
          <Input name="founded_year" type="number" min={1900} max={2100} defaultValue={defaults.founded_year} placeholder="2015" />
        </Field>
        <Field label="Sector de actividad">
          <Select name="industry" defaultValue={defaults.industry}>
            <option value="">Selecciona…</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Número de empleados">
          <Select name="size" defaultValue={defaults.size}>
            <option value="">Selecciona…</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Sitio web">
          <Input name="website" defaultValue={defaults.website} type="url" placeholder="https://tuempresa.com" />
        </Field>
        <Field label="URL del logotipo">
          <Input name="logo_url" defaultValue={defaults.logo_url} type="url" placeholder="https://…/logo.png" />
        </Field>
      </Section>

      <Separator />

      <Section title="Contacto">
        <Field label="Persona de contacto (nombre y cargo)" full>
          <Input name="contact_name" defaultValue={defaults.contact_name} placeholder="María Fernández — Dir. RR. HH." />
        </Field>
        <Field label="Email corporativo">
          <Input name="contact_email" defaultValue={defaults.contact_email} type="email" placeholder="rrhh@tuempresa.com" />
        </Field>
        <Field label="Teléfono">
          <Input name="contact_phone" defaultValue={defaults.contact_phone} type="tel" placeholder="+34 600 000 000" />
        </Field>
        <Field label="Ciudad / provincia" full>
          <Input name="location" defaultValue={defaults.location} placeholder="Madrid" />
        </Field>
      </Section>

      <Separator />

      <Section title="Sobre la empresa">
        <Field label="Descripción" full>
          <textarea
            name="description"
            defaultValue={defaults.description}
            rows={5}
            maxLength={800}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Describe tu empresa, tu cultura de trabajo y qué ofreces a tus empleados."
          />
        </Field>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="rounded-xl">
          {pending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'space-y-1.5 sm:col-span-2' : 'space-y-1.5'}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </select>
  );
}
