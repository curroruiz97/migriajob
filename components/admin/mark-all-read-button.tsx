'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { markAllNotificationsReadAction } from '@/app/admin/notificaciones/actions';
import { Button } from '@/components/ui/button';

export function MarkAllReadButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsReadAction();
          router.refresh();
        })
      }
    >
      <Check className="mr-1.5 h-3.5 w-3.5" />
      {pending ? 'Marcando…' : 'Marcar todas leídas'}
    </Button>
  );
}
