'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { signUpAction, type AuthState } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthBrandPanel } from '@/components/public/auth-brand-panel';
import { cn } from '@/lib/utils';

const initial: AuthState = {};

type Role = 'candidate' | 'employer';

export function RegistroForm() {
  const [role, setRole] = useState<Role>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Form column */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12 lg:pt-24">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <header className="mb-7">
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Crear <em className="text-gradient-primary not-italic">cuenta</em>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Gratis. Sin tarjeta. Listo en 60 segundos.
            </p>
          </header>

          {/* Role toggle — segmented control */}
          <fieldset className="mb-6">
            <legend className="sr-only">Selecciona tu rol</legend>
            <div
              role="radiogroup"
              aria-label="Selecciona tu rol"
              className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/40 p-1.5"
            >
              <RoleOption
                value="candidate"
                active={role === 'candidate'}
                onClick={() => setRole('candidate')}
                icon={UserIcon}
                title="Soy candidato"
                subtitle="Busco trabajo"
              />
              <RoleOption
                value="employer"
                active={role === 'employer'}
                onClick={() => setRole('employer')}
                icon={Briefcase}
                title="Soy empresa"
                subtitle="Busco talento"
              />
            </div>
          </fieldset>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="role" value={role} />

            {state.error && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {role === 'employer' ? 'Tu nombre' : 'Nombre completo'}
              </Label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  minLength={2}
                  placeholder={
                    role === 'employer' ? 'María Fernández' : 'Carlos Pérez García'
                  }
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {role === 'employer' ? 'Email corporativo' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={
                    role === 'employer' ? 'maria@empresa.com' : 'tu@email.com'
                  }
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="h-11 rounded-xl pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Mínimo 8 caracteres. Una mayúscula y un número recomendado.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm"
              disabled={pending}
            >
              {pending
                ? 'Creando cuenta…'
                : role === 'employer'
                ? 'Crear cuenta de empresa'
                : 'Crear mi cuenta'}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>

          <p className="mx-auto mt-10 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground/80">
            Al crear cuenta aceptas los{' '}
            <Link
              href="/terms"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Términos
            </Link>{' '}
            y la{' '}
            <Link
              href="/privacy"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Política de privacidad
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Brand column reacts to role */}
      <AuthBrandPanel
        variant={role === 'employer' ? 'register-employer' : 'register-candidate'}
      />
    </div>
  );
}

function RoleOption({
  value,
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}: {
  value: Role;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      data-value={value}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        active
          ? 'bg-surface shadow-sm ring-1 ring-border'
          : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
      )}
    >
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block text-sm font-semibold leading-tight',
            active ? 'text-foreground' : 'text-foreground/80'
          )}
        >
          {title}
        </span>
        <span className="block text-[11px] leading-tight text-muted-foreground">
          {subtitle}
        </span>
      </span>
    </button>
  );
}
