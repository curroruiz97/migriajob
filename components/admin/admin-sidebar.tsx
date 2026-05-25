'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Megaphone,
  Building2,
  Users,
  Search,
  Workflow,
  MessageSquare,
  CreditCard,
  Heart,
  GitCompare,
  Bell,
  BookmarkCheck,
  FileText,
  Inbox,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const NAV: Array<{ href: string; label: string; icon: typeof Megaphone; exact?: boolean }> = [
  { href: '/admin/ofertas', label: 'Ofertas', icon: Megaphone },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: Inbox },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/perfil-empresa', label: 'Perfil de empresa', icon: Building2 },
  { href: '/admin/candidatos', label: 'Buscar candidatos', icon: Users },
  { href: '/admin/procesos', label: 'Mis procesos', icon: Workflow },
  { href: '/admin/busqueda-avanzada', label: 'Búsqueda avanzada', icon: Search },
  { href: '/admin/busquedas-guardadas', label: 'Búsquedas guardadas', icon: BookmarkCheck },
  { href: '/admin/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/admin/comparador', label: 'Comparador', icon: GitCompare },
  { href: '/admin/plantillas', label: 'Plantillas', icon: FileText },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/facturacion', label: 'Facturación', icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo height={32} />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-primary-soft hover:text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/mi-perfil"
          className="block rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cambiar a vista candidato →
        </Link>
      </div>
    </aside>
  );
}
