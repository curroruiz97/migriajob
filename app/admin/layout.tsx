import { redirect } from 'next/navigation';
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

/**
 * Layout admin compartido entre /admin/* (incluído /admin/onboarding).
 *
 * NO redirige a /admin/onboarding si falta la company: ese chequeo se hace
 * en /admin/page.tsx (la ruta a la que apunta el "índice" del área admin),
 * porque hacerlo desde el layout requería detectar el pathname (header
 * `x-invoke-path` eliminado en Next 15) y entraba en bucle infinito de
 * redirecciones provocando pantalla en blanco en el WebView.
 *
 * Las páginas internas (ofertas, solicitudes, etc.) ya manejan la ausencia
 * de company mostrando un EmptyState con enlace a /admin/perfil-empresa.
 */
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
