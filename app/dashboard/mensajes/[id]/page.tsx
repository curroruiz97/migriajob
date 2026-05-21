import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getConversationMessages } from '@/lib/db/queries';
import { MessageComposer } from '@/components/employee/message-composer';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Conversación' };

interface Msg {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: conv } = await supabase
    .from('conversations')
    .select('id, employer_id, candidate_id')
    .eq('id', id)
    .maybeSingle();

  if (!conv || (conv.employer_id !== user.id && conv.candidate_id !== user.id)) {
    notFound();
  }

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('owner_id', conv.employer_id)
    .maybeSingle();

  const messages = (await getConversationMessages(id).catch(() => [])) as unknown as Msg[];

  return (
    <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-2xl flex-col">
      <header className="flex items-center gap-3 border-b border-border pb-3">
        <Link
          href="/dashboard/mensajes"
          aria-label="Volver"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Building2 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {(company as { name: string } | null)?.name ?? 'Empresa'}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay mensajes todavía. Escribe el primero.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                    mine
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm bg-surface-muted text-foreground'
                  )}
                >
                  {m.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageComposer conversationId={id} />
    </div>
  );
}
