import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from './login-form';
import {
  AuthBrandPanel,
  AuthBrandHeaderMobile,
} from '@/components/public/auth-brand-panel';

export const metadata = {
  title: 'Iniciar sesión · Migria',
  description: 'Accede a tu cuenta Migria',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const registered = params.registered === '1';

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Form column */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <AuthBrandHeaderMobile variant="login" />

        <Link
          href="/"
          className="hidden items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al inicio
        </Link>

        <div className="mx-auto mt-10 flex w-full max-w-md flex-1 flex-col justify-center lg:mt-0">
          <header className="mb-8">
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Iniciar <em className="text-gradient-primary not-italic">sesión</em>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Accede a tu cuenta de Migria para continuar tu proceso o gestionar tu plantilla.
            </p>
          </header>

          <LoginForm registered={registered} />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Aún no tienes cuenta?{' '}
            <Link
              href="/registro"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Crear cuenta gratis
            </Link>
          </p>
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground/80">
          Al continuar aceptas los{' '}
          <Link href="/terms" className="underline-offset-2 hover:text-foreground hover:underline">
            Términos
          </Link>{' '}
          y la{' '}
          <Link href="/privacy" className="underline-offset-2 hover:text-foreground hover:underline">
            Política de privacidad
          </Link>
          .
        </p>
      </div>

      {/* Brand column — hidden on mobile */}
      <AuthBrandPanel variant="login" />
    </div>
  );
}
