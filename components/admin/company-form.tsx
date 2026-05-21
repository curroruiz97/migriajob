'use client';

import { useActionState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { updateCompanyAction } from '@/app/admin/perfil-empresa/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Result = { ok?: true } | { error: string } | null;

export interface CompanyDefaults {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  logo_url: string;
}

export function CompanyForm({ defaults }: { defaults: CompanyDefaults }) {
  const [state, action, pending] = useActionState<Result, FormData>(updateCompanyAction, null);

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
        <Field label="Sector de actividad">
          <Input name="industry" defaultValue={defaults.industry} placeholder="Hostelería" />
        </Field>
        <Field label="Número de empleados">
          <Input name="size" defaultValue={defaults.size} placeholder="11–50" />
        </Field>
      </Section>

      <Separator />

      <Section title="Contacto y presencia">
        <Field label="Ubicación / sede">
          <Input name="location" defaultValue={defaults.location} placeholder="Madrid" />
        </Field>
        <Field label="Sitio web">
          <Input name="website" defaultValue={defaults.website} type="url" placeholder="https://tuempresa.com" />
        </Field>
        <Field label="URL del logotipo" full>
          <Input name="logo_url" defaultValue={defaults.logo_url} type="url" placeholder="https://…/logo.png" />
        </Field>
      </Section>

      <Separator />

      <Section title="Sobre nosotros">
        <Field label="Descripción de la empresa" full>
          <textarea
            name="description"
            defaultValue={defaults.description}
            rows={5}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Presenta tu empresa, su cultura y qué ofrece a los empleados."
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
