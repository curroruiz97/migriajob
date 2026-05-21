import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Briefcase, Building2, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bienvenido a Migria',
  description: 'Talento que viaja, empresas que crecen, comunidades que prosperan.',
};

export default async function BienvenidaPage() {
  // Si ya hay sesión, lleva al área correspondiente (no mostrar la bienvenida).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'candidate' | 'employer' | 'admin' }>();
    const role = profile?.role ?? 'candidate';
    redirect(role === 'employer' || role === 'admin' ? '/admin' : '/dashboard/ofertas');
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-hero-gradient">
      <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 28px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
        }}
      >
        {/* Marca */}
        <header className="flex flex-col items-center pt-6 text-center">
          <Logo height={44} asChild />
          <p className="mt-5 max-w-xs font-display text-xl leading-snug tracking-tight text-foreground">
            Talento que viaja, empresas que crecen, comunidades que prosperan.
          </p>
        </header>

        {/* Bloques de rol */}
        <div className="mt-8 flex flex-1 flex-col justify-center gap-4">
          <RoleCard
            role="candidate"
            icon={Briefcase}
            eyebrow="Busco empleo"
            title="Encuentra tu próximo trabajo"
            description="Oportunidades reales en la hostelería y la industria española."
            accent="primary"
          />
          <RoleCard
            role="employer"
            icon={Building2}
            eyebrow="Soy empresa"
            title="Encuentra el talento que necesitas"
            description="Publica ofertas y conecta con profesionales verificados."
            accent="secondary"
          />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Al continuar aceptas los{' '}
          <Link href="/terms" className="underline-offset-2 hover:text-foreground hover:underline">
            Términos
          </Link>{' '}
          y la{' '}
          <Link href="/privacy" className="underline-offset-2 hover:text-foreground hover:underline">
            Privacidad
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function RoleCard({
  role,
  icon: Icon,
  eyebrow,
  title,
  description,
  accent,
}: {
  role: 'candidate' | 'employer';
  icon: typeof Briefcase;
  eyebrow: string;
  title: string;
  description: string;
  accent: 'primary' | 'secondary';
}) {
  const isPrimary = accent === 'primary';
  return (
    <section
      className={
        'rounded-3xl border bg-surface/90 p-5 shadow-md backdrop-blur-sm ' +
        (isPrimary ? 'border-primary/25' : 'border-border')
      }
    >
      <div className="flex items-center gap-3">
        <span
          className={
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ' +
            (isPrimary
              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground ring-primary/20'
              : 'bg-secondary text-secondary-foreground ring-secondary/20')
          }
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p
            className={
              'text-[11px] font-semibold uppercase tracking-[0.18em] ' +
              (isPrimary ? 'text-primary' : 'text-muted-foreground')
            }
          >
            {eyebrow}
          </p>
          <h2 className="font-semibold leading-tight text-foreground">{title}</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/registro?role=${role}`}
          className={
            'inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold shadow-sm transition-colors ' +
            (isPrimary
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90')
          }
        >
          <UserPlus className="h-4 w-4" />
          Crear cuenta
        </Link>
        <Link
          href={`/login?role=${role}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
}
