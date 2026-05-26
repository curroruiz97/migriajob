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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/dashboard');

  // Defense in depth: empleadores y admins solo en /admin, candidatos solo aquí.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: 'candidate' | 'employer' | 'admin' }>();
  const role = profile?.role ?? 'candidate';
  if (role === 'employer' || role === 'admin') {
    redirect('/admin');
  }

  const unreadCount = await getUnreadNotificationsCount(user.id).catch(() => 0);
  const { data: cand } = await supabase
    .from('candidates')
    .select('id, avatar_url')
    .eq('profile_id', user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Avisos in-app (toast + refresh) */}
      <RealtimeMessagesToast userId={user.id} />
      {cand?.id && <RealtimeApplicationStatusToast candidateId={cand.id} />}

      <EmployeeSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar
          user={{ email: user.email ?? '' }}
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
