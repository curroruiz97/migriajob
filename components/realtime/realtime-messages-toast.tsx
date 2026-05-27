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
import { notifyFx } from '@/lib/realtime-fx';

// DEBUG temporal — pon en false cuando arreglemos el bug.
const RT_DEBUG = true;
function rtLog(...args: unknown[]) {
  if (RT_DEBUG) console.log('[RT-messages]', ...args);
}

export function RealtimeMessagesToast({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const conversationIdsRef = useRef<Set<string>>(new Set());
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) {
      rtLog('useEffect re-ejecutado pero ya suscrito → skip');
      return;
    }
    subscribedRef.current = true;
    rtLog('Montando — userId:', userId);

    const supabase = createClient();
    if (!('channel' in supabase)) {
      rtLog('❌ supabase client es STUB DEMO (faltan env vars) → no se suscribe');
      return;
    }
    rtLog('✅ supabase client OK');

    let mounted = true;

    // 1) Cacheamos los IDs de conversación del usuario para filtrar en cliente.
    const loadConvs = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .or(`employer_id.eq.${userId},candidate_id.eq.${userId}`);
      if (!mounted) return;
      if (error) {
        rtLog('❌ Error cargando conversaciones:', error);
      } else {
        const ids = (data ?? []).map((r) => (r as { id: string }).id);
        rtLog('📋 Conversaciones cargadas:', ids.length, ids);
        conversationIdsRef.current = new Set(ids);
      }
    };
    loadConvs();

    // 2) Suscripción global a inserts en messages.
    const messagesChannel = supabase
      .channel(`messages-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          rtLog('📨 INSERT recibido en messages:', payload.new);
          const m = payload.new as { sender_id?: string; conversation_id?: string; body?: string };
          if (!m?.conversation_id) {
            rtLog('  → sin conversation_id, ignorado');
            return;
          }
          if (m.sender_id === userId) {
            rtLog('  → soy yo el emisor, ignorado');
            return;
          }
          if (!conversationIdsRef.current.has(m.conversation_id)) {
            rtLog('  → conv NO está en mi cache:', m.conversation_id,
                  'cache actual:', [...conversationIdsRef.current]);
            return;
          }

          const insideChat = pathname?.endsWith(`/mensajes/${m.conversation_id}`);
          rtLog('  → ✅ válido, insideChat:', insideChat);
          if (!insideChat) {
            notifyFx();
            toast({
              title: 'Nuevo mensaje',
              description: (m.body ?? '').slice(0, 80) || 'Has recibido un nuevo mensaje.',
              duration: 8000,
            });
          }
          router.refresh();
        }
      )
      .subscribe((status, err) => {
        rtLog('🔌 messages channel status:', status, err ? `err: ${err.message}` : '');
      });

    // 3) Mantenemos el cache de conversaciones al día (si abren una nueva conv).
    const convChannel = supabase
      .channel(`conversations-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        (payload) => {
          rtLog('💬 INSERT recibido en conversations:', payload.new);
          const c = payload.new as { id?: string; employer_id?: string; candidate_id?: string };
          if (!c?.id) return;
          if (c.employer_id === userId || c.candidate_id === userId) {
            conversationIdsRef.current.add(c.id);
            rtLog('  → añadida a cache');
          }
        }
      )
      .subscribe((status) => {
        rtLog('🔌 conversations channel status:', status);
      });

    return () => {
      rtLog('Desmontando');
      mounted = false;
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(convChannel);
    };
  }, [userId, pathname, router, toast]);

  return null;
}
