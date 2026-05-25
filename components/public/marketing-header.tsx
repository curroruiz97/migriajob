import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserMenu } from './user-menu';

const NAV_ITEMS = [
  { href: '/empleos', label: 'Empleos' },
  { href: '/empresas', label: 'Migria para empresas' },
  { href: '/empleados', label: 'Migria para empleados' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/contacto', label: 'Contacto' },
];

export async function MarketingHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header
      className="safe-top sticky top-0 z-40 w-full border-b border-border/60 bg-glass"
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo height={72} />

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {user ? (
            <UserMenu email={user.email ?? ''} />
          ) : (
            <>
              {/* Separador visual */}
              <span className="hidden h-6 w-px bg-border sm:inline-block" />

              {/* Iniciar sesión — link discreto pero visible */}
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login" className="gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Iniciar sesión
                </Link>
              </Button>

              {/* CTA primario */}
              <Button size="sm" asChild className="rounded-full shadow-sm">
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Subnav móvil cuando no hay login — solo en móvil pequeño */}
      {!user && (
        <div className="border-t border-border/60 bg-surface-muted/30 sm:hidden">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <LogIn className="h-3.5 w-3.5" />
            ¿Ya tienes cuenta? Iniciar sesión
          </Link>
        </div>
      )}
    </header>
  );
}
