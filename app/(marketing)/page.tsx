import Link from 'next/link';
import {
  ArrowRight, Search, Briefcase, ShieldCheck, Users, Building2, Heart, Zap,
  Plane, Award, HandHeart, Sparkles, ChefHat, Wrench, Truck, Hammer, Wheat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileCard, ProfileCardPlaceholder } from '@/components/public/profile-card';
import { HeroFloatingCards } from '@/components/public/hero-floating-cards';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { CountryFlag } from '@/components/ui/country-flag';
import { getFeaturedProfiles } from '@/lib/db/queries';

export const revalidate = 300;

const SECTORS = [
  { icon: ChefHat, name: 'Hostelería y turismo' },
  { icon: Truck, name: 'Logística y transporte' },
  { icon: Hammer, name: 'Construcción' },
  { icon: Wrench, name: 'Mantenimiento técnico' },
  { icon: Sparkles, name: 'Limpieza y servicios' },
  { icon: Wheat, name: 'Agricultura y agroindustria' },
];

const VALUES = [
  { icon: Heart, title: 'Humanidad', sub: 'Cada historia cuenta.' },
  { icon: HandHeart, title: 'Compromiso', sub: 'Acompañamos en cada proceso.' },
  { icon: ShieldCheck, title: 'Legalidad y claridad', sub: 'Transparencia absoluta.' },
  { icon: Award, title: 'Crecimiento', sub: 'Oportunidades reales.' },
  { icon: Sparkles, title: 'Confianza', sub: 'Relaciones duraderas.' },
];

const FAQ = [
  {
    q: '¿Qué es MIGRIA y cuál es su objetivo?',
    a: 'MIGRIA es una marca especializada en la captación, formación y movilidad de profesionales hispanoamericanos hacia oportunidades laborales reales en España, con foco inicial en hostelería (cocina y sala) y expansión a logística, construcción, mantenimiento, limpieza, agricultura y otros sectores. Su objetivo es dar una respuesta ética, legal y profesional a la escasez de personal cualificado, creando relaciones estables entre talento y empresas.',
  },
  {
    q: '¿Qué perfiles profesionales selecciona MIGRIA?',
    a: 'Trabajamos con perfiles de hostelería (cocineros, chefs de partida, ayudantes de cocina, jefes de sala, camareros especializados, baristas, sommeliers) y de otros sectores demandados en España: operarios de producción, técnicos de mantenimiento, pescaderos senior, recruiters, supervisores de turno, etc. Todos los candidatos pasan por evaluación técnica y de experiencia antes de presentarse a las empresas.',
  },
  {
    q: '¿Cómo funciona el proceso para las empresas?',
    a: 'MIGRIA opera con un modelo por proceso cerrado, adaptado al tamaño y necesidades de cada cliente. El servicio incluye captación internacional, evaluación técnica, coordinación documental completa, formación previa (cultura laboral española, certificaciones, inglés funcional cuando aplica) y acompañamiento y seguimiento de la integración del profesional en el negocio.',
  },
  {
    q: '¿Qué apoyo recibe el profesional que viaja a España?',
    a: 'La persona no viaja sola: MIGRIA la acompaña desde la primera entrevista hasta su integración en España. Esto incluye formación previa, gestión de trámites legales y de extranjería, acompañamiento emocional, recepción en aeropuerto y seguimiento durante los primeros meses de trabajo.',
  },
  {
    q: '¿Qué niveles de servicio y política de retención ofrecéis a las empresas?',
    a: 'Ofrecemos tres niveles: Básico, Estándar y Premium, con distintas intensidades de acompañamiento y volumen (desde 2 hasta unos 30 puestos). Garantía de retención: 3 meses en Básico, 4 en Estándar y 6 en Premium. Si el candidato no completa el periodo de garantía por causas justificadas, MIGRIA ofrece reposición gratuita o un descuento proporcional en el siguiente proceso.',
  },
];

const COUNTRIES = ['PE', 'CO', 'VE', 'EC', 'AR', 'MX', 'BO', 'DO', 'CL'];

