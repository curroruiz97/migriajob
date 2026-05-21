'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Copy } from 'lucide-react';
import { setJobStatusAction, duplicateJobAction } from '@/app/admin/ofertas/actions';
import { Button } from '@/components/ui/button';

export function JobRowActions({ jobId, status }: { jobId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const isActive = status === 'published';

  return (
    <div className="flex items-center gap-2">
      {isActive ? (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-muted-foreground"
          disabled={pending}
          onClick={() => run(() => setJobStatusAction(jobId, 'paused'))}
        >
          <Pause className="mr-1 h-3.5 w-3.5" /> Pausar
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-muted-foreground"
          disabled={pending}
          onClick={() => run(() => setJobStatusAction(jobId, 'published'))}
        >
          <Play className="mr-1 h-3.5 w-3.5" /> Activar
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg text-muted-foreground"
        disabled={pending}
        onClick={() => run(() => duplicateJobAction(jobId))}
      >
        <Copy className="mr-1 h-3.5 w-3.5" /> Duplicar
      </Button>
    </div>
  );
}
