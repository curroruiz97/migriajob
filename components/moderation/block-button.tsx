'use client';

import { useState, useTransition } from 'react';
import { Ban, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { blockUserAction, unblockUserAction } from '@/lib/moderation/actions';

/**
 * Bloquear o desbloquear a la otra persona de una conversación.
 *
 * Bloquear corta la mensajería en los dos sentidos. No se avisa a quien queda
 * bloqueado: decírselo es justo lo que hace que una persona acosada no se
 * atreva a usar el botón.
 */
export function BlockButton({
  userId,
  nombre,
  bloqueado,
  className,
}: {
  userId: string;
  /** Cómo llamar a la otra persona en el aviso de confirmación. */
  nombre?: string;
  bloqueado: boolean;
  className?: string;
}) {
  const [confirmar, setConfirmar] = useState(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const quien = nombre?.trim() || 'esta persona';

  const ejecutar = (bloquear: boolean) => {
    startTransition(async () => {
      const r = bloquear ? await blockUserAction(userId) : await unblockUserAction(userId);
      if (r && 'error' in r && r.error) {
        toast({ title: 'No se pudo completar', description: r.error, variant: 'destructive' });
        return;
      }
      setConfirmar(false);
      toast({
        title: bloquear ? 'Usuario bloqueado' : 'Bloqueo retirado',
        description: bloquear
          ? 'No podréis escribiros. Puedes deshacerlo desde Ajustes.'
          : 'Volvéis a poder escribiros.',
      });
    });
  };

  if (bloqueado) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
        disabled={pending}
        onClick={() => ejecutar(false)}
      >
        <Undo2 className="mr-2 size-4" aria-hidden />
        {pending ? 'Quitando…' : 'Desbloquear'}
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={className}
        onClick={() => setConfirmar(true)}
      >
        <Ban className="mr-2 size-4" aria-hidden />
        Bloquear
      </Button>

      <Dialog open={confirmar} onOpenChange={setConfirmar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Bloquear a {quien}?</DialogTitle>
            <DialogDescription>
              Dejaréis de poder escribiros. No se le avisa de que le has
              bloqueado y puedes deshacerlo cuando quieras desde Ajustes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setConfirmar(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={() => ejecutar(true)}
            >
              {pending ? 'Bloqueando…' : 'Bloquear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
