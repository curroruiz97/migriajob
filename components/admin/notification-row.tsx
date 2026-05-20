'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { markNotificationReadAction } from '@/app/admin/notificaciones/actions';
import { Button } from '@/components/ui/button';

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markNotificationReadAction(id);
          router.refresh();
        })
      }
      aria-label="Marcar como leída"
      title="Marcar como leída"
      className="shrink-0"
    >
      <Check className="h-3.5 w-3.5" />
    </Button>
  );
}
