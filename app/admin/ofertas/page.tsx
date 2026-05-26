import Link from 'next/link';
import { Megaphone, Plus, MapPin, Users, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { JobRowActions } from '@/components/admin/job-row-actions';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Mis ofertas' };

const STATUS: Record<string, { label: string; tone: string }> = {
  published: { label: 'Activa', tone: 'bg-success-soft text-success' },
  paused: { label: 'Pausada', tone: 'bg-warning-soft text-warning' },
  draft: { label: 'Borrador', tone: 'bg-muted text-muted-foreground' },
  archived: { label: 'Cerrada', tone: 'bg-muted text-muted-foreground' },
  expired: { label: 'Caducada', tone: 'bg-muted text-muted-foreground' },
};

interface JobRow {
  id: string;
  title: string;
  location: string | null;
  status: string;
  applications_count: number | null;
}

export default async function MisOfertasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user!.id)
    .maybeSingle();

  let jobs: JobRow[] = [];
  if (company) {
    // Contamos las solicitudes en vivo con un embed de Supabase
    // (la columna applications_count no se mantiene sincronizada por trigger
    // así que llevaba siempre 0).
    const { data } = await supabase
      .from('jobs')
      .select('id, title, location, status, applications:applications(count)')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    jobs = (data ?? []).map((j) => {
      const row = j as unknown as {
        id: string;
        title: string;
        location: string | null;
        status: string;
        applications?: Array<{ count: number }> | null;
      };
      const count =
        Array.isArray(row.applications) && row.applications[0]
          ? row.applications[0].count
          : 0;
      return {
        id: row.id,
        title: row.title,
        location: row.location ?? null,
        status: row.status,
        applications_count: count,
      };
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
            Mis ofertas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea y gestiona las ofertas de tu empresa.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/admin/ofertas/nueva">
            <Plus className="mr-1.5 h-4 w-4" /> Crear oferta
          </Link>
        </Button>
      </div>

      {!company ? (
        <EmptyState
          icon={Megaphone}
          title="Completa el perfil de tu empresa"
          description="Necesitas un perfil de empresa para publicar ofertas."
          action={
            <Button asChild>
              <Link href="/admin/perfil-empresa">Ir al perfil de empresa</Link>
            </Button>
          }
          className="mt-6"
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Aún no has publicado ninguna oferta"
          description="Publica tu primera oferta y empieza a recibir candidaturas."
          action={
            <Button asChild>
              <Link href="/admin/ofertas/nueva">Publicar tu primera oferta</Link>
            </Button>
          }
          className="mt-6"
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => {
            const st = STATUS[j.status] ?? STATUS.draft;
            return (
              <div key={j.id} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/ofertas/${j.id}`} className="min-w-0 flex-1">
                    <h2 className="line-clamp-1 font-semibold text-foreground hover:text-primary">
                      {j.title}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {j.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {j.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {j.applications_count ?? 0} candidatos
                      </span>
                    </div>
                  </Link>
                  <Badge className={cn('shrink-0', st.tone)}>{st.label}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={`/admin/ofertas/${j.id}`}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Editar / candidatos
                    </Link>
                  </Button>
                  <JobRowActions jobId={j.id} status={j.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB: publicar oferta — siempre visible en esta pestaña. */}
      {company && (
        <Link
          href="/admin/ofertas/nueva"
          aria-label="Publicar oferta"
          className="fixed right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 bottom-[calc(5rem_+_env(safe-area-inset-bottom))] lg:right-8 lg:bottom-8"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
