import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = { title: 'Mis aplicaciones' };

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Enviada',
  reviewing: 'En revisión',
  shortlisted: 'Preseleccionado',
  rejected: 'Rechazada',
  hired: 'Contratado',
};

const STATUS_TONES: Record<string, string> = {
  submitted: 'bg-muted text-muted-foreground',
  reviewing: 'bg-info-soft text-info',
  shortlisted: 'bg-primary-soft text-primary',
  rejected: 'bg-destructive-soft text-destructive',
  hired: 'bg-success-soft text-success',
};

interface ApplicationRow {
  id: string;
  status: string;
  created_at: string;
  job: { title: string; company: { name: string } | null } | null;
}

export default async function MisAplicacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar mi candidate primero
  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('profile_id', user!.id)
    .maybeSingle();

  let rows: ApplicationRow[] = [];
  if (candidate) {
    const { data } = await supabase
      .from('applications')
      .select('id, status, created_at, job:jobs(title, company:companies(name))')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false });
    rows = (data ?? []) as unknown as ApplicationRow[];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis aplicaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">Estado de tus postulaciones a ofertas.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aún no has aplicado a ninguna oferta"
          description="Explora las ofertas disponibles y contacta directamente con las empresas."
          action={
            <Button asChild>
              <Link href="/empleos">Ver ofertas disponibles</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href="/empleos"
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {r.job?.title ?? 'Oferta'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.job?.company?.name ?? '—'} ·{' '}
                      {formatDistanceToNow(new Date(r.created_at), { locale: es, addSuffix: true })}
                    </p>
                  </div>
                  <Badge className={STATUS_TONES[r.status] ?? STATUS_TONES.submitted}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
