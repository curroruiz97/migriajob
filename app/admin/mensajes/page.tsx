import Link from 'next/link';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = { title: 'Mensajes' };

export default async function MensajesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Trae conversaciones + interlocutor + último mensaje
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, last_message_at, employer_id, candidate_id,
      employer:profiles!conversations_employer_id_fkey(id, full_name, avatar_url),
      candidate:profiles!conversations_candidate_id_fkey(id, full_name, avatar_url),
      messages (id, body, sender_id, created_at, read_at)
    `)
    .or(`employer_id.eq.${user.id},candidate_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false });

  const items = (conversations ?? []).map((c) => {
    const isEmployer = c.employer_id === user.id;
    const other = isEmployer ? c.candidate : c.employer;
    const messages = (c.messages ?? []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastMsg = messages[0];
    const unread = messages.filter((m) => m.sender_id !== user.id && !m.read_at).length;
    return { id: c.id, other, lastMsg, lastMessageAt: c.last_message_at, unread };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mensajes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length === 0
              ? 'Todavía no tienes conversaciones.'
              : `${items.length} ${items.length === 1 ? 'conversación' : 'conversaciones'}`}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/candidatos">+ Iniciar conversación</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No tienes conversaciones todavía"
          description="Explora perfiles y contacta directamente. Las conversaciones aparecerán aquí."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {items.map((c) => {
            const otherName = (c.other as { full_name?: string | null })?.full_name ?? 'Usuario';
            const otherAvatar = (c.other as { avatar_url?: string | null })?.avatar_url ?? null;
            const initials = otherName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

            return (
              <li key={c.id}>
                <Link
                  href={`/admin/mensajes/${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-11 w-11">
                    {otherAvatar && <AvatarImage src={otherAvatar} alt="" />}
                    <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-sm ${c.unread > 0 ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                        {otherName}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.lastMessageAt), { locale: es, addSuffix: true })}
                      </span>
                    </div>
                    <p className={`mt-0.5 truncate text-xs ${c.unread > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {c.lastMsg?.body ?? 'Conversación abierta'}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span className="shrink-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {c.unread}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
