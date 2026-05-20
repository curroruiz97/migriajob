'use client';

import { useActionState } from 'react';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { requestPasswordResetAction, type AuthState } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initial: AuthState = {};

export function RecuperarForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial);

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.ok && (
        <div className="flex items-start gap-2 rounded-xl border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Correo enviado</p>
            <p className="text-xs opacity-90">
              Revisa tu bandeja de entrada (y la carpeta de spam). El enlace caduca en 1 hora.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Email de tu cuenta
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm"
        disabled={pending}
      >
        {pending ? 'Enviando…' : 'Enviar enlace de recuperación'}
      </Button>
    </form>
  );
}
