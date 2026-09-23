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
  FolderOpen,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

// Qué ve una empresa y qué ve el equipo.
//
// /admin lo comparten los dos, y Talnet pidió que la empresa cliente no tenga
// acceso al fondo de candidatos ni a los procesos de nadie. Así que el panel de
// una empresa se queda en lo suyo: sus ofertas, sus candidaturas, sus mensajes
// y su ficha. Todo lo demás —el buscador del catálogo y las herramientas de
// reclutador que cuelgan de él: procesos, búsqueda avanzada, búsquedas
// guardadas, favoritos, comparador y plantillas— pasa a ser del equipo.
//
// Facturación también, porque hoy es una pantalla de mentira (texto fijo, sin
// planes ni límites detrás) y enseñársela a un cliente es peor que no tenerla.
//
// Ocultar la entrada no cierra la puerta: cada una de esas carpetas lleva su
// propio layout con soloEquipo(), que es lo que de verdad responde 404.
const NAV: Array<{ href: string; label: string; icon: typeof Megaphone; exact?: boolean; adminOnly?: boolean }> = [
  { href: '/admin/ofertas', label: 'Ofertas', icon: Megaphone },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: Inbox },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/perfil-empresa', label: 'Perfil de empresa', icon: Building2 },
  { href: '/admin/candidatos', label: 'Buscar candidatos', icon: Users, adminOnly: true },
  { href: '/admin/procesos', label: 'Mis procesos', icon: Workflow, adminOnly: true },
  { href: '/admin/expedientes', label: 'Expedientes', icon: FolderOpen, adminOnly: true },
  // La bandeja de denuncias no estaba en ningún menú: se abría solo escribiendo
  // la dirección. La directriz 1.2 de Apple no se conforma con que exista el
  // botón de denunciar, pide que alguien las atienda, y nadie atiende una
  // bandeja que no ve.
  { href: '/admin/moderacion', label: 'Moderación', icon: ShieldAlert, adminOnly: true },
  { href: '/admin/metricas', label: 'Métricas', icon: BarChart3, adminOnly: true },
  { href: '/admin/busqueda-avanzada', label: 'Búsqueda avanzada', icon: Search, adminOnly: true },
  { href: '/admin/busquedas-guardadas', label: 'Búsquedas guardadas', icon: BookmarkCheck, adminOnly: true },
  { href: '/admin/favoritos', label: 'Favoritos', icon: Heart, adminOnly: true },
  { href: '/admin/comparador', label: 'Comparador', icon: GitCompare, adminOnly: true },
  { href: '/admin/plantillas', label: 'Plantillas', icon: FileText, adminOnly: true },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/facturacion', label: 'Facturación', icon: CreditCard, adminOnly: true },
];

export function AdminSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo height={26} />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
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
