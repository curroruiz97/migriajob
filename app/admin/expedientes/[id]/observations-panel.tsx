'use client';

import { useState, useTransition } from 'react';
import {
  MessageSquareText,
  Plus,
  Trash2,
  Pin,
  PinOff,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  createObservationAction,
  deleteObservationAction,
  toggleObservationPinAction,
} from '../actions';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  administrativo: { label: 'Administrativo', color: 'bg-blue-100 text-blue-700' },
  comercial: { label: 'Comercial', color: 'bg-purple-100 text-purple-700' },
  legal: { label: 'Legal', color: 'bg-amber-100 text-amber-700' },
  operativo: { label: 'Operativo', color: 'bg-emerald-100 text-emerald-700' },
  incidencia: { label: 'Incidencia', color: 'bg-red-100 text-red-700' },
  general: { label: 'General', color: 'bg-zinc-100 text-zinc-700' },
};

type Observation = {
  id: string;
  category: string;
  body: string;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
};

export function ObservationsPanel({
  journeyId,
  observations,
}: {
  journeyId: string;
  observations: Observation[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createObservationAction({
        journey_id: journeyId,
        category: fd.get('category') as any,
        body: fd.get('body') as string,
        is_pinned: fd.get('is_pinned') === 'on',
      });
      setShowForm(false);
    });
  }

  function removeObs(id: string) {
    if (!confirm('¿Eliminar esta observación?')) return;
    startTransition(async () => {
      await deleteObservationAction(id);
    });
  }

  function togglePin(id: string, currentlyPinned: boolean) {
    startTransition(async () => {
      await toggleObservationPinAction(id, !currentlyPinned);
    });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <MessageSquareText className="h-4 w-4" />
          Observaciones internas
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? 'Cancelar' : 'Nueva observación'}
        </button>
      </div>

      {/* New observation form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-primary/20 bg-primary-soft/10 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Categoría</label>
              <select name="category" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_pinned" className="rounded border-border" />
                <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                Fijar arriba
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Observación *</label>
            <textarea
              name="body"
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Escribe la observación..."
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Guardar observación'}
          </button>
        </form>
      )}

      {/* Observations list */}
      {observations.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-4">
          No hay observaciones registradas.
        </p>
      ) : (
        <ul className="space-y-2">
          {observations.map((obs) => {
            const cat = CATEGORY_LABELS[obs.category] ?? CATEGORY_LABELS.general;
            return (
              <li
                key={obs.id}
                className={cn(
                  'rounded-lg border p-3',
                  obs.is_pinned ? 'border-primary/30 bg-primary-soft/10' : 'border-border bg-surface'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', cat.color)}>
                        {cat.label}
                      </span>
                      {obs.is_pinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(obs.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-line text-sm text-foreground leading-relaxed">
                      {obs.body}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => togglePin(obs.id, obs.is_pinned)}
                      disabled={isPending}
                      className="rounded p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      title={obs.is_pinned ? 'Desfijar' : 'Fijar'}
                    >
                      {obs.is_pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeObs(obs.id)}
                      disabled={isPending}
                      className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
