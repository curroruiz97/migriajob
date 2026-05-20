import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from './onboarding-form';

export const metadata = { title: 'Crea tu empresa' };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Si ya tiene empresa, salta
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();
  if (existing) redirect('/admin');

  return (
    <div className="mx-auto max-w-xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Cuéntanos sobre tu empresa
        </h1>
        <p className="mt-2 text-muted-foreground">
          Antes de empezar a contactar candidatos, necesitamos crear tu ficha de empresa.
          Solo tarda un minuto.
        </p>
      </div>
      <OnboardingForm defaultName={user.user_metadata?.full_name ?? ''} />
    </div>
  );
}
