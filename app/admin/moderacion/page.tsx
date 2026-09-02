import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { REPORT_REASONS, TARGET_LABEL, type ReportTarget } from '@/lib/moderation/reasons';
import { ReportActions } from './report-actions';

export const metadata = { title: 'Moderación' };
export const dynamic = 'force-dynamic';

/**
 * Bandeja de denuncias.
 *
 * Existe porque la directriz 1.2 de Apple no se conforma con que haya un botón
 * de denunciar: pide que alguien las atienda. Sin una pantalla donde se vean,
 * las denuncias se quedan en una tabla que nadie abre nunca.
 *
 * Solo para admins de Migria. /admin lo comparten empleadores y admins, así que
 * el filtro por rol se hace aquí y no basta con el middleware.
 */

const RAZON: Record<string, string> = Object.fromEntries(
  REPORT_REASONS.map((r) => [r.value, r.label])
);

const ESTADO_LABEL: Record<string, string> = {
  abierta: 'Abierta',
  en_revision: 'En revisión',
  resuelta: 'Resuelta',
  descartada: 'Descartada',
};

interface Report {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  reporter: { full_name: string | null } | null;
}

export default async function ModeracionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: string }>();

  if (perfil?.role !== 'admin') notFound();

  const { data } = await supabase
    .from('content_reports')
    /*
       AQUI PEDIA `email` DE `profiles` Y ESA COLUMNA NO EXISTE.
       El correo vive en auth.users, no en la tabla de perfiles. PostgREST
       devolvia error, `data` llegaba null, y la pantalla decia "Todavia no ha
       llegado ninguna denuncia" con denuncias dentro de la tabla. O sea: la
       bandeja que existe para atender denuncias no ensenaba ninguna, que es
       justo lo que la directriz 1.2 pide que funcione.

       Se pide solo el nombre. Si hace falta el correo del denunciante, hay que
       sacarlo por separado con la clave de servicio.
    */
    .select('*, reporter:profiles!content_reports_reporter_id_fkey(full_name)')
    .order('created_at', { ascending: false })
    .limit(200);

  const reports = (data ?? []) as unknown as Report[];
  const abiertas = reports.filter((r) => r.status === 'abierta' || r.status === 'en_revision');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moderación</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {abiertas.length === 0
            ? 'No hay denuncias pendientes.'
            : `${abiertas.length} denuncia${abiertas.length === 1 ? '' : 's'} sin resolver.`}
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
          Todavía no ha llegado ninguna denuncia.
        </p>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {RAZON[r.reason] ?? r.reason}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Sobre {TARGET_LABEL[r.target_type as ReportTarget] ?? r.target_type} ·{' '}
                    <code className="text-xs">{r.target_id}</code>
                  </p>
                </div>
                <Badge variant={r.status === 'abierta' ? 'destructive' : 'secondary'}>
                  {ESTADO_LABEL[r.status] ?? r.status}
                </Badge>
              </div>

              {r.details ? (
                <p className="mt-3 whitespace-pre-line rounded-lg bg-surface-muted/50 p-3 text-sm text-foreground">
                  {r.details}
                </p>
              ) : null}

              <p className="mt-3 text-xs text-muted-foreground">
                {r.reporter?.full_name ?? 'Usuario'} ·{' '}
                {new Date(r.created_at).toLocaleString('es-ES')}
              </p>

              <div className="mt-3">
                <ReportActions reportId={r.id} estado={r.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
