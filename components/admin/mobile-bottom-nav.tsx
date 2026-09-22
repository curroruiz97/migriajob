'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Users,
  Search,
  Workflow,
  ShieldAlert,
  FolderOpen,
  MessageSquare,
  MessageCircle,
  CreditCard,
  Heart,
  GitCompare,
  Bell,
  BookmarkCheck,
  FileText,
  ClipboardList,
  Inbox,
  Briefcase,
  Megaphone,
  Building2,
  Settings,
  ListChecks,
  Menu,
  LogOut,
  X,
  type LucideIcon,
} from 'lucide-react';
import { signOutAction } from '@/app/(auth)/actions';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { useIsIOSApp } from '@/lib/hooks/use-is-ios-app';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  /** Muestra el badge de no leídos en este tab. */
  badge?: boolean;
  /** Solo para el equipo de Migria. Una empresa no lo ve. */
  adminOnly?: boolean;
};

const EMPLOYER_PRIMARY: NavItem[] = [
  { href: '/admin/ofertas', label: 'Ofertas', icon: Megaphone },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: Inbox },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare, badge: true },
  { href: '/admin/perfil-empresa', label: 'Empresa', icon: Building2 },
];

const EMPLOYER_MENU: NavItem[] = [
  { href: '/admin/candidatos', label: 'Buscar candidatos', icon: Users },
  { href: '/admin/procesos', label: 'Mis procesos', icon: Workflow },
  // Las dos de Migria. Estaban mal: Expedientes salía para cualquier empresa
  // —el menú móvil nunca supo del rol—, y Moderación no salía para nadie, de
  // modo que la bandeja de denuncias solo se abría escribiendo la dirección.
  { href: '/admin/expedientes', label: 'Expedientes', icon: FolderOpen, adminOnly: true },
  { href: '/admin/moderacion', label: 'Moderación', icon: ShieldAlert, adminOnly: true },
  { href: '/admin/busqueda-avanzada', label: 'Búsqueda avanzada', icon: Search },
  { href: '/admin/busquedas-guardadas', label: 'Búsquedas guardadas', icon: BookmarkCheck },
  { href: '/admin/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/admin/comparador', label: 'Comparador', icon: GitCompare },
  { href: '/admin/plantillas', label: 'Plantillas', icon: FileText },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/facturacion', label: 'Facturación', icon: CreditCard },
  // Aquí vive el borrado de cuenta (Cuenta y privacidad > Eliminar cuenta).
  // Apple lo dio por inexistente en el rechazo 5.1.1(v) porque desde el menú
  // del empleador no se llegaba: el único enlace estaba al final de la página
  // de Empresa. Un requisito obligatorio no puede depender de que alguien
  // haga scroll.
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

const CANDIDATE_PRIMARY: NavItem[] = [
  { href: '/dashboard/ofertas', label: 'Ofertas', icon: Briefcase },
  { href: '/dashboard/solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { href: '/dashboard/mensajes', label: 'Mensajes', icon: MessageCircle, badge: true },
  // "Mi proceso" sustituye a "Perfil" en el bottom nav (Perfil ahora se accede
  // desde el avatar arriba a la derecha).
  { href: '/dashboard/mi-proceso', label: 'Mi proceso', icon: ListChecks },
];

const CANDIDATE_MENU: NavItem[] = []; // El candidato no tiene "Más": 4 tabs directos.

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function MobileBottomNav({
  variant,
  unreadCount = 0,
  isAdmin = false,
}: {
  variant: 'employer' | 'candidate';
  unreadCount?: number;
  /** Equipo de Migria: añade Expedientes y Moderación al menú. */
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const esAppDeIPhone = useIsIOSApp();

  const primary = variant === 'employer' ? EMPLOYER_PRIMARY : CANDIDATE_PRIMARY;
  // Facturación fuera del menú en la app de iPhone: esa pantalla habla de
  // planes y método de pago, y para Apple es una vía de compra ajena a la
  // suya (3.1.1). En la web y en Android sigue estando.
  const menuBase = (variant === 'employer' ? EMPLOYER_MENU : CANDIDATE_MENU).filter(
    (item) => !item.adminOnly || isAdmin
  );
  const menu = esAppDeIPhone
    ? menuBase.filter((item) => item.href !== '/admin/facturacion')
    : menuBase;
  const hasMore = menu.length > 0;

  // Acento unificado: ambos roles usan el terracota (primary) de marca para
  // que el resalto sea consistente entre /dashboard y /admin.
  const activeIcon = 'bg-primary-soft text-primary';
  const activeText = 'text-primary';

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
                    active ? activeIcon : 'text-muted-foreground'
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
                    active ? activeText : 'text-muted-foreground'
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
                  menuActive || menuOpen ? activeIcon : 'text-muted-foreground'
                )}
              >
                <Menu className="h-[18px] w-[18px]" />
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium leading-none transition-colors',
                  menuActive || menuOpen ? activeText : 'text-muted-foreground'
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
