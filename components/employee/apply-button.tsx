'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { applyToJobAction } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';

export function ApplyButton({
  jobId,
  alreadyApplied,
}: {
  jobId: string;
  alreadyApplied: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState<string | null>(null);

  if (applied) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success">
        <CheckCircle2 className="h-4 w-4" />
        Solicitud enviada — la empresa puede contactarte.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      <Button
        size="lg"
        className="h-11 w-full rounded-xl text-sm font-semibold"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await applyToJobAction(jobId);
            if (res && 'error' in res) {
              setError(res.error);
            } else {
              setApplied(true);
              router.refresh();
            }
          })
        }
      >
        <Send className="mr-1.5 h-4 w-4" />
        {pending ? 'Enviando…' : 'Solicitar esta oferta'}
      </Button>
    </div>
  );
}
