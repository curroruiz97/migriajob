'use client';

import { useActionState, useEffect, useState } from 'react';
import { Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { reportContentAction } from '@/lib/moderation/actions';
import {
  MODERATION_EMAIL,
  REPORT_REASONS,
  TARGET_LABEL,
  type ReportTarget,
} from '@/lib/moderation/reasons';

type State = { error?: string; ok?: true; yaDenunciado?: boolean } | null;

/**
 * Denunciar un perfil, una oferta, una empresa o un mensaje.
 *
 * Se usa un <select> nativo en vez del componente Select del sistema de diseño:
 * dentro de la app de iPhone el selector nativo abre la rueda de iOS, que es lo
 * que la gente espera y lo único que se maneja bien con una mano.
 */
export function ReportDialog({
  targetType,
  targetId,
  label,
  variant = 'ghost',
  className,
}: {
  targetType: ReportTarget;
  targetId: string;
  /** Texto del botón. Por defecto, solo el icono con etiqueta accesible. */
  label?: string;
  variant?: 'ghost' | 'outline';
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [state, action, pending] = useActionState<State, FormData>(
    reportContentAction,
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast({ title: 'No se pudo enviar', description: state.error, variant: 'destructive' });
      return;
    }
    if (state.ok) {
      setAbierto(false);
      toast({
        title: state.yaDenunciado ? 'Ya lo habías denunciado' : 'Denuncia enviada',
        description: state.yaDenunciado
          ? 'Tu denuncia anterior sigue en revisión.'
          : 'La revisaremos lo antes posible. Gracias por avisar.',
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={className}
          aria-label={`Denunciar ${TARGET_LABEL[targetType]}`}
        >
          <Flag className="size-4" aria-hidden />
          {label ? <span className="ml-2">{label}</span> : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Denunciar {TARGET_LABEL[targetType]}</DialogTitle>
          <DialogDescription>
            Cuéntanos qué pasa. Revisamos todas las denuncias y actuamos sobre el
            contenido o la cuenta cuando corresponde.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="targetType" value={targetType} />
          <input type="hidden" name="targetId" value={targetId} />

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo</Label>
            <select
              id="reason"
              name="reason"
              required
              defaultValue=""
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-base"
            >
              <option value="" disabled>
                Elige un motivo
              </option>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detalles (opcional)</Label>
            <textarea
              id="details"
              name="details"
              rows={4}
              maxLength={2000}
              placeholder="Qué ha pasado, cuándo y con quién."
              className="w-full rounded-md border border-input bg-background p-3 text-base"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Si hay riesgo para alguien, escríbenos directamente a {MODERATION_EMAIL}.
          </p>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Enviando…' : 'Enviar denuncia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
