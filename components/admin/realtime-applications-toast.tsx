'use client';

/**
 * Suscripción Realtime: avisa al empleador (toast + refresh) cuando se inserta
 * una nueva fila en `applications` cuya `job_id` pertenece a la empresa.
 *
 * - Filtra en cliente: trae los job_ids de la empresa una vez y, ante el
 *   evento, ignora los que no pertenezcan a la empresa actual.
 * - Auto-refresh: `router.refresh()` recarga la lista para mostrar la nueva
 *   solicitud sin que el usuario haga F5.
 *
 * Necesita que Supabase Realtime esté habilitado para la tabla `applications`
 * (`alter publication supabase_realtime add table public.applications;`).
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function RealtimeApplicationsToast({ companyId }: { companyId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const jobIdsRef = useRef<Set<string>>(new Set());
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const supabase = createClient();
    if (!('channel' in supabase)) return; // stub demo

    let mounted = true;

    // 1) Trae los job_ids de la empresa (los nuevos applications a estos jobs nos interesan).
    (async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', companyId);
      if (!mounted) return;
      jobIdsRef.current = new Set((data ?? []).map((j) => (j as { id: string }).id));
    })();

    // 2) Suscripción a nuevos INSERTs en applications.
    const channel = supabase
      .channel(`applications-company-${companyId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        (payload) => {
          const newRow = payload.new as { job_id?: string };
          if (!newRow?.job_id) return;
          if (!jobIdsRef.current.has(newRow.job_id)) return;

          toast({
            title: 'Nueva solicitud recibida',
            description: 'Un candidato se ha inscrito a una de tus ofertas.',
          });
          // Refresca la lista para que aparezca de inmediato.
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [companyId, router, toast]);

  return null;
}
