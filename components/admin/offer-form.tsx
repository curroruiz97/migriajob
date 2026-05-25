'use client';

/**
 * Formulario de creación / edición de oferta — versión simplificada.
 *
 * Visible al empleador: SOLO 4 campos (título, descripción, ubicación, salario).
 * El resto (job_type, work_mode, status, country, category…) se rellena con
 * valores por defecto razonables para que la API/BD acepten la inserción
 * sin obligar al empleador a configurarlos. Se pueden añadir más adelante.
 */

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { createJobAction, updateJobAction } from '@/app/admin/ofertas/actions';
import { Button } from '@/components/ui/button';
import { DateWheelPicker } from '@/components/ui/date-wheel-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Result = { ok?: true } | { error: string } | null;

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
  category: 'Otro',
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
  const [startDate, setStartDate] = useState<string>(d.start_date);

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
        <Input name="title" defaultValue={d.title} required placeholder="Ej: Cocinero/a para restaurante" />
      </div>

      <div className="space-y-1.5">
        <Label>Descripción detallada del puesto *</Label>
        <textarea
          name="description"
          defaultValue={d.description}
          required
          rows={7}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Funciones del puesto, horario, equipo, requisitos imprescindibles, beneficios…"
        />
        <p className="text-[11px] text-muted-foreground">
          Cuéntales a los candidatos qué van a hacer y qué buscas en la persona ideal.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Ubicación *</Label>
        <Input name="city" defaultValue={d.city} required placeholder="Ej: Madrid · España" />
        <p className="text-[11px] text-muted-foreground">
          Ciudad, provincia o región donde se trabaja.
        </p>
      </div>

      <Separator />

      <div>
        <Label className="mb-1.5 block">Salario ofrecido</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              name="salary_min"
              type="number"
              min={0}
              step={50}
              defaultValue={d.salary_min}
              placeholder="Mínimo €/mes"
            />
            <p className="text-[11px] text-muted-foreground">Mínimo</p>
          </div>
          <div className="space-y-1">
            <Input
              name="salary_max"
              type="number"
              min={0}
              step={50}
              defaultValue={d.salary_max}
              placeholder="Máximo €/mes"
            />
            <p className="text-[11px] text-muted-foreground">Máximo</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Fecha de incorporación (opcional)</Label>
        <DateWheelPicker
          name="start_date"
          mode="date"
          value={startDate}
          onChange={setStartDate}
          placeholder="Sin definir"
          minYear={new Date().getFullYear()}
          maxYear={new Date().getFullYear() + 2}
        />
      </div>

      {/* Campos requeridos por BD, con valores por defecto invisibles para el usuario. */}
      <input type="hidden" name="category" value={d.category || 'Otro'} />
      <input type="hidden" name="requirements" value={d.requirements || 'Ver descripción del puesto.'} />
      <input type="hidden" name="country" value={d.country || 'España'} />
      <input type="hidden" name="job_type" value={d.job_type || 'full_time'} />
      <input type="hidden" name="work_mode" value={d.work_mode || 'on_site'} />
      <input type="hidden" name="status" value={d.status || 'published'} />

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
