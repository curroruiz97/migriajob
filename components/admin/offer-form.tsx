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

// Categorías de puesto (foco hostelería + industria).
const CATEGORIES = [
  'Cocinero',
  'Camarero',
  'Jefe de sala',
  'Hostelería',
  'Operario de producción',
  'Pescadero',
  'Técnico de mantenimiento',
  'Supervisor',
  'Otro',
];

const COUNTRIES = ['España', 'Perú'];

export interface OfferDefaults {
  title: string;
  category: string;
  description: string;
  requirements: string;
  country: string;
  city: string;
  job_type: string;
  work_mode: string;
  salary_min: string;
  salary_max: string;
  start_date: string;
  status: string;
}

const EMPTY: OfferDefaults = {
  title: '',
  category: '',
  description: '',
  requirements: '',
  country: 'España',
  city: '',
  job_type: 'full_time',
  work_mode: 'on_site',
  salary_min: '',
  salary_max: '',
  start_date: '',
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
        <Label>Título del puesto *</Label>
        <Input name="title" defaultValue={d.title} required placeholder="Cocinero/a para restaurante" />
      </div>

      <div className="space-y-1.5">
        <Label>Categoría *</Label>
        <Select name="category" defaultValue={d.category} required>
          <option value="" disabled>
            Selecciona una categoría…
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Descripción del puesto *</Label>
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
        <Label>Requisitos *</Label>
        <textarea
          name="requirements"
          defaultValue={d.requirements}
          required
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Experiencia, formación, idiomas…"
        />
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Modalidad *</Label>
          <Select name="job_type" defaultValue={d.job_type} required>
            <option value="full_time">Jornada completa</option>
            <option value="part_time">Media jornada</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tipo *</Label>
          <Select name="work_mode" defaultValue={d.work_mode} required>
            <option value="on_site">Presencial</option>
            <option value="remote">Teletrabajo</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>País *</Label>
          <Select name="country" defaultValue={d.country || 'España'} required>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Ciudad *</Label>
          <Input name="city" defaultValue={d.city} required placeholder="Madrid" />
        </div>
        <div className="space-y-1.5">
          <Label>Salario mínimo (€/mes)</Label>
          <Input name="salary_min" type="number" min={0} step={50} defaultValue={d.salary_min} placeholder="1400" />
        </div>
        <div className="space-y-1.5">
          <Label>Salario máximo (€/mes)</Label>
          <Input name="salary_max" type="number" min={0} step={50} defaultValue={d.salary_max} placeholder="1800" />
        </div>
        <div className="space-y-1.5">
          <Label>Fecha de incorporación</Label>
          <Input name="start_date" type="date" defaultValue={d.start_date} />
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select name="status" defaultValue={d.status}>
            <option value="published">Activa (publicada)</option>
            <option value="paused">Pausada</option>
            <option value="archived">Cerrada</option>
          </Select>
        </div>
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
  required,
  children,
}: {
  name: string;
  defaultValue: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      required={required}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </select>
  );
}
