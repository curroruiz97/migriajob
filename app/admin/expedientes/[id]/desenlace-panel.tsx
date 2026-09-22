'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cerrarExpedienteAction, reabrirExpedienteAction } from '../actions';
import { MOTIVOS_DE_CIERRE } from '@/lib/journey-outcome';

/**
 * Cómo acabó el proceso.
 *
 * Es lo que convierte un expediente parado en un dato: sin esto, uno
 * abandonado y uno lento se ven igual desde fuera, y no hay forma de medir en
 * qué paso se sale la gente. Se rellena una vez, cuando el proceso termina.
 *
 * El motivo se elige de una lista cerrada a propósito. En texto libre cada uno
 * escribe lo suyo —"se echó atrás", "no quiso", "se rajó"— y luego no hay nada
 * que contar. La nota queda para el matiz.
 */

interface Props {
  journeyId: string;
  outcome: 'en_curso' | 'incorporado' | 'cerrado';
  closeReason: string | null;
  closeNote: string | null;
  closedAt: string | null;
  etapaActual: string;
}

export function DesenlacePanel({
  journeyId,
  outcome,
  closeReason,
  closeNote,
  closedAt,
  etapaActual,
}: Props) {
  const [pendiente, startTransition] = useTransition();
  const [eligiendo, setEligiendo] = useState(false);
  const [motivo, setMotivo] = useState('renuncia_candidato');
  const [nota, setNota] = useState('');

  const cerrar = (desenlace: 'incorporado' | 'cerrado') => {
    startTransition(async () => {
      await cerrarExpedienteAction(journeyId, desenlace, motivo, nota);
      setEligiendo(false);
      setNota('');
    });
  };

  if (outcome !== 'en_curso') {
    const bueno = outcome === 'incorporado';
    return (
      <div
        className={`rounded-xl border p-5 ${
          bueno ? 'border-success/30 bg-success-soft' : 'border-border bg-surface-muted'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`flex items-center gap-2 font-medium ${bueno ? 'text-success' : ''}`}>
              {bueno ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {bueno ? 'Incorporado' : 'Cerrado sin incorporación'}
            </p>
            {!bueno && closeReason && (
              <p className="mt-1 text-sm text-muted-foreground">
                {MOTIVOS_DE_CIERRE[closeReason] ?? closeReason}
              </p>
            )}
            {closeNote && <p className="mt-2 text-sm">{closeNote}</p>}
            {closedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(closedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pendiente}
            onClick={() => startTransition(async () => { await reabrirExpedienteAction(journeyId); })}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reabrir
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-medium">¿Cómo acabó este proceso?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Rellénalo cuando termine, bien o mal. Mientras no se cierre, cuenta como en curso en las
        métricas.
      </p>

      {!eligiendo ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" disabled={pendiente} onClick={() => cerrar('incorporado')}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Se incorporó
          </Button>
          <Button size="sm" variant="outline" disabled={pendiente} onClick={() => setEligiendo(true)}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            No llegó a incorporarse
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="motivo" className="text-xs font-medium text-muted-foreground">
              ¿Qué pasó?
            </label>
            <select
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {Object.entries(MOTIVOS_DE_CIERRE).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nota" className="text-xs font-medium text-muted-foreground">
              Detalle (opcional)
            </label>
            <textarea
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              placeholder="Lo que convenga recordar de este caso."
              className="mt-1 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Se guardará que el proceso se cortó en la etapa <strong>{etapaActual}</strong>.
          </p>
          <div className="flex gap-2">
            <Button size="sm" disabled={pendiente} onClick={() => cerrar('cerrado')}>
              {pendiente ? 'Guardando…' : 'Cerrar expediente'}
            </Button>
            <Button size="sm" variant="ghost" disabled={pendiente} onClick={() => setEligiendo(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
