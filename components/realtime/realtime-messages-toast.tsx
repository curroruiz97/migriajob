'use client';

/**
 * Aviso in-app cuando llega un nuevo mensaje en cualquier conversación
 * en la que participa el usuario actual. Muestra toast + refresh.
 *
 * - Filtra silenciosamente los mensajes que NO van dirigidos al usuario
 *   actual (los que envía él mismo no notifican).
 * - Si ya estás dentro de la conversación afectada, no muestra toast
 *   (sería ruido); solo refresca la vista.
 *
 * Necesita Supabase Realtime habilitado para las tablas `messages` y
 * `conversations` (ver migración 0010_realtime_messages.sql).
 */

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function RealtimeMessagesToast({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const conversationIdsRef = useRef<Set<string>>(new Set());
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const supabase = createClient();
    if (!('channel' in supabase)) return; // stub demo

    let mounted = true;

    // 1) Cacheamos los IDs de conversación del usuario para filtrar en cliente.
    const loadConvs = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id')
        .or(`employer_id.eq.${userId},candidate_id.eq.${userId}`);
      if (!mounted) return;
      conversationIdsRef.current = new Set(
        (data ?? []).map((r) => (r as { id: string }).id)
      );
    };
    loadConvs();

    // 2) Suscripción global a inserts en messages.
    const messagesChannel = supabase
      .channel(`messages-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = payload.new as { sender_id?: string; conversation_id?: string; body?: string };
          if (!m?.conversation_id) return;
          // Ignoramos los que envía el propio usuario.
          if (m.sender_id === userId) return;
          // Ignoramos los que no pertenecen a una de mis conversaciones.
          if (!conversationIdsRef.current.has(m.conversation_id)) return;

          const insideChat = pathname?.endsWith(`/mensajes/${m.conversation_id}`);
          if (!insideChat) {
            toast({
              title: 'Nuevo mensaje',
              description: (m.body ?? '').slice(0, 80) || 'Has recibido un nuevo mensaje.',
            });
          }
          router.refresh();
        }
      )
      .subscribe();

    // 3) Mantenemos el cache de conversaciones al día (si abren una nueva conv).
    const convChannel = supabase
      .channel(`conversations-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        (payload) => {
          const c = payload.new as { id?: string; employer_id?: string; candidate_id?: string };
          if (!c?.id) return;
          if (c.employer_id === userId || c.candidate_id === userId) {
            conversationIdsRef.current.add(c.id);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(convChannel);
    };
  }, [userId, pathname, router, toast]);

  return null;
}
