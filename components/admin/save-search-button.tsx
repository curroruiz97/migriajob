'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookmarkPlus, Check } from 'lucide-react';
import { saveSearchAction } from '@/app/admin/busquedas-guardadas/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Frequency = 'off' | 'daily' | 'weekly' | 'instant';

export function SaveSearchButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => { filters[key] = value; });

  const hasFilters = Object.keys(filters).length > 0;
  if (!hasFilters) return null; // Solo aparece cuando hay filtros activos

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const r = await saveSearchAction({ name: name.trim(), filters, alertFrequency: frequency });
      if ('error' in r && r.error) {
        setError(r.error);
        return;
      }
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setName('');
        router.refresh();
      }, 1200);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
          Guardar búsqueda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guardar esta búsqueda</DialogTitle>
          <DialogDescription>
            Te avisaremos por email cuando aparezcan candidatos nuevos que cumplan estos filtros.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="searchName">Nombre</Label>
            <Input
              id="searchName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cocineros peruanos en Madrid"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freq">Frecuencia de alertas</Label>
            <select
              id="freq"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="off">Sin alertas</option>
              <option value="instant">Instantáneas</option>
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>

          <div className="rounded-lg border border-border bg-surface-muted/40 p-3 text-xs">
            <p className="font-semibold text-foreground">Filtros incluidos:</p>
            <ul className="mt-2 space-y-0.5 text-muted-foreground">
              {Object.entries(filters).map(([k, v]) => (
                <li key={k}>· <strong>{k}</strong>: {v}</li>
              ))}
            </ul>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={pending || done || !name.trim()}>
            {done ? <><Check className="mr-1.5 h-4 w-4" /> Guardada</> : pending ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
