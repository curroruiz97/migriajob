import Link from 'next/link';
import {
  ArrowRight, Users, Heart, Plane, Home, GraduationCap, ShieldCheck,
  Briefcase, MapPin, FileText, CreditCard, Globe2, TrendingUp, Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Migria para empleados',
  description:
    'MIGRIA para empleados conecta tu talento con oportunidades reales en España, acompañándote en todo el proceso.',
};

const REASONS_SPAIN = [
  { icon: Award, title: 'Respeto por el trabajo bien hecho', text: 'Una cultura que valora la profesionalidad y la experiencia.' },
  { icon: TrendingUp, title: 'Oportunidades de crecimiento', text: 'Sectores en expansión y empresas con vocación de continuidad.' },
  { icon: CreditCard, title: 'Salarios competitivos', text: 'Contratos legales, salario mínimo regulado y pagos puntuales.' },
  { icon: GraduationCap, title: 'Formación continua', text: 'Acceso a preparación específica según tu oficio.' },
  { icon: ShieldCheck, title: 'Calidad de vida', text: 'Ciudades seguras, salud pública y estabilidad laboral.' },
  { icon: Heart, title: 'Comunidad latina', text: 'Una sociedad que valora el talento hispanoamericano.' },
];

const BENEFITS = [
  {
    icon: Heart,
    title: 'Mejora de la calidad de vida',
    text: 'Vivir en España ofrece a los trabajadores latinos una mejor calidad de vida gracias a empleos regulados, acceso a salud pública de calidad, seguridad ciudadana y un entorno que favorece el bienestar físico y emocional.',
  },
  {
    icon: Briefcase,
    title: 'Un mundo de posibilidades',
    text: 'España demanda activamente talento latino, valorando su experiencia en sectores clave: hostelería, turismo, logística, construcción, transporte, salud, cuidado de mayores y agricultura.',
  },
  {
    icon: ShieldCheck,
    title: 'Protección laboral',
    text: 'Marco legal sólido que garantiza seguridad financiera y social: salario mínimo, contratos formales, salud pública, cotización para jubilación y derechos laborales protegidos.',
  },
  {
    icon: Users,
    title: 'Integración sencilla',
    text: 'La integración es rápida y fluida gracias a la afinidad cultural y lingüística, el apoyo de comunidades locales y la buena valoración del talento latino.',
  },
  {
    icon: TrendingUp,
    title: 'Proyección de futuro',
    text: 'Plataforma ideal para el crecimiento profesional: experiencia europea, formación continua, perfil internacional, facilidades para residencia y reagrupación familiar.',
  },
];

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Tu primera entrevista',
    desc: 'Validamos tu experiencia y motivación. Sin coste.',
  },
  {
    n: '02',
    title: 'Formación previa',
    desc: 'Te preparamos con cursos específicos según el puesto, cultura laboral española y certificaciones necesarias.',
  },
  {
    n: '03',
    title: 'Trámites legales',
    desc: 'Gestionamos tu expediente de extranjería, visado en la Embajada de España y alta en Seguridad Social.',
  },
  {
    n: '04',
    title: 'Viaje y aterrizaje',
    desc: 'Vuelos, recepción en aeropuerto, traslado a tu empresa y kit de bienvenida (incluida tarjeta SIM).',
  },
  {
    n: '05',
    title: 'Integración y seguimiento',
    desc: 'Búsqueda de alojamiento, empadronamiento, family host y acompañamiento durante tus primeros meses.',
  },
];

