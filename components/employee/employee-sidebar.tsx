'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, FileText, CalendarCheck, Settings } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard/mi-perfil', label: 'Mi perfil', icon: User },
  { href: '/dashboard/mis-aplicaciones', label: 'Mis aplicaciones', icon: FileText },
  { href: '/dashboard/disponibilidad', label: 'Disponibilidad', icon: CalendarCheck },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export function EmployeeSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo height={32} />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
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
          href="/admin"
          className="block rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cambiar a vista empleador →
        </Link>
      </div>
    </aside>
  );
}
