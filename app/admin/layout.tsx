import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav';
import { CompareBar } from '@/components/admin/compare-bar';
import { CompareProvider } from '@/components/admin/compare-store';
import { createClient } from '@/lib/supabase/server';
import { getUnreadNotificationsCount } from '@/lib/db/queries';

// Zona autenticada: depende del usuario logueado, nunca se prerenderiza en build.
export const dynamic = 'force-dynamic';

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
  const { data: companyLogo } = await supabase
    .from('companies')
    .select('logo_url')
    .eq('owner_id', user.id)
    .maybeSingle();

  return (
    <CompareProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminTopbar
            user={{ email: user.email ?? '' }}
            unreadCount={unreadCount}
            avatarUrl={companyLogo?.logo_url ?? null}
          />
          <main className="w-full max-w-[100vw] flex-1 overflow-x-hidden px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
      <CompareBar />
      <MobileBottomNav variant="employer" unreadCount={unreadCount} />
    </CompareProvider>
  );
}
