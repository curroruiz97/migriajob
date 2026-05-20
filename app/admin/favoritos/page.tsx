import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEmployerFavorites } from '@/lib/db/queries';
import { ProfileCard } from '@/components/public/profile-card';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Favoritos' };

export default async function FavoritosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const rows = await getEmployerFavorites(user!.id).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>
        <p className="mt-1 text-sm text-zinc-500">Candidatos que has guardado.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aún no tienes favoritos"
          description="Cuando guardes un candidato aparecerá aquí."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <ProfileCard key={r.candidate.id} profile={r.candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
