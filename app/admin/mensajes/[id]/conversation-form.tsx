'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { sendMessageAction } from '../actions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type State = { ok?: true; error?: string } | null;
type Template = { id: string; name: string; body: string };

export function ConversationForm({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState<State, FormData>(sendMessageAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Cargar plantillas del empleador autenticado
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('message_templates')
      .select('id, name, body')
      .order('created_at', { ascending: false })
      .then(({ data }) => setTemplates((data ?? []) as Template[]));
  }, []);

  useEffect(() => {
    if (state && 'ok' in state && state.ok) {
      formRef.current?.reset();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [state]);

  const insertTemplate = (body: string) => {
    if (!textareaRef.current) return;
    textareaRef.current.value = body;
    // Trigger input event para autoresize
    textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    textareaRef.current.focus();
  };

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="conversationId" value={conversationId} />

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          name="body"
          required
          rows={1}
          placeholder="Escribe un mensaje…"
          className="flex max-h-32 min-h-10 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
            }
          }}
        />

        {/* Selector plantillas */}
        {templates.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Insertar plantilla"
                title="Insertar plantilla"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Tus plantillas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {templates.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onSelect={() => insertTemplate(t.body)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{t.body}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button type="submit" size="icon" disabled={pending} aria-label="Enviar">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {state && 'error' in state && state.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}
