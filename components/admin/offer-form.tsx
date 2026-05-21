'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { createJobAction, updateJobAction } from '@/app/admin/ofertas/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Result = { ok?: true } | { error: string } | null;

export interface OfferDefaults {
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  work_mode: string;
  salary_min: string;
  salary_max: string;
  skills: string;
  status: string;
}

const EMPTY: OfferDefaults = {
  title: '',
  description: '',
  requirements: '',
  location: '',
  job_type: 'full_time',
  work_mode: 'on_site',
  salary_min: '',
  salary_max: '',
  skills: '',
  status: 'published',
};

export function OfferForm({ jobId, defaults }: { jobId?: string; defaults?: OfferDefaults }) {
  const d = defaults ?? EMPTY;
  const router = useRouter();
  const action = jobId ? updateJobAction.bind(null, jobId) : createJobAction;
  const [state, formAction, pending] = useActionState<Result, FormData>(action, null);

  useEffect(() => {
    if (state && 'ok' in state && state.ok) {
      router.push('/admin/ofertas');
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      {state && 'error' in state && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Título del puesto</Label>
        <Input name="title" defaultValue={d.title} required placeholder="Cocinero/a" />
      </div>

      <div className="space-y-1.5">
        <Label>Descripción del puesto</Label>
        <textarea
          name="description"
          defaultValue={d.description}
          required
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Funciones, equipo, horarios…"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Requisitos</Label>
        <textarea
          name="requirements"
          defaultValue={d.requirements}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Experiencia, formación, idiomas…"
        />
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Jornada</Label>
          <Select name="job_type" defaultValue={d.job_type}>
            <option value="full_time">Jornada completa</option>
            <option value="part_time">Media jornada</option>
            <option value="contract">Por contrato</option>
            <option value="internship">Prácticas</option>
            <option value="freelance">Freelance</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Modalidad</Label>
          <Select name="work_mode" defaultValue={d.work_mode}>
            <option value="on_site">Presencial</option>
            <option value="hybrid">Híbrido</option>
            <option value="remote">Teletrabajo</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Ubicación</Label>
          <Input name="location" defaultValue={d.location} placeholder="Madrid" />
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select name="status" defaultValue={d.status}>
            <option value="published">Activa (publicada)</option>
            <option value="paused">Pausada</option>
            <option value="draft">Borrador</option>
            <option value="archived">Cerrada</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Salario mínimo (€/año)</Label>
          <Input name="salary_min" type="number" min={0} step={1000} defaultValue={d.salary_min} />
        </div>
        <div className="space-y-1.5">
          <Label>Salario máximo (€/año)</Label>
          <Input name="salary_max" type="number" min={0} step={1000} defaultValue={d.salary_max} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Habilidades / aptitudes (separadas por comas)</Label>
        <Input name="skills" defaultValue={d.skills} placeholder="Cocina española, APPCC, trabajo en equipo" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/ofertas')}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending} className="rounded-xl">
          {pending ? 'Guardando…' : jobId ? 'Guardar cambios' : 'Publicar oferta'}
        </Button>
      </div>
    </form>
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
