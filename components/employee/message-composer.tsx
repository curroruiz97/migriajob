'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { sendMessageAction } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const body = value.trim();
    if (!body || pending) return;
    startTransition(async () => {
      const res = await sendMessageAction(conversationId, body);
      if (!res || !('error' in res)) {
        setValue('');
        router.refresh();
      }
    });
  };

  return (
    <div
      className="flex items-center gap-2 border-t border-border pt-3"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Escribe un mensaje…"
        className="h-11 flex-1 rounded-full bg-muted/40 focus-visible:bg-surface"
        aria-label="Mensaje"
      />
      <Button
        type="button"
        size="icon"
        onClick={submit}
        disabled={pending || !value.trim()}
        className="h-11 w-11 shrink-0 rounded-full"
        aria-label="Enviar"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
