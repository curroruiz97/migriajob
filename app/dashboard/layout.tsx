import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { EmployeeSidebar } from '@/components/employee/employee-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { createClient } from '@/lib/supabase/server';
import { getUnreadNotificationsCount } from '@/lib/db/queries';

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
        <AdminTopbar user={{ email: user.email ?? '' }} unreadCount={unreadCount} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
