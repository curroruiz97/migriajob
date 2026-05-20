'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { createTemplateAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type State = { ok?: true; error?: string } | null;

export function TemplateForm() {
  const [state, action, pending] = useActionState<State, FormData>(createTemplateAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && 'ok' in state && state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg text-foreground">Nueva plantilla</h2>
      <p className="text-xs text-muted-foreground">
        Usa <code className="rounded bg-muted px-1">{'{nombre}'}</code> y otras variables que se reemplazarán al enviar.
      </p>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required maxLength={80} placeholder="Primera toma de contacto" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Mensaje</Label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          placeholder="Hola {nombre}, ..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {state && 'error' in state && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        <Plus className="mr-1.5 h-4 w-4" />
        {pending ? 'Guardando…' : 'Crear plantilla'}
      </Button>
    </form>
  );
}
