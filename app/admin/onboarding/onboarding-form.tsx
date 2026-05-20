'use client';

import { useActionState } from 'react';
import { createCompanyAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type State = { ok?: true; error?: string } | null;

export function OnboardingForm({ defaultName }: { defaultName?: string }) {
  const [state, action, pending] = useActionState<State, FormData>(createCompanyAction, null);

  return (
    <form
      action={action}
      className="space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      {state?.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la empresa</Label>
        <Input id="name" name="name" required minLength={2} maxLength={120} defaultValue={defaultName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Web (opcional)</Label>
        <Input id="website" name="website" type="url" placeholder="https://miempresa.com" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Sector</Label>
          <Input id="industry" name="industry" placeholder="SaaS, Fintech…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Tamaño</Label>
          <select
            id="size"
            name="size"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">—</option>
            <option value="1-10">1-10 personas</option>
            <option value="11-50">11-50 personas</option>
            <option value="51-200">51-200 personas</option>
            <option value="201-500">201-500 personas</option>
            <option value="501-1000">501-1000 personas</option>
            <option value="1000+">Más de 1000</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Ubicación</Label>
        <Input id="location" name="location" placeholder="Madrid, España" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción breve (opcional)</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          placeholder="¿A qué se dedica tu empresa?"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creando…' : 'Crear empresa y continuar'}
      </Button>
    </form>
  );
}
