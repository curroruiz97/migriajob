'use client';

import { useEffect } from 'react';
import { markConversationReadAction } from '../actions';

/**
 * Marca todos los mensajes de la conversación como leídos al montar la página.
 * Componente fantasma que solo dispara el efecto.
 */
export function MarkReadOnLoad({ conversationId }: { conversationId: string }) {
  useEffect(() => {
    markConversationReadAction(conversationId).catch(() => {});
  }, [conversationId]);
  return null;
}
