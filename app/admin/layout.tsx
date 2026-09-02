import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav';
import { CompareBar } from '@/components/admin/compare-bar';
import { CompareProvider } from '@/components/admin/compare-store';
import { RealtimeMessagesToast } from '@/components/realtime/realtime-messages-toast';
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

  // getClaims valida el JWT localmente, sin salir a la red. El middleware ya
  // comprobó la sesión en esta misma petición; volver a llamar a `getUser()`
  // era otra ida y vuelta a Supabase antes de pintar nada.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const userEmail = (claimsData?.claims?.email as string | undefined) ?? '';
  if (!userId) redirect('/login?redirectTo=/admin');

  // Las tres consultas son independientes: en serie sumaban sus tres tiempos de
  // ida y vuelta, a la vez cuestan lo que la más lenta. El rol se comprueba
  // aquí —defense in depth: solo empleadores y admins; los candidatos van a
  // /dashboard— porque el middleware ya no lo mira.
  const [{ data: roleProfile }, unreadCount, { data: companyLogo }] = await Promise.all([
    supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single<{ role: 'candidate' | 'employer' | 'admin' }>(),
    getUnreadNotificationsCount(userId).catch(() => 0),
    supabase
      .from('companies')
      .select('logo_url')
      .eq('owner_id', userId)
      .maybeSingle(),
  ]);

  const role = roleProfile?.role ?? 'candidate';
  if (role === 'candidate') {
    redirect('/dashboard/mi-perfil');
  }

  return (
    <CompareProvider>
      {/* Avisos in-app (toast + refresh) para mensajes nuevos */}
      <RealtimeMessagesToast userId={userId} />

      <div className="flex min-h-screen bg-background">
        <AdminSidebar isAdmin={role === 'admin'} />
        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminTopbar
            user={{ email: userEmail }}
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
