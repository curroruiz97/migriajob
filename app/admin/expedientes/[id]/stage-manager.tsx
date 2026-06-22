'use client';

import { useState, useTransition } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  History,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JOURNEY_STAGES, getStageIndex } from '@/lib/journey-stages';
import { updateJourneyStageAction } from '../actions';

export function StageManager({
  journeyId,
  currentStage,
  stageMessage,
  stageHistory,
}: {
  journeyId: string;
  currentStage: string;
  stageMessage: string | null;
  stageHistory: Array<{
    id: string;
    stage: string;
    notes: string | null;
    changed_by: string | null;
    created_at: string;
  }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(stageMessage ?? '');
  const [showHistory, setShowHistory] = useState(false);
  const currentIdx = getStageIndex(currentStage);

  function advanceStage() {
    if (currentIdx >= JOURNEY_STAGES.length - 1) return;
    const nextStage = JOURNEY_STAGES[currentIdx + 1].key;
    startTransition(async () => {
      await updateJourneyStageAction(journeyId, nextStage, message || undefined);
    });
  }

  function goBackStage() {
    if (currentIdx <= 0) return;
    const prevStage = JOURNEY_STAGES[currentIdx - 1].key;
    startTransition(async () => {
      await updateJourneyStageAction(journeyId, prevStage, message || undefined);
    });
  }

  function jumpToStage(stageKey: string) {
    startTransition(async () => {
      await updateJourneyStageAction(journeyId, stageKey as any, message || undefined);
    });
  }

  function saveMessage() {
    startTransition(async () => {
      await updateJourneyStageAction(journeyId, currentStage as any, message || undefined);
    });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Gestión de etapa
        </h2>
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <History className="h-3.5 w-3.5" />
          Historial
        </button>
      </div>

      {/* Stage selector pills */}
      <div className="flex flex-wrap gap-1.5">
        {JOURNEY_STAGES.map((s, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <button
              key={s.key}
              type="button"
              disabled={isPending}
              onClick={() => jumpToStage(s.key)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                isCurrent && 'border-primary bg-primary text-primary-foreground shadow-sm',
                isPast && 'border-success/50 bg-success-soft text-success',
                !isPast && !isCurrent && 'border-border bg-surface text-muted-foreground/60 hover:border-primary/50 hover:text-primary',
                isPending && 'opacity-50'
              )}
            >
              {s.number}. {s.title.replace(/[¡!]/g, '').substring(0, 20)}{s.title.length > 23 ? '…' : ''}
            </button>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBackStage}
          disabled={currentIdx <= 0 || isPending}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Retroceder
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-foreground">
            Etapa {currentIdx + 1}: {JOURNEY_STAGES[currentIdx]?.title}
          </span>
        </div>
        <button
          type="button"
          onClick={advanceStage}
          disabled={currentIdx >= JOURNEY_STAGES.length - 1 || isPending}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30"
        >
          Avanzar
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Custom message */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          Mensaje personalizado para el candidato (opcional)
        </label>
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensaje que verá el candidato en la etapa actual..."
            rows={2}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <button
            type="button"
            onClick={saveMessage}
            disabled={isPending}
            className="self-end rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* History */}
      {showHistory && stageHistory.length > 0 && (
        <div className="rounded-lg border border-border bg-surface-muted/30 p-3">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Historial de cambios
          </h3>
          <ul className="space-y-1.5">
            {stageHistory.map((h) => {
              const def = JOURNEY_STAGES.find((s) => s.key === h.stage);
              return (
                <li key={h.id} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">
                    → Etapa {def?.number}: {def?.title ?? h.stage}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(h.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
