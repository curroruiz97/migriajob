import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { EmployeeSidebar } from '@/components/employee/employee-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav';
import { RealtimeMessagesToast } from '@/components/realtime/realtime-messages-toast';
import { RealtimeApplicationStatusToast } from '@/components/realtime/realtime-application-status-toast';
import { createClient } from '@/lib/supabase/server';
import { getUnreadNotificationsCount } from '@/lib/db/queries';

// Zona autenticada: depende del usuario logueado, nunca se prerenderiza en build.
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // getClaims valida el JWT localmente, sin ir a Supabase. El middleware ya
  // comprobó que hay sesión en esta misma petición; repetir `getUser()` aquí
  // era otra ida y vuelta a la red antes de pintar nada.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const userEmail = (claimsData?.claims?.email as string | undefined) ?? '';
  if (!userId) redirect('/login?redirectTo=/dashboard');

  // Las tres consultas son independientes entre sí, así que van a la vez. En
  // serie sumaban sus tres tiempos de ida y vuelta; ahora cuesta lo que la más
  // lenta. El rol se sigue comprobando aquí —defense in depth: empleadores y
  // admins solo en /admin, candidatos solo aquí— porque el middleware ya no lo
  // mira.
  const [{ data: profile }, unreadCount, { data: cand }] = await Promise.all([
    supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single<{ role: 'candidate' | 'employer' | 'admin' }>(),
    getUnreadNotificationsCount(userId).catch(() => 0),
    supabase
      .from('candidates')
      .select('id, avatar_url')
      .eq('profile_id', userId)
      .maybeSingle(),
  ]);

  const role = profile?.role ?? 'candidate';
  if (role === 'employer' || role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Avisos in-app (toast + refresh) */}
      <RealtimeMessagesToast userId={userId} />
      {cand?.id && <RealtimeApplicationStatusToast candidateId={cand.id} />}

      <EmployeeSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar
          user={{ email: userEmail }}
          unreadCount={unreadCount}
          variant="candidate"
          avatarUrl={cand?.avatar_url ?? null}
        />
        <main className="w-full max-w-[100vw] flex-1 overflow-x-hidden px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav variant="candidate" unreadCount={unreadCount} />
    </div>
  );
}
