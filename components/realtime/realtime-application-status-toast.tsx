'use client';

/**
 * Aviso in-app al CANDIDATO cuando una empresa cambia el estado de su
 * solicitud (reviewing → shortlisted → hired / rejected).
 *
 * Suscripción estable durante toda la sesión (refs para router/toast).
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { notifyFx } from '@/lib/realtime-fx';

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
  const routerRef = useRef(router);
  const toastRef = useRef(toast);
  routerRef.current = router;
  toastRef.current = toast;

  useEffect(() => {
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
          if (oldRow?.status === newRow.status) return;

          notifyFx();
          toastRef.current({
            title: 'Estado de tu solicitud actualizado',
            description: `Nuevo estado: ${STATUS_LABEL[newRow.status] ?? newRow.status}`,
            duration: 8000,
          });
          routerRef.current.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidateId]);

  return null;
}