export default function EmpleadosPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Badge variant="soft" className="mb-6">
            <Plane className="mr-1 h-3 w-3" /> Migria para empleados
          </Badge>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            El <em className="text-gradient-primary not-italic">sueño</em> Migria.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            España es un país con una <strong className="text-foreground">economía diversa y una fuerte
            cultura del trabajo</strong>. Tu oficio tiene recorrido, tu esfuerzo tiene reconocimiento y
            tu futuro tiene valor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/empleos">
                Ver ofertas <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/registro?role=candidate">Crear mi perfil</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="lead text-xl">
            Un entorno en el que la experiencia, el compromiso y la profesionalidad permiten
            crecer, asumir responsabilidades y <strong>construir una trayectoria laboral estable</strong>.
          </p>
          <p>
            MIGRIA no solo te abre una puerta: <strong>acompaña, forma y apoya</strong> a las personas en la
            construcción de una nueva vida en un país estable, seguro y con oportunidades reales en
            distintos sectores de actividad.
          </p>
        </div>
      </section>

      {/* ¿POR QUÉ ESPAÑA? */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">¿Por qué España?</Badge>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Un país donde tu oficio tiene recorrido.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS_SPAIN.map((r) => (
              <div key={r.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS PROFUNDOS */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">Tu proceso</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Cinco beneficios que cambian una vida.
          </h2>
        </div>
        <div className="mt-12 space-y-5">
          {BENEFITS.map((b, idx) => (
            <div
              key={b.title}
              className="card-hover grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-[80px_1fr] sm:p-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                <b.icon className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Beneficio {idx + 1}
                </span>
                <h3 className="mt-1 font-display text-2xl text-foreground">{b.title}</h3>
                <p className="mt-2 text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEGURIDAD ECONÓMICA */}
      <section className="border-y border-border bg-secondary py-20 text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-accent-warm text-secondary">Seguridad económica</Badge>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Estabilidad financiera para ti y tu familia.
          </h2>
          <p className="mt-4 max-w-3xl opacity-80">
            España ofrece una mayor seguridad económica y previsibilidad financiera, no solo durante la
            etapa activa de empleo, sino también ante situaciones de desempleo o transición laboral.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary-foreground/5 p-6 backdrop-blur-sm">
              <h3 className="font-semibold">Indemnización por despido</h3>
              <p className="mt-2 text-sm opacity-80">
                En caso de despido, el trabajador cuenta con coberturas legales: indemnización según
                contrato y causa, y acceso a la prestación por desempleo (paro) si se han cotizado los
                periodos mínimos.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary-foreground/5 p-6 backdrop-blur-sm">
              <h3 className="font-semibold">Subsidio por desempleo</h3>
              <p className="mt-2 text-sm opacity-80">
                Red de subsidios por desempleo para quienes no cumplen los requisitos de la prestación
                contributiva o la han agotado. Más ayudas extraordinarias y rentas mínimas autonómicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">El acompañamiento Migria</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            No viajas solo.
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            MIGRIA te guía desde la primera entrevista hasta tu integración en España. Llegas, te
            adaptas, creces y te sientes orgulloso de tu trayectoria.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {PROCESS_STEPS.map((s) => (
            <div
              key={s.n}
              className="grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-[100px_1fr] sm:p-7"
            >
              <span className="font-display text-5xl text-primary/30 sm:text-6xl">{s.n}</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GASTOS Y TARIFA */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Costes y gestión</Badge>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Transparencia total en costes.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <Plane className="h-8 w-8 text-primary" />
              <h3 className="font-display mt-4 text-2xl text-foreground">Gastos de transporte</h3>
              <p className="mt-3 text-muted-foreground">
                Operamos con un proceso flexible y adaptable a cada caso para asumir los gastos de
                transporte y estancia durante el proceso de contratación.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                En la mayoría de casos, este proceso constituirá un acuerdo entre el contratante y el
                trabajador.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-8">
              <FileText className="h-8 w-8 text-primary" />
              <h3 className="font-display mt-4 text-2xl text-foreground">Tarifa</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                La tarifa por candidato corresponde a los costes de tramitación legal del expediente ante
                las autoridades competentes de extranjería en España. Incluye:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                <li>• Gestión y resolución del expediente administrativo de extranjería</li>
                <li>• Obtención del visado en la Embajada de España</li>
                <li>• Tramitación del alta en Seguridad Social</li>
                <li>• Formalización del contrato de trabajo conforme a la ley española</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <Globe2 className="mx-auto h-10 w-10" />
          <h2 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
            Trabajar en España es un paso firme hacia un futuro más estable y prometedor.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            MIGRIA es más que movilidad laboral: es un puente entre tu talento y tu futuro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/empleos">
                Ver ofertas disponibles <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link href="/contacto">Más información</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
