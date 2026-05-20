import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RecuperarForm } from './recuperar-form';
import {
  AuthBrandPanel,
  AuthBrandHeaderMobile,
} from '@/components/public/auth-brand-panel';

export const metadata = { title: 'Recuperar contraseña · Migria' };

export default function RecuperarPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Form column */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <AuthBrandHeaderMobile variant="recover" />

        <Link
          href="/login"
          className="hidden items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al login
        </Link>

        <div className="mx-auto mt-10 flex w-full max-w-md flex-1 flex-col justify-center lg:mt-0">
          <header className="mb-8">
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Recuperar <em className="text-gradient-primary not-italic">acceso</em>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Introduce el email de tu cuenta. Te enviaremos un enlace seguro para restablecer la
              contraseña.
            </p>
          </header>

          <RecuperarForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Recordaste la contraseña?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Brand column */}
      <AuthBrandPanel variant="recover" />
    </div>
  );
}
