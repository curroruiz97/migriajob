import { Search } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSavedSearches } from '@/lib/db/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = { title: 'Búsquedas guardadas' };

const FREQUENCY_LABEL: Record<string, string> = {
  off: 'Sin alertas',
  daily: 'Diaria',
  weekly: 'Semanal',
  instant: 'Instantánea',
};

export default async function BusquedasGuardadasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const searches = await getSavedSearches(user!.id).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Búsquedas guardadas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revisa tus búsquedas guardadas y configura alertas por email.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/busqueda-avanzada">Nueva búsqueda</Link>
        </Button>
      </div>

      {searches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No tienes búsquedas guardadas"
          description="Cuando guardes una búsqueda, podrás reabrirla con un clic y recibir alertas cuando haya nuevos perfiles que la cumplan."
          action={
            <Button asChild>
              <Link href="/admin/busqueda-avanzada">Crear primera búsqueda</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {searches.map((s) => {
            const filters = s.filters as Record<string, unknown>;
            const params = new URLSearchParams(
              Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v != null && v !== '')
                  .map(([k, v]) => [k, String(v)])
              )
            );
            return (
              <li key={s.id} className="flex items-center justify-between px-4 py-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/candidatos?${params.toString()}`}
                    className="text-sm font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Creada{' '}
                    {formatDistanceToNow(new Date(s.createdAt), { locale: es, addSuffix: true })}
                  </p>
                </div>
                <Badge variant="soft">{FREQUENCY_LABEL[s.alertFrequency]}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
