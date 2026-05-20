'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { updateAvailabilityAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Availability = 'open' | 'passive' | 'closed';

const OPTIONS: { value: Availability; title: string; description: string; color: string }[] = [
  {
    value: 'open',
    title: 'Disponible inmediatamente',
    description: 'Estoy buscando activamente nuevas oportunidades.',
    color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
  },
  {
    value: 'passive',
    title: 'Abierto a oportunidades',
    description: 'No busco activamente, pero escucho propuestas interesantes.',
    color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
  },
  {
    value: 'closed',
    title: 'No disponible',
    description: 'Ahora mismo no me interesan nuevas ofertas.',
    color: 'border-zinc-300 bg-zinc-50/40 dark:bg-zinc-900/40',
  },
];

export function AvailabilityToggle({
  initialAvailability,
  initialIsPublic,
}: {
  initialAvailability: Availability;
  initialIsPublic: boolean;
}) {
  const [availability, setAvailability] = useState<Availability>(initialAvailability);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    startTransition(async () => {
      await updateAvailabilityAction(availability, isPublic);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {saved && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          Disponibilidad guardada.
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold">Estado actual</h2>
        <div className="mt-3 grid gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAvailability(opt.value)}
              className={cn(
                'rounded-lg border px-4 py-3 text-left transition-colors',
                availability === opt.value
                  ? opt.color
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'
              )}
            >
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {opt.title}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              {isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Perfil visible públicamente
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Si está activo, las empresas pueden encontrarte buscando perfiles.
              {isPublic ? (
                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700">
                  Visible
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2">Oculto</Badge>
              )}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}
