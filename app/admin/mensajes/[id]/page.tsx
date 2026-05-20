import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getConversationMessages } from '@/lib/db/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConversationForm } from './conversation-form';
import { MarkReadOnLoad } from './mark-read-on-load';

export const metadata = { title: 'Conversación' };

export default async function ConversationPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Cargar conversación + el "otro" interlocutor
  const { data: conv } = await supabase
    .from('conversations')
    .select('*, employer:profiles!conversations_employer_id_fkey(id, full_name, avatar_url), candidate:profiles!conversations_candidate_id_fkey(id, full_name, avatar_url)')
    .eq('id', id)
    .maybeSingle();

  if (!conv) notFound();

  const isEmployer = conv.employer_id === user.id;
  const other = isEmployer ? conv.candidate : conv.employer;
  const otherName = (other as { full_name?: string | null })?.full_name ?? 'Usuario';
  const otherAvatar = (other as { avatar_url?: string | null })?.avatar_url ?? null;
  const initials = otherName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  const messages = await getConversationMessages(id).catch(() => []);

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <MarkReadOnLoad conversationId={id} />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:rounded-t-2xl sm:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/mensajes" aria-label="Volver">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Avatar className="h-10 w-10">
          {otherAvatar && <AvatarImage src={otherAvatar} alt="" />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{otherName}</p>
          <p className="text-xs text-muted-foreground">
            {messages.length === 0 ? 'Sin mensajes aún' : `${messages.length} mensajes`}
          </p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto bg-background px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl text-foreground">Empieza la conversación</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Envía un primer mensaje a {otherName.split(' ')[0]} para abrir el diálogo.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      mine
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-surface text-foreground border border-border rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.body}</p>
                    <p className={`mt-1 text-[10px] ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(m.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Form de envío */}
      <div className="border-t border-border bg-surface px-4 py-3 sm:rounded-b-2xl sm:px-6">
        <ConversationForm conversationId={id} />
      </div>
    </div>
  );
}
