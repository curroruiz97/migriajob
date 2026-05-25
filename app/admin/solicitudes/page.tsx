import Link from 'next/link';
import { ChevronRight, Inbox, MapPin, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { RealtimeApplicationsToast } from '@/components/admin/realtime-applications-toast';

export const metadata = { title: 'Solicitudes' };

const STATUS_LABEL: Record<string, { label: string; tone: 'success' | 'warning' | 'soft' | 'destructive' }> = {
  submitted: { label: 'Nueva', tone: 'warning' },
  reviewing: { label: 'En revisión', tone: 'soft' },
  shortlisted: { label: 'Preseleccionada', tone: 'success' },
  rejected: { label: 'Descartada', tone: 'destructive' },
  hired: { label: 'Contratada', tone: 'success' },
};

interface Row {
  id: string;
  status: string;
  created_at: string;
  job: { id: string; title: string; location: string | null } | null;
  candidate:
    | { id: string; slug: string | null; profile_id: string; headline: string | null; current_role: string | null; avatar_url: string | null; location_city: string | null; years_experience: number | null; profile: { full_name: string | null } | null }
    | null;
}

export default async function SolicitudesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Solicitudes recibidas en las ofertas de la empresa del usuario actual.
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  let items: Row[] = [];
  let companyId: string | null = null;
  if (company) {
    companyId = company.id as string;
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', company.id);
    const jobIds = (jobs ?? []).map((j) => j.id as string);

    if (jobIds.length > 0) {
      const { data } = await supabase
        .from('applications')
        .select(`
          id, status, created_at,
          job:jobs(id, title, location),
          candidate:candidates(
            id, slug, profile_id, headline, current_role, avatar_url,
            location_city, years_experience,
            profile:profiles(full_name)
          )
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });
      items = (data ?? []) as unknown as Row[];
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
          Solicitudes recibidas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Candidatos que se han inscrito a tus ofertas. Pulsa sobre una solicitud
          para ver el perfil completo y escribirles.
        </p>
      </div>

      {/* Suscripción Realtime → toast in-app cuando llega una nueva solicitud */}
      {companyId && <RealtimeApplicationsToast companyId={companyId} />}

      {!company ? (
        <EmptyState
          icon={Inbox}
          title="Completa el perfil de tu empresa"
          description="Necesitas perfil de empresa para empezar a recibir solicitudes."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Todavía no tienes solicitudes"
          description="Cuando un candidato se inscriba a tus ofertas, aparecerá aquí."
        />
      ) : (
        <div className="space-y-2">
          {items.map((a) => {
            const st = STATUS_LABEL[a.status] ?? STATUS_LABEL.submitted;
            const c = a.candidate;
            const name = c?.profile?.full_name || c?.headline || c?.current_role || 'Candidato';
            const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
            return (
              <Link
                key={a.id}
                href={`/admin/solicitudes/${a.id}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-muted/40"
              >
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  {c?.avatar_url && <AvatarImage src={c.avatar_url} alt="" />}
                  <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                    <Badge variant={st.tone}>{st.label}</Badge>
                  </div>
                  {a.job && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Oferta: <span className="text-foreground">{a.job.title}</span>
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                    {c?.location_city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {c.location_city}
                      </span>
                    )}
                    {c?.years_experience != null && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {c.years_experience} años exp.
                      </span>
                    )}
                    <span>
                      {formatDistanceToNow(new Date(a.created_at), { locale: es, addSuffix: true })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
