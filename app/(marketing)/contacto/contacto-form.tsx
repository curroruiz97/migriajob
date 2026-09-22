'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { enviarConsultaAction, type EstadoContacto } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const inicial: EstadoContacto = {};

const SELECT_CLASS =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ContactoForm() {
  const [state, formAction, pending] = useActionState(enviarConsultaAction, inicial);

  if (state.ok) {
    return (
      <div className="mt-10 rounded-2xl border border-success/30 bg-success-soft p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-4 font-display text-2xl text-foreground">Recibido. Gracias.</h3>
        <p className="mt-2 text-muted-foreground">
          Tu consulta ya está con el equipo de Talnet. Te respondemos en horario laboral,
          normalmente el mismo día.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 space-y-5 rounded-2xl border border-border bg-surface p-8">
      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      {/* Trampa para robots: fuera de la vista y fuera del recorrido del
          tabulador, de modo que una persona no llega nunca a él. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No rellenar</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo *</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+34 600 000 000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Soy *</Label>
          <select id="role" name="role" required className={SELECT_CLASS} defaultValue="">
            <option value="" disabled>
              Selecciona…
            </option>
            <option value="company">Empresa que busca empleados</option>
            <option value="candidate">Candidato que busca empleo</option>
            <option value="partner">Partner / colaborador</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Empresa (si aplica)</Label>
        <Input id="company" name="company" autoComplete="organization" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sector">Sector de interés</Label>
        <select id="sector" name="sector" className={SELECT_CLASS} defaultValue="">
          <option value="">—</option>
          <option value="hosteleria">Hostelería y turismo</option>
          <option value="logistica">Logística y transporte</option>
          <option value="construccion">Construcción y obra civil</option>
          <option value="mantenimiento">Mantenimiento y servicios técnicos</option>
          <option value="limpieza">Limpieza y servicios auxiliares</option>
          <option value="agricultura">Agricultura y agroindustria</option>
          <option value="industria">Industria y producción</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Cuéntanos *</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Si eres empresa: cuántos puestos, qué perfiles, para cuándo. Si eres candidato: tu profesión, experiencia y desde qué país escribes."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input id="privacidad" type="checkbox" required className="mt-0.5" />
        <span>
          Acepto la{' '}
          <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
            Política de privacidad
          </Link>{' '}
          y el tratamiento de mis datos para responderme.
        </span>
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar mensaje'}
      </Button>
    </form>
  );
}
