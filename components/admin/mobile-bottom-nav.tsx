'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Search,
  Workflow,
  MessageSquare,
  MessageCircle,
  CreditCard,
  Heart,
  GitCompare,
  Bell,
  BookmarkCheck,
  FileText,
  ClipboardList,
  Briefcase,
  User,
  Settings,
  Menu,
  LogOut,
  X,
  type LucideIcon,
} from 'lucide-react';
import { signOutAction } from '@/app/(auth)/actions';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  /** Muestra el badge de no leídos en este tab. */
  badge?: boolean;
};

const EMPLOYER_PRIMARY: NavItem[] = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/admin/candidatos', label: 'Candidatos', icon: Users },
  { href: '/admin/procesos', label: 'Procesos', icon: Workflow },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
];

const EMPLOYER_MENU: NavItem[] = [
  { href: '/admin/busqueda-avanzada', label: 'Búsqueda avanzada', icon: Search },
  { href: '/admin/busquedas-guardadas', label: 'Búsquedas guardadas', icon: BookmarkCheck },
  { href: '/admin/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/admin/comparador', label: 'Comparador', icon: GitCompare },
  { href: '/admin/plantillas', label: 'Plantillas', icon: FileText },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/facturacion', label: 'Facturación', icon: CreditCard },
];

const CANDIDATE_PRIMARY: NavItem[] = [
  { href: '/dashboard/ofertas', label: 'Ofertas', icon: Briefcase },
  { href: '/dashboard/solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { href: '/dashboard/mensajes', label: 'Mensajes', icon: MessageCircle, badge: true },
  { href: '/dashboard/mi-perfil', label: 'Perfil', icon: User },
];

const CANDIDATE_MENU: NavItem[] = []; // El candidato no tiene "Más": 4 tabs directos.

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function MobileBottomNav({
  variant,
  unreadCount = 0,
}: {
  variant: 'employer' | 'candidate';
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const primary = variant === 'employer' ? EMPLOYER_PRIMARY : CANDIDATE_PRIMARY;
  const menu = variant === 'employer' ? EMPLOYER_MENU : CANDIDATE_MENU;
  const hasMore = menu.length > 0;

  const menuActive = menu.some((item) => isActive(pathname, item));

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
          {primary.map((item) => {
            const active = isActive(pathname, item);
            const showBadge = item.badge && unreadCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-1 flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    'relative flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-primary-soft text-primary' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {showBadge && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-surface bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'max-w-full truncate text-[10px] font-medium leading-none transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {hasMore && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Más opciones"
              aria-expanded={menuOpen}
              className="group flex flex-1 flex-col items-center justify-center gap-1"
            >
              <span
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                  menuActive || menuOpen ? 'bg-primary-soft text-primary' : 'text-muted-foreground'
                )}
              >
                <Menu className="h-[18px] w-[18px]" />
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium leading-none transition-colors',
                  menuActive || menuOpen ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Más
              </span>
            </button>
          )}
        </div>
      </nav>

      {hasMore && (
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          items={menu}
          pathname={pathname}
        />
      )}
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  items,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-in fade-in-0"
      />
      <div className="absolute inset-0 flex flex-col bg-background animate-in slide-in-from-bottom duration-300">
        <header
          className="flex items-center justify-between border-b border-border px-4"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)', paddingBottom: '12px' }}
        >
          <Logo height={28} asChild />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-primary-soft hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="border-t border-border p-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
        >
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-destructive transition-colors hover:bg-destructive-soft"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
