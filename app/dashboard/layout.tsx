import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { EmployeeSidebar } from '@/components/employee/employee-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav';
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

  return (
    <div className="flex min-h-screen bg-background">
      <EmployeeSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar user={{ email: user.email ?? '' }} unreadCount={unreadCount} variant="candidate" />
        <main className="flex-1 px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav variant="candidate" unreadCount={unreadCount} />
    </div>
  );
}
