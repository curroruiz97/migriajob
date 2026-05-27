'use client';

/**
 * Suscripción Realtime: avisa al empleador (toast + refresh) cuando se inserta
 * una nueva fila en `applications` cuya `job_id` pertenece a la empresa.
 *
 * Suscripción estable durante toda la sesión (refs para router/toast).
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { notifyFx } from '@/lib/realtime-fx';

export function RealtimeApplicationsToast({ companyId }: { companyId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const routerRef = useRef(router);
  const toastRef = useRef(toast);
  const jobIdsRef = useRef<Set<string>>(new Set());
  routerRef.current = router;
  toastRef.current = toast;

  useEffect(() => {
    const supabase = createClient();
    if (!('channel' in supabase)) return;

    let mounted = true;

    (async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', companyId);
      if (!mounted) return;
      jobIdsRef.current = new Set((data ?? []).map((j) => (j as { id: string }).id));
    })();

    const channel = supabase
      .channel(`applications-company-${companyId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        (payload) => {
          const newRow = payload.new as { job_id?: string };
          if (!newRow?.job_id) return;
          if (!jobIdsRef.current.has(newRow.job_id)) return;

          notifyFx();
          toastRef.current({
            title: 'Nueva solicitud recibida',
            description: 'Un candidato se ha inscrito a una de tus ofertas.',
            duration: 8000,
          });
          routerRef.current.refresh();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  return null;
}
