import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Plane,
  BadgeCheck,
  HandHeart,
  Users,
  Building2,
  Quote,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { CountryFlag } from '@/components/ui/country-flag';

type Variant = 'login' | 'register-candidate' | 'register-employer' | 'recover';

interface AuthBrandPanelProps {
  variant?: Variant;
}

const COPY: Record<
  Variant,
  {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
    highlights: { icon: React.ComponentType<{ className?: string }>; label: string }[];
    testimonial?: { quote: string; name: string; role: string };
  }
> = {
  login: {
    eyebrow: 'Talento hispanoamericano · Empleos en España',
    title: (
      <>
        Bienvenido de vuelta a{' '}
        <em className="text-gradient-primary not-italic">Migria</em>.
      </>
    ),
    description:
      'Tu cuenta sigue activa. Continúa tu proceso, revisa procesos abiertos o gestiona tu plantilla.',
    highlights: [
      { icon: ShieldCheck, label: 'Sesión segura cifrada' },
      { icon: Sparkles, label: 'Acceso a tu candidatura o procesos' },
      { icon: BadgeCheck, label: 'Documentación verificada' },
    ],
    testimonial: {
      quote:
        '"Migria me acompañó desde Lima hasta mi primera semana en Madrid. Todo el proceso fue legal y seguro."',
      name: 'Carolina M.',
      role: 'Chef de partida · Madrid',
    },
  },
  'register-candidate': {
    eyebrow: 'Para profesionales',
    title: (
      <>
        Tu próximo trabajo en España{' '}
        <em className="text-gradient-primary not-italic">empieza aquí</em>.
      </>
    ),
    description:
      'Crea tu perfil profesional y deja que las empresas españolas te encuentren. Captación, formación y trámites legales — sin coste para ti.',
    highlights: [
      { icon: ShieldCheck, label: 'Proceso legal completo y gratuito' },
      { icon: Plane, label: 'Acompañamiento hasta tu llegada a España' },
      { icon: HandHeart, label: 'Soporte humano en cada paso' },
    ],
    testimonial: {
      quote:
        '"Pasé de buscar trabajo en Caracas a estar contratado en un restaurante de Barcelona en 3 meses."',
      name: 'Andrés P.',
      role: 'Jefe de sala · Barcelona',
    },
  },
  'register-employer': {
    eyebrow: 'Para empresas españolas',
    title: (
      <>
        Talento <em className="text-gradient-primary not-italic">evaluado</em>{' '}
        y listo para tu equipo.
      </>
    ),
    description:
      'Accede a candidatos hispanoamericanos cualificados. Captación, evaluación técnica y gestión migratoria completa con garantía de retención.',
    highlights: [
      { icon: BadgeCheck, label: 'Candidatos evaluados técnicamente' },
      { icon: ShieldCheck, label: 'Proceso 100% legal y trazable' },
      { icon: Sparkles, label: 'Garantía de retención hasta 6 meses' },
    ],
    testimonial: {
      quote:
        '"Incorporamos 12 cocineros con Migria en 6 meses. Cero rotación y plantilla estable."',
      name: 'María Fernández',
      role: 'Dir. RR. HH., Grupo Hostelero',
    },
  },
  recover: {
    eyebrow: 'Recuperar acceso',
    title: (
      <>
        Vuelve a tu cuenta{' '}
        <em className="text-gradient-primary not-italic">en un minuto</em>.
      </>
    ),
    description:
      'Te enviamos un enlace seguro al correo registrado. El enlace caduca en 1 hora.',
    highlights: [
      { icon: ShieldCheck, label: 'Enlace cifrado de un solo uso' },
      { icon: Sparkles, label: 'Sin contraseñas temporales' },
      { icon: HandHeart, label: '¿Problemas? Escríbenos a soporte' },
    ],
  },
};

const COUNTRIES = ['PE', 'CO', 'VE', 'EC', 'AR', 'MX', 'BO', 'DO', 'CL'];

export function AuthBrandPanel({ variant = 'login' }: AuthBrandPanelProps) {
  const c = COPY[variant];

  return (
    <aside
      className="relative hidden overflow-hidden bg-hero-gradient lg:block"
      aria-hidden="true"
    >
      <div className="bg-dot-pattern absolute inset-0 opacity-60" />
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative flex h-full flex-col px-10 py-10 xl:px-14 xl:py-14">
        <Link href="/" aria-label="Migria — ir al inicio" className="inline-flex">
          <Logo height={48} asChild />
        </Link>

        <div className="mt-12 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {c.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight text-foreground xl:text-5xl">
            {c.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            {c.description}
          </p>

          <ul className="mt-8 space-y-3">
            {c.highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary ring-1 ring-primary/15">
                  <h.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{h.label}</span>
              </li>
            ))}
          </ul>

          {c.testimonial && (
            <figure className="mt-10 max-w-md rounded-2xl border border-border bg-surface/80 p-5 shadow-md backdrop-blur-sm">
              <Quote className="h-5 w-5 text-primary" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                {c.testimonial.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                  {c.testimonial.name
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          )}
        </div>

        {/* Country flags row at the bottom */}
        <div className="mt-10 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {variant === 'register-employer' ? (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>+87 empresas confían en Migria</span>
            </span>
          ) : (
            <>
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="mr-1">Profesionales de:</span>
              {COUNTRIES.map((code) => (
                <span key={code} title={code} className="text-base">
                  <CountryFlag code={code} size="md" />
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

/** Header reducido para móvil (cuando el panel se oculta). */
export function AuthBrandHeaderMobile({ variant = 'login' }: AuthBrandPanelProps) {
  void variant;
  return (
    <div className="flex items-center justify-between lg:hidden">
      <Link href="/" aria-label="Migria — ir al inicio">
        <Logo height={36} asChild />
      </Link>
      <Link
        href="/"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
