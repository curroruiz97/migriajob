'use client';

import { useActionState } from 'react';
import { updateProfileAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Defaults {
  fullName: string;
  phone: string;
  headline: string;
  currentRole: string;
  bio: string;
  yearsExperience: number | null;
  desiredSalaryMin: number | null;
  skills: string;
}

export function ProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(updateProfileAction, null as { ok?: true } | null);

  return (
    <form action={action} className="space-y-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {state?.ok && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          Perfil actualizado.
        </div>
      )}

      <Section title="Datos personales">
        <Field label="Nombre completo">
          <Input name="fullName" defaultValue={defaults.fullName} required />
        </Field>
        <Field label="Teléfono (opcional)">
          <Input name="phone" defaultValue={defaults.phone} type="tel" />
        </Field>
      </Section>

      <Separator />

      <Section title="Perfil profesional">
        <Field label="Titular (headline)">
          <Input
            name="headline"
            defaultValue={defaults.headline}
            placeholder="Senior Frontend Developer | React + Next.js"
          />
        </Field>
        <Field label="Rol actual">
          <Input name="currentRole" defaultValue={defaults.currentRole} placeholder="Frontend Developer en Acme Corp" />
        </Field>
        <Field label="Sobre mí" full>
          <textarea
            name="bio"
            defaultValue={defaults.bio}
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Cuenta brevemente tu trayectoria, tecnologías que dominas e intereses."
          />
        </Field>
      </Section>

      <Separator />

      <Section title="Experiencia y expectativas">
        <Field label="Años de experiencia">
          <Input
            name="yearsExperience"
            type="number"
            min={0}
            max={40}
            defaultValue={defaults.yearsExperience ?? ''}
          />
        </Field>
        <Field label="Salario esperado (€/año, mínimo)">
          <Input
            name="desiredSalaryMin"
            type="number"
            min={0}
            step={1000}
            defaultValue={defaults.desiredSalaryMin ?? ''}
          />
        </Field>
        <Field label="Skills (separadas por comas)" full>
          <Input
            name="skills"
            defaultValue={defaults.skills}
            placeholder="React, TypeScript, Next.js, PostgreSQL"
          />
        </Field>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
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
