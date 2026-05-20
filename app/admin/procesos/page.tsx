import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEmployerProcesses } from '@/lib/db/queries';
import { ProcessKanban } from '@/components/admin/process-kanban';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Mis procesos' };

export default async function ProcessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rows = await getEmployerProcesses(user!.id).catch(() => []);

  const items = rows.map((r) => {
    // r.candidate viene del select en queries (snake_case)
    const c = r.candidate as unknown as {
      id: string; slug: string | null; avatar_url: string | null;
      headline: string | null; current_role: string | null;
      location_city: string | null; location_country: string | null;
      country_of_origin: string | null;
    };
    return {
      id: r.process.id,
      candidateId: c.id,
      candidateSlug: c.slug,
      candidateAvatarUrl: c.avatar_url,
      candidateHeadline: c.headline ?? c.current_role ?? 'Candidato',
      candidateCountry: c.country_of_origin,
      candidateLocation: [c.location_city, c.location_country].filter(Boolean).join(', '),
      stage: r.process.stage,
      notes: r.process.notes ?? null,
      updatedAt: r.process.updatedAt,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis procesos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Arrastra candidatos entre etapas. Total: <strong>{items.length}</strong>.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/admin/procesos/export" download>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exportar CSV
          </a>
        </Button>
      </div>

      <ProcessKanban items={items} />
    </div>
  );
}
