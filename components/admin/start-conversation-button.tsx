'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { startConversationAction } from '@/app/admin/mensajes/actions';
import { Button } from '@/components/ui/button';

/**
 * Botón "Enviar mensaje" en el contexto de una solicitud / perfil de candidato.
 * - Si la conversación ya existe, navega a ella.
 * - Si no existe, la crea y luego navega.
 */
export function StartConversationButton({
  candidateUserId,
  candidateName,
  variant = 'default',
}: {
  candidateUserId: string;
  candidateName?: string;
  variant?: 'default' | 'outline';
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const open = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await startConversationAction(candidateUserId);
      if (res && 'error' in res && res.error) {
        setError(res.error);
        return;
      }
      if (res && 'id' in res && res.id) {
        router.push(`/admin/mensajes/${res.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant={variant}
        onClick={open}
        disabled={pending}
        className="h-10 rounded-xl"
      >
        <MessageCircle className="mr-1.5 h-4 w-4" />
        {pending
          ? 'Abriendo…'
          : candidateName
            ? `Escribir a ${candidateName.split(' ')[0]}`
            : 'Enviar mensaje'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
