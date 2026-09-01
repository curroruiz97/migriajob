'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { resolveReportAction } from '@/lib/moderation/actions';

const OPCIONES = [
  { estado: 'en_revision', label: 'En revisión' },
  { estado: 'resuelta', label: 'Resuelta' },
  { estado: 'descartada', label: 'Descartar' },
] as const;

export function ReportActions({ reportId, estado }: { reportId: string; estado: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const cambiar = (nuevo: string) => {
    startTransition(async () => {
      const r = await resolveReportAction(reportId, nuevo);
      if (r && 'error' in r && r.error) {
        toast({ title: 'No se pudo actualizar', description: r.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Denuncia actualizada' });
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {OPCIONES.filter((o) => o.estado !== estado).map((o) => (
        <Button
          key={o.estado}
          type="button"
          size="sm"
          variant={o.estado === 'descartada' ? 'ghost' : 'outline'}
          disabled={pending}
          onClick={() => cambiar(o.estado)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}
