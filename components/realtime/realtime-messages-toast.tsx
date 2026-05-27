'use client';

/**
 * Aviso in-app cuando llega un nuevo mensaje en cualquier conversación
 * en la que participa el usuario actual.
 *
 * Suscripción estable durante toda la sesión: el canal se crea una sola vez
 * al montar y se cierra al desmontar. Para que pathname/router/toast no
 * recreen el canal cada navegación, los guardamos en refs.
 */

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { notifyFx } from '@/lib/realtime-fx';

const RT_DEBUG = true;
function rtLog(...args: unknown[]) {
  if (RT_DEBUG) console.log('[RT-messages]', ...args);
}

export function RealtimeMessagesToast({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Refs estables: el callback del canal lee siempre el valor actual sin
  // necesidad de que el useEffect se vuelva a ejecutar.
  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);
  const toastRef = useRef(toast);
  const conversationIdsRef = useRef<Set<string>>(new Set());

  routerRef.current = router;
  pathnameRef.current = pathname;
  toastRef.current = toast;

  // Se ejecuta UNA SOLA VEZ por userId (no en cada navegación).
  useEffect(() => {
    rtLog('Montando — userId:', userId);

    const supabase = createClient();
    if (!('channel' in supabase)) {
      rtLog('❌ supabase client es STUB DEMO (faltan env vars) → no se suscribe');
      return;
    }
    rtLog('✅ supabase client OK');

    let mounted = true;

    // 1) Cacheamos los IDs de conversación del usuario para filtrar en cliente.
    (async () => {
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
    })();

    // 2) Suscripción a inserts en messages.
    const messagesChannel = supabase
      .channel(`messages-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          rtLog('📨 INSERT messages:', payload.new);
          const m = payload.new as { sender_id?: string; conversation_id?: string; body?: string };
          if (!m?.conversation_id) return;
          if (m.sender_id === userId) {
            rtLog('  → yo soy el emisor, ignorado');
            return;
          }
          if (!conversationIdsRef.current.has(m.conversation_id)) {
            rtLog('  → conv NO está en mi cache:', m.conversation_id);
            return;
          }
          const insideChat = pathnameRef.current?.endsWith(`/mensajes/${m.conversation_id}`);
          rtLog('  → ✅ válido, insideChat:', insideChat);
          if (!insideChat) {
            notifyFx();
            toastRef.current({
              title: 'Nuevo mensaje',
              description: (m.body ?? '').slice(0, 80) || 'Has recibido un nuevo mensaje.',
              duration: 8000,
            });
          }
          routerRef.current.refresh();
        }
      )
      .subscribe((status, err) => {
        rtLog('🔌 messages channel:', status, err ? `err: ${err.message}` : '');
      });

    // 3) Mantenemos el cache de conversaciones al día (si abren una nueva conv).
    const convChannel = supabase
      .channel(`conversations-user-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        (payload) => {
          rtLog('💬 INSERT conversations:', payload.new);
          const c = payload.new as { id?: string; employer_id?: string; candidate_id?: string };
          if (!c?.id) return;
          if (c.employer_id === userId || c.candidate_id === userId) {
            conversationIdsRef.current.add(c.id);
            rtLog('  → añadida a cache');
          }
        }
      )
      .subscribe((status) => {
        rtLog('🔌 conversations channel:', status);
      });

    return () => {
      rtLog('Desmontando');
      mounted = false;
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(convChannel);
    };
    // Solo userId como dependencia: el canal se crea una vez y vive toda la sesión.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return null;
}
