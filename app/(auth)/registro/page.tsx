import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RegistroForm } from './registro-form';
import { AuthBrandHeaderMobile } from '@/components/public/auth-brand-panel';

export const metadata = {
  title: 'Crear cuenta · Migria',
  description: 'Crea tu cuenta gratuita en Migria',
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === 'employer' ? 'employer' : 'candidate';

  return (
    <div className="min-h-screen">
      <div className="lg:hidden px-6 py-8">
        <AuthBrandHeaderMobile variant="register-candidate" />
      </div>
      <Link
        href="/bienvenida"
        className="absolute left-6 top-6 z-10 hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex lg:left-16 lg:top-12"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver
      </Link>

      <RegistroForm initialRole={initialRole} />
    </div>
  );
}
