import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getNotifications } from '@/lib/db/queries';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { MarkAllReadButton } from '@/components/admin/mark-all-read-button';
import { MarkReadButton } from '@/components/admin/notification-row';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = { title: 'Notificaciones' };

const TYPE_LABELS: Record<string, string> = {
  message_received: 'Nuevo mensaje',
  application_received: 'Nueva candidatura',
  application_status_changed: 'Cambio de estado',
  process_stage_changed: 'Pipeline actualizado',
  saved_search_match: 'Nuevos perfiles para tu búsqueda',
  system: 'Sistema',
};

export default async function NotificacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const items = await getNotifications(user!.id, { limit: 100 }).catch(() => []);
  const unreadCount = items.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notificaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `Tienes ${unreadCount} sin leer.`
              : 'Estás al día. Sin notificaciones pendientes.'}
          </p>
        </div>
        <MarkAllReadButton disabled={unreadCount === 0} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin notificaciones"
          description="Cuando recibas mensajes o haya actualizaciones aparecerán aquí."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {items.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 px-4 py-4 transition-colors ${
                !n.read_at ? 'bg-primary-soft/30' : ''
              }`}
            >
              <div
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.read_at ? 'bg-muted-foreground/40' : 'bg-primary'
                }`}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="soft">{TYPE_LABELS[n.type] ?? n.type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { locale: es, addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground">
                  {(n.payload as { message?: string })?.message ?? 'Acción registrada.'}
                </p>
              </div>
              {!n.read_at && <MarkReadButton id={n.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
