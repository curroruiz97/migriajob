'use client';

import Link from 'next/link';
import { Search, Bell, LogOut, CreditCard, ChevronDown, Command } from 'lucide-react';
import { signOutAction } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AdminTopbarProps {
  user: { email: string };
  unreadCount?: number;
  /** 'employer' (por defecto): buscador de candidatos + facturación. 'candidate': solo marca + perfil. */
  variant?: 'employer' | 'candidate';
  /** Foto del candidato o logo de la empresa; se refleja en el avatar superior. */
  avatarUrl?: string | null;
}

function getInitials(email: string) {
  const name = email.split('@')[0] ?? email;
  const parts = name.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function AdminTopbar({ user, unreadCount = 0, variant = 'employer', avatarUrl = null }: AdminTopbarProps) {
  const initials = getInitials(user.email);
  const displayName = user.email.split('@')[0] ?? user.email;
  const hasUnread = unreadCount > 0;
  const isCandidate = variant === 'candidate';

  return (
    <TooltipProvider delayDuration={200}>
      <header className="safe-top sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8">
        {isCandidate ? (
          // Vista candidato: marca a la izquierda (sin buscador de candidatos — eso es de reclutador).
          <Link href="/dashboard/ofertas" aria-label="MigriaJob — Ofertas" className="flex items-center lg:hidden">
            <Logo height={26} asChild />
          </Link>
        ) : (
          // Vista empleador: buscador de candidatos.
          <form action="/admin/candidatos" className="flex flex-1 max-w-md items-center">
            <div className="group relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                name="q"
                placeholder="Buscar candidatos por nombre, skill, ciudad…"
                className="h-10 rounded-full border-border/70 bg-muted/40 pl-10 pr-16 text-sm shadow-none transition-all placeholder:text-muted-foreground/80 hover:bg-muted/60 focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Buscar candidatos"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-0.5 rounded border border-border-strong/40 bg-surface px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-flex">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </form>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Notifications — solo empleador (el candidato las ve en el tab Mensajes) */}
          {!isCandidate && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Notificaciones${hasUnread ? ` (${unreadCount} sin leer)` : ''}`}
                    asChild
                    className="relative h-10 w-10 rounded-full hover:bg-primary-soft hover:text-primary"
                  >
                    <Link href="/admin/notificaciones">
                      <Bell
                        className={cn(
                          'h-[18px] w-[18px] transition-transform',
                          hasUnread && 'animate-wiggle'
                        )}
                      />
                      {hasUnread && (
                        <>
                          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground shadow-sm">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                          <span className="absolute right-1.5 top-1.5 h-4 w-4 animate-ping rounded-full bg-primary/60" />
                        </>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {hasUnread ? `${unreadCount} sin leer` : 'Notificaciones'}
                </TooltipContent>
              </Tooltip>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
            </>
          )}

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex items-center gap-2 rounded-full border border-transparent py-1 pl-1 pr-2 transition-all hover:border-border hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:pr-3"
                aria-label="Abrir menú de usuario"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/15 transition-all group-hover:ring-primary/30">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="max-w-[140px] truncate text-xs font-semibold text-foreground">
                    {displayName}
                  </span>
                  <span className="max-w-[140px] truncate text-[10px] text-muted-foreground">
                    {user.email}
                  </span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64 overflow-hidden p-0">
              <div className="flex items-center gap-3 border-b border-border bg-gradient-to-br from-primary-soft/60 via-surface to-surface px-3 py-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-foreground">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>

              {/* Empleador: solo Facturación (Configuración la accede desde otro lado). Candidato: nada aquí. */}
              {!isCandidate && (
                <>
                  <div className="p-1">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/facturacion"
                        className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-sm"
                      >
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Facturación
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="my-0" />
                </>
              )}

              <div className="p-1">
                <DropdownMenuItem
                  asChild
                  className="focus:bg-destructive-soft focus:text-destructive"
                >
                  <form action={signOutAction} className="w-full">
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center gap-2.5 px-2.5 py-2 text-sm text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </form>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
