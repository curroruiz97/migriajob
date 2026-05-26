'use client';

/**
 * Aviso in-app al CANDIDATO cuando una empresa cambia el estado de su
 * solicitud (reviewing → shortlisted → hired / rejected). Mostramos toast
 * con la etiqueta humana y refrescamos para que las listas reflejen el
 * cambio sin recarga manual.
 *
 * Requiere Supabase Realtime habilitado en `applications` (ya hecho en
 * la migración 0008_realtime_applications.sql).
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STATUS_LABEL: Record<string, string> = {
  submitted: 'Enviada',
  reviewing: 'En revisión',
  shortlisted: 'Preseleccionada',
  interview: 'Entrevista',
  rejected: 'Descartada',
  hired: 'Contratada',
};

export function RealtimeApplicationStatusToast({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const supabase = createClient();
    if (!('channel' in supabase)) return;

    const channel = supabase
      .channel(`applications-candidate-${candidateId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'applications', filter: `candidate_id=eq.${candidateId}` },
        (payload) => {
          const oldRow = payload.old as { status?: string };
          const newRow = payload.new as { status?: string };
          if (!newRow?.status) return;
          if (oldRow?.status === newRow.status) return; // sin cambio efectivo

          toast({
            title: 'Estado de tu solicitud actualizado',
            description: `Nuevo estado: ${STATUS_LABEL[newRow.status] ?? newRow.status}`,
          });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidateId, router, toast]);

  return null;
}
