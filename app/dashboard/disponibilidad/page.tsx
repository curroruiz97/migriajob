import { createClient } from '@/lib/supabase/server';
import { getCandidateByProfile } from '@/lib/db/queries';
import { AvailabilityToggle } from './availability-toggle';

export const metadata = { title: 'Disponibilidad' };

export default async function DisponibilidadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const candidate = await getCandidateByProfile(user!.id).catch(() => null);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Disponibilidad</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Controla cómo te ven las empresas en el marketplace.
        </p>
      </div>

      <AvailabilityToggle
        initialAvailability={candidate?.availability ?? 'closed'}
        initialIsPublic={candidate?.isPublic ?? false}
      />
    </div>
  );
}