export default async function HomePage() {
  const featured = await getFeaturedProfiles().catch(() => []);

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_540px]">
            <div>
              <Badge variant="soft" className="mb-6">
                <Zap className="mr-1 h-3 w-3" />
                Talento hispanoamericano · Empleos en España
              </Badge>
              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Talento que <em className="text-gradient-primary not-italic">viaja</em>,
                <br />
                empresas que <em className="text-gradient-primary not-italic">crecen</em>.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                MIGRIA conecta el talento hispanoamericano con oportunidades reales en España.
                <strong className="text-foreground"> Captamos, formamos y acompañamos</strong> a profesionales
                y empresas en cada paso del proceso.
              </p>

              <form
                action="/empleos"
                className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-1.5 shadow-md"
              >
                <div className="flex flex-1 items-center gap-2 px-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Cocinero, camarero, operario, técnico…"
                    className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" size="sm" className="rounded-full px-5">
                  Buscar empleo
                </Button>
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/empresas">
                    <Building2 className="mr-1.5 h-3.5 w-3.5" />
                    Soy empresa, busco talento
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link href="/empleados">
                    <Users className="mr-1.5 h-3.5 w-3.5" />
                    Soy candidato, busco trabajo
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Profesionales de:</span>
                {COUNTRIES.map((c) => (
                  <span key={c} className="text-lg" title={c}>
                    <CountryFlag code={c} size="md" />
                  </span>
                ))}
              </div>
            </div>

            <HeroFloatingCards />
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="border-y border-border bg-secondary py-12 text-secondary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-display text-2xl leading-tight italic sm:text-3xl">
            "Talento que viaja, empresas que crecen, comunidades que prosperan."
          </p>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            { value: 1247, label: 'Profesionales', suffix: '+' },
            { value: 87, label: 'Restaurantes y empresas', suffix: '' },
            { value: 156, label: 'Procesos de selección', suffix: '' },
            { value: 9, label: 'Países de origen', suffix: '' },
          ].map((kpi) => (
            <div key={kpi.label} className="px-4 py-8 text-center sm:py-10">
              <div className="font-display text-4xl text-foreground sm:text-5xl">
                <AnimatedCounter value={kpi.value} />
                {kpi.suffix}
              </div>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* QUIÉNES SOMOS — layout editorial */}
      <section className="relative overflow-hidden border-y border-border bg-secondary py-24 text-secondary-foreground sm:py-32">
        {/* Patrón decorativo */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading editorial dominante */}
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Badge className="mb-6 bg-secondary-foreground/10 text-secondary-foreground border-0">
                Sobre nosotros
              </Badge>
              <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                El talento <em className="text-gradient-primary not-italic">no tiene</em> fronteras.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed opacity-80">
                MIGRIA es una marca integral de captación internacional. Simplificamos, profesionalizamos y
                humanizamos toda la movilidad laboral, acompañando a empresas y candidatos en cada paso.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-accent-warm text-secondary hover:bg-accent-warm/90">
                  <Link href="/empresas">
                    Para empresas <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10">
                  <Link href="/empleados">Para empleados</Link>
                </Button>
              </div>
            </div>

            {/* Pilares numerados grandes */}
            <div className="lg:col-span-7">
              <ul className="space-y-px overflow-hidden rounded-3xl border border-secondary-foreground/15 bg-secondary-foreground/[0.02] backdrop-blur-sm">
                {[
                  {
                    n: '01',
                    label: 'Misión',
                    title: 'Conectar talento con oportunidades reales.',
                    text: 'Unimos profesionales latinoamericanos con empresas españolas que apuestan por la estabilidad, la profesionalidad y la diversidad.',
                  },
                  {
                    n: '02',
                    label: 'Visión',
                    title: 'Ser referencia iberoamericana en movilidad ética.',
                    text: 'Convertirnos en la marca de referencia en movilidad laboral ética y responsable entre Latinoamérica y España.',
                  },
                  {
                    n: '03',
                    label: 'Valores',
                    title: 'Legalidad, compromiso, crecimiento, confianza.',
                    text: 'Cuatro principios no negociables que guían cada proceso, cada relación y cada decisión que tomamos.',
                  },
                  {
                    n: '04',
                    label: 'Modelo',
                    title: 'Servicio completo, adaptado a cada cliente.',
                    text: 'Tres niveles (Básico, Estándar, Premium) con garantía de retención de hasta 6 meses y reposición gratuita.',
                  },
                ].map((p) => (
                  <li
                    key={p.n}
                    className="group relative grid gap-5 border-b border-secondary-foreground/10 px-6 py-7 transition-colors last:border-b-0 hover:bg-secondary-foreground/[0.04] sm:grid-cols-[80px_1fr] sm:px-8"
                  >
                    <span className="font-display text-5xl leading-none text-primary/60 transition-colors group-hover:text-accent-warm sm:text-6xl">
                      {p.n}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground/60">
                        {p.label}
                      </p>
                      <h3 className="font-display mt-2 text-2xl leading-snug text-secondary-foreground sm:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/70">
                        {p.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">Sectores de operación</Badge>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Talento para múltiples sectores.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Foco inicial en hostelería, con expansión activa a otros sectores con alta demanda en España.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s) => (
              <div key={s.name} className="card-hover flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">{s.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROFILES */}
      <section className="border-b border-border bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Badge variant="outline" className="mb-3">Talento destacado</Badge>
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Profesionales <em className="text-gradient-primary not-italic">listos</em> para España.
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Candidatos evaluados técnicamente y con experiencia validada antes de presentarse a empresas.
              </p>
            </div>
            <Link
              href="/perfiles"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
            >
              Ver todos los perfiles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <ProfileCardPlaceholder key={i} />)
              : featured.slice(0, 6).map((p) => <ProfileCard key={p.id} profile={p} />)}
          </div>
        </div>
      </section>

      {/* CULTURA MIGRIA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">Cultura Migria</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Cinco valores que <em className="text-gradient-primary not-italic">no negociamos</em>.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="card-hover rounded-2xl border border-border bg-surface p-6 text-center"
            >
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA EMPRESAS */}
      <section className="border-y border-border bg-secondary py-20 text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge className="mb-4 bg-accent-warm text-secondary">
                <Plane className="mr-1 h-3 w-3" /> Tu partner de reclutamiento
              </Badge>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Da el salto con MIGRIA.
              </h2>
              <p className="mt-4 max-w-xl opacity-80">
                Acompañamos a empresas de toda España en la captación y contratación de talento, gestionando
                cada proceso de forma profesional, legal y estructurada. Equipos locales en Latinoamérica,
                estructura legal y operativa consolidada.
              </p>
              <Button asChild size="lg" className="mt-6 bg-accent-warm text-secondary hover:bg-accent-warm/90">
                <Link href="/empresas">
                  Solicitar presupuesto <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                'Candidatos ya evaluados',
                'Menos rotación, más estabilidad',
                'Proceso legal y seguro',
                'Agilizamos trámites',
                'Acompañamiento completo',
                'Plantilla estable',
              ].map((b) => (
                <div key={b} className="rounded-xl bg-secondary-foreground/5 p-4 backdrop-blur-sm">
                  <p className="text-sm">✓ {b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">Preguntas frecuentes</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Aquí podrás resolver tus dudas.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Si tu duda no aparece,{' '}
            <Link href="/contacto" className="text-primary underline-offset-2 hover:underline">
              contáctanos
            </Link>.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
          {FAQ.map((item) => (
            <details key={item.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium text-foreground">
                {item.q}
                <span className="ml-4 text-2xl text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA dual */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-white">
            <Building2 className="h-10 w-10" />
            <h3 className="font-display mt-6 text-3xl leading-tight">
              ¿Tu empresa necesita talento?
            </h3>
            <p className="mt-3 text-primary-foreground/90">
              Solicita presupuesto. Tres niveles de servicio (Básico / Estándar / Premium) con garantía de
              retención de hasta 6 meses.
            </p>
            <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
              <Link href="/empresas">
                Ver servicios para empresas <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-surface p-10">
            <Users className="h-10 w-10 text-foreground" />
            <h3 className="font-display mt-6 text-3xl leading-tight text-foreground">
              ¿Buscas trabajar en España?
            </h3>
            <p className="mt-3 text-muted-foreground">
              Te acompañamos en todo el proceso: formación, trámites legales, viaje, alojamiento y
              seguimiento durante tus primeros meses.
            </p>
            <Button asChild size="lg" variant="outline" className="mt-6">
              <Link href="/empleados">
                Ver el sueño Migria <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
