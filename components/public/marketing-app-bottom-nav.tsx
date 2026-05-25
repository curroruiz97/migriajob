import { Briefcase, LogIn, Mail, Building2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUnreadNotificationsCount } from '@/lib/db/queries';
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav';
import { ShowInApp } from '@/components/common/hide-in-app';

/**
 * Barra inferior que se muestra SOLO dentro de la app Capacitor, en las páginas
 * de marketing/auth. Sustituye al footer (oculto en app vía <HideInApp>).
 *
 * - Si hay sesión, reutiliza <MobileBottomNav> con la variante del rol.
 * - Si NO hay sesión, muestra accesos rápidos públicos (Empleos, Empresas, Login, Contacto).
 */
export async function MarketingAppBottomNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <ShowInApp>
        <GuestBottomNav />
      </ShowInApp>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: 'candidate' | 'employer' | 'admin' }>();

  const role = profile?.role ?? 'candidate';
  const variant: 'candidate' | 'employer' = role === 'candidate' ? 'candidate' : 'employer';
  const unreadCount = await getUnreadNotificationsCount(user.id).catch(() => 0);

  return (
    <ShowInApp>
      <MobileBottomNav variant={variant} unreadCount={unreadCount} />
    </ShowInApp>
  );
}

function GuestBottomNav() {
  const items = [
    { href: '/empleos', label: 'Empleos', icon: Briefcase },
    { href: '/empresas', label: 'Empresas', icon: Building2 },
    { href: '/login', label: 'Entrar', icon: LogIn },
    { href: '/contacto', label: 'Contacto', icon: Mail },
  ];
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground"
          >
            <span className="flex h-8 w-12 items-center justify-center rounded-full">
              <item.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
