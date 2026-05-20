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
  CreditCard,
  Heart,
  GitCompare,
  Bell,
  BookmarkCheck,
  FileText,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/candidatos', label: 'Candidatos', icon: Users },
  { href: '/admin/busqueda-avanzada', label: 'Búsqueda avanzada', icon: Search },
  { href: '/admin/busquedas-guardadas', label: 'Búsquedas guardadas', icon: BookmarkCheck },
  { href: '/admin/procesos', label: 'Mis procesos', icon: Workflow },
  { href: '/admin/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/admin/comparador', label: 'Comparador', icon: GitCompare },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/plantillas', label: 'Plantillas', icon: FileText },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/facturacion', label: 'Facturación', icon: CreditCard },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle>
            <Logo height={28} asChild />
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-primary-soft hover:text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
