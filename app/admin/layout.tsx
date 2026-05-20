import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { CompareBar } from '@/components/admin/compare-bar';
import { CompareProvider } from '@/components/admin/compare-store';
import { createClient } from '@/lib/supabase/server';
import { getUnreadNotificationsCount } from '@/lib/db/queries';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/admin');

  // Defense in depth: solo empleadores y admins. Candidatos van a /dashboard.
  const { data: roleProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: 'candidate' | 'employer' | 'admin' }>();
  const role = roleProfile?.role ?? 'candidate';
  if (role === 'candidate') {
    redirect('/dashboard/mi-perfil');
  }

  const hdrs = await headers();
  const pathname = hdrs.get('x-invoke-path') ?? hdrs.get('x-pathname') ?? '';
  const isOnboarding = pathname.includes('/admin/onboarding');

  if (!isOnboarding) {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle();
    if (!company) redirect('/admin/onboarding');
  }

  const unreadCount = await getUnreadNotificationsCount(user.id).catch(() => 0);

  return (
    <CompareProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminTopbar user={{ email: user.email ?? '' }} unreadCount={unreadCount} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
      <CompareBar />
    </CompareProvider>
  );
}
