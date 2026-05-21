import Link from 'next/link';
import {
  ClipboardList,
  Send,
  Eye,
  Star,
  CalendarCheck,
  XCircle,
  CheckCircle2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Solicitudes' };

type StatusKey = 'submitted' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';

const STATUS: Record<StatusKey, { label: string; tone: string; icon: LucideIcon }> = {
  submitted: { label: 'Enviada', tone: 'bg-muted text-muted-foreground', icon: Send },
  reviewing: { label: 'En revisión', tone: 'bg-info-soft text-info', icon: Eye },
  shortlisted: { label: 'Preseleccionado', tone: 'bg-primary-soft text-primary', icon: Star },
  interview: { label: 'Entrevista', tone: 'bg-warning-soft text-warning', icon: CalendarCheck },
  rejected: { label: 'Descartada', tone: 'bg-destructive-soft text-destructive', icon: XCircle },
  hired: { label: 'Contratado', tone: 'bg-success-soft text-success', icon: CheckCircle2 },
};

const ACTIVE_STATUSES: StatusKey[] = ['submitted', 'reviewing', 'shortlisted', 'interview'];

interface ApplicationRow {
  id: string;
  status: string;
  created_at: string;
  job: { title: string; slug: string; company: { name: string } | null } | null;
}

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SolicitudesPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab = tab === 'finalizadas' ? 'finalizadas' : 'activas';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('profile_id', user!.id)
    .maybeSingle();

  let rows: ApplicationRow[] = [];
  if (candidate) {
    const { data } = await supabase
      .from('applications')
      .select('id, status, created_at, job:jobs(title, slug, company:companies(name))')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false });
    rows = (data ?? []) as unknown as ApplicationRow[];
  }

  const activas = rows.filter((r) => ACTIVE_STATUSES.includes(r.status as StatusKey));
  const finalizadas = rows.filter((r) => !ACTIVE_STATUSES.includes(r.status as StatusKey));
  const shown = activeTab === 'activas' ? activas : finalizadas;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Solicitudes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sigue el estado de tus candidaturas.
        </p>
      </div>

      {/* Tabs Activas / Finalizadas */}
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
        <TabLink href="/dashboard/solicitudes?tab=activas" active={activeTab === 'activas'}>
          Activas ({activas.length})
        </TabLink>
        <TabLink href="/dashboard/solicitudes?tab=finalizadas" active={activeTab === 'finalizadas'}>
          Finalizadas ({finalizadas.length})
        </TabLink>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            activeTab === 'activas'
              ? 'No tienes solicitudes activas'
              : 'No tienes solicitudes finalizadas'
          }
          description="Explora las ofertas y solicita las que encajen contigo."
          action={
            <Button asChild>
              <Link href="/dashboard/ofertas">Ver ofertas</Link>
            </Button>
          }
          className="mt-6"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {shown.map((r) => {
              const st = STATUS[(r.status as StatusKey)] ?? STATUS.submitted;
              const Icon = st.icon;
              return (
                <li key={r.id}>
                  <Link
                    href={r.job?.slug ? `/dashboard/ofertas/${r.job.slug}` : '/dashboard/ofertas'}
                    className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {r.job?.title ?? 'Oferta'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.job?.company?.name ?? '—'} ·{' '}
                        {formatDistanceToNow(new Date(r.created_at), { locale: es, addSuffix: true })}
                      </p>
                    </div>
                    <Badge className={cn('shrink-0 gap-1', st.tone)}>
                      <Icon className="h-3 w-3" />
                      {st.label}
                    </Badge>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
        active ? 'bg-surface text-foreground shadow-sm ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </Link>
  );
}
