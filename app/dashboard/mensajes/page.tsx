import Link from 'next/link';
import { MessageCircle, Bell, ChevronRight, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getConversations, getNotifications } from '@/lib/db/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Mensajes' };

const NOTIF_LABELS: Record<string, string> = {
  application_status: 'Cambio de estado en tu candidatura',
  new_message: 'Nuevo mensaje',
  profile_view: 'Una empresa vio tu perfil',
  job_alert: 'Nuevas ofertas para ti',
  reminder: 'Recordatorio',
};

function humanizeType(t: string) {
  return NOTIF_LABELS[t] ?? t.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

export default async function MensajesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [conversations, notifications] = await Promise.all([
    getConversations(user!.id).catch(() => []),
    getNotifications(user!.id, { limit: 30 }).catch(() => []),
  ]);

  // Resolver nombre y logo de la empresa de cada conversación
  // (por owner_id = employer_id). Necesita la policy de migración 0009
  // que permite SELECT público de companies.
  const employerIds = Array.from(
    new Set(conversations.map((c) => (c as { employer_id: string }).employer_id))
  );
  const companyByOwner = new Map<string, { name: string; logo_url: string | null }>();
  if (employerIds.length > 0) {
    const { data: companies } = await supabase
      .from('companies')
      .select('owner_id, name, logo_url')
      .in('owner_id', employerIds);
    for (const c of companies ?? []) {
      const row = c as { owner_id: string; name: string; logo_url: string | null };
      companyByOwner.set(row.owner_id, { name: row.name, logo_url: row.logo_url });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Mensajes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conversaciones con empresas y avisos del sistema.
        </p>
      </div>

      {/* Conversaciones */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <MessageCircle className="h-4 w-4" /> Conversaciones
        </h2>
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Aún no tienes conversaciones"
            description="Cuando una empresa te contacte, verás aquí el chat."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <ul className="divide-y divide-border">
              {conversations.map((c) => {
                const conv = c as { id: string; employer_id: string; last_message_at: string };
                const company = companyByOwner.get(conv.employer_id);
                const name = company?.name ?? 'Empresa';
                const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <li key={conv.id}>
                    <Link
                      href={`/dashboard/mensajes/${conv.id}`}
                      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        {company?.logo_url && <AvatarImage src={company.logo_url} alt="" />}
                        <AvatarFallback className="bg-primary-soft text-primary">
                          {company ? initials : <Building2 className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.last_message_at), {
                            locale: es,
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Notificaciones del sistema */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Bell className="h-4 w-4" /> Notificaciones
        </h2>
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="Sin notificaciones" description="Te avisaremos de cambios en tus candidaturas." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const notif = n as { id: string; type: string; created_at: string; read_at: string | null };
                const unread = !notif.read_at;
                return (
                  <li
                    key={notif.id}
                    className={cn('flex items-start gap-3 px-4 py-3.5', unread && 'bg-primary-soft/30')}
                  >
                    <span
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        unread ? 'bg-primary' : 'bg-transparent'
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{humanizeType(notif.type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notif.created_at), { locale: es, addSuffix: true })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
