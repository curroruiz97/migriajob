import { Users } from 'lucide-react';
import { searchProfiles } from '@/lib/db/queries';
import { ProfileFilters } from '@/components/public/profile-filters';
import { ProfilesToolbar } from '@/components/public/profiles-toolbar';
import { ProfileCard } from '@/components/public/profile-card';
import { ProfilesPagination } from '@/components/public/profiles-pagination';
import { SaveSearchButton } from '@/components/admin/save-search-button';
import { EmptyState } from '@/components/ui/empty-state';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

export const metadata = { title: 'Candidatos' };

interface PageProps {
  searchParams: Promise<{
    q?: string;
    view?: 'grid' | 'list';
    availability?: 'open' | 'passive' | 'closed';
    city?: string;
    expMin?: string;
    salaryMin?: string;
    countryOrigin?: string;
    workPermit?: string;
    hasNie?: string;
    verified?: string;
    inSpain?: string;
    page?: string;
  }>;
}

export default async function AdminCandidatosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view === 'list' ? 'list' : 'grid';

  const { items: profiles, total, perPage } = await searchProfiles({
    q: params.q,
    availability: params.availability,
    city: params.city,
    experienceMin: params.expMin ? Number(params.expMin) : undefined,
    salaryMin: params.salaryMin ? Number(params.salaryMin) : undefined,
    countryOrigin: params.countryOrigin,
    workPermit: params.workPermit as never,
    hasNie: params.hasNie === 'true',
    verified: params.verified === 'true',
    inSpain: params.inSpain === 'true',
    page: params.page ? Number(params.page) : 1,
    // El admin ve también los candidatos importados/privados (RLS lo limita a rol admin).
    includeNonPublic: true,
  }).catch(() => ({ items: [] as Candidate[], total: 0, perPage: 20 }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Candidatos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explora candidatos, guarda los que te interesen y muévelos a tu pipeline.
          </p>
        </div>
        <SaveSearchButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ProfileFilters />
        </aside>

        <div>
          <ProfilesToolbar count={total} />

          {profiles.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No hay candidatos para esos filtros"
              description="Prueba ajustando los filtros o ampliando el rango de experiencia."
              className="mt-6"
            />
          ) : (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
                    : 'mt-6 space-y-3'
                }
              >
                {profiles.map((p) => (
                  <ProfileCard key={p.id} profile={p} view={view} />
                ))}
              </div>
              <ProfilesPagination total={total} perPage={perPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
