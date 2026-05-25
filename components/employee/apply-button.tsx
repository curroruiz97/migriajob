'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Send, AlertCircle, UserCheck } from 'lucide-react';
import { applyToJobAction } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';

/**
 * Botón "Aplicar con mi perfil" — postulación instantánea sin formulario.
 *
 * Reutiliza los datos ya guardados por el candidato (nombre, perfil, CV,
 * habilidades, etc.). Se confirma con un toque para evitar envíos accidentales,
 * y muestra un mini-resumen de qué datos viajan.
 *
 * Si `profileReady` es false, deshabilita el botón y enlaza a completar perfil.
 */
export function ApplyButton({
  jobId,
  alreadyApplied,
  profileReady = true,
  profileSummary,
}: {
  jobId: string;
  alreadyApplied: boolean;
  profileReady?: boolean;
  profileSummary?: {
    fullName?: string | null;
    headline?: string | null;
    hasCv?: boolean;
    skillsCount?: number;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (applied) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success">
        <CheckCircle2 className="h-4 w-4" />
        Solicitud enviada — la empresa puede contactarte.
      </div>
    );
  }

  if (!profileReady) {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-warning-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>
            Completa tu perfil para poder aplicar sin formulario. Solo te llevará
            un par de minutos.
          </span>
        </div>
        <Button asChild size="lg" className="h-11 w-full rounded-xl text-sm font-semibold">
          <Link href="/dashboard/mi-perfil">
            <UserCheck className="mr-1.5 h-4 w-4" />
            Completar mi perfil
          </Link>
        </Button>
      </div>
    );
  }

  const submit = () =>
    startTransition(async () => {
      setError(null);
      const res = await applyToJobAction(jobId);
      if (res && 'error' in res && res.error) {
        setError(res.error ?? 'No se pudo enviar la solicitud.');
        setConfirming(false);
      } else {
        setApplied(true);
        setConfirming(false);
        router.refresh();
      }
    });

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {confirming ? (
        <div className="space-y-2 rounded-xl border border-primary/20 bg-primary-soft/50 p-3">
          <p className="text-xs font-medium text-foreground">
            Se enviarán a la empresa estos datos de tu perfil:
          </p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {profileSummary?.fullName && (
              <li>• Nombre: <span className="text-foreground">{profileSummary.fullName}</span></li>
            )}
            {profileSummary?.headline && (
              <li>• Titular: <span className="text-foreground">{profileSummary.headline}</span></li>
            )}
            <li>
              • CV:{' '}
              <span className="text-foreground">
                {profileSummary?.hasCv ? 'incluido' : 'no subido (puedes añadirlo en tu perfil)'}
              </span>
            </li>
            {typeof profileSummary?.skillsCount === 'number' && (
              <li>• Habilidades: <span className="text-foreground">{profileSummary.skillsCount}</span></li>
            )}
            <li>• Datos de contacto (email/teléfono)</li>
          </ul>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 rounded-lg text-xs"
              disabled={pending}
              onClick={submit}
            >
              <Send className="mr-1 h-3.5 w-3.5" />
              {pending ? 'Enviando…' : 'Confirmar envío'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className="h-11 w-full rounded-xl text-sm font-semibold"
          disabled={pending}
          onClick={() => setConfirming(true)}
        >
          <UserCheck className="mr-1.5 h-4 w-4" />
          Aplicar con mi perfil
        </Button>
      )}
    </div>
  );
}
