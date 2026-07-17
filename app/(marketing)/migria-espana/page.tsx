import Link from 'next/link';
import {
  ArrowRight, Building2, Target, Eye, Heart, Truck, ChefHat,
  Factory, Wrench, Store, CheckCircle2, Headphones, ShieldCheck,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Migria España',
  description:
    'MIGRIA España, consultora especializada en reclutamiento y selección de talento estratégico para sectores clave de la economía española. Partner colaborador de las empresas.',
};

const VALUES = [
  'Compromiso con el cliente.',
  'Selección basada en calidad.',
  'Agilidad en los procesos.',
  'Transparencia.',
  'Orientación a resultados.',
];

const SECTORS = [
  {
    icon: Store,
    name: 'Distribución',
    roles: ['Retail', 'Logística de distribución'],
  },
  {
    icon: ChefHat,
    name: 'Hostelería',
    roles: ['Cocina', 'Sala', 'Gestión hostelera'],
  },
  {
    icon: Factory,
    name: 'Industria',
    roles: ['Operarios', 'Técnicos de mantenimiento', 'Producción'],
  },
  {
    icon: Wrench,
    name: 'Servicios',
    roles: ['Personal técnico', 'Perfiles operativos'],
  },
  {
    icon: Truck,
    name: 'Logística y transporte',
    roles: ['Conductores', 'Operarios de almacén', 'Responsables logísticos'],
  },
];

const PROCESS = [
  {
    title: 'Análisis del perfil',
    items: ['Reunión con la empresa cliente.', 'Definición técnica y cultural del puesto.'],
  },
  {
    title: 'Estrategia de búsqueda',
    items: ['Reclutamiento activo.', 'Bases de datos.', 'Redes profesionales.', 'Búsqueda sectorial.'],
  },
  {
    title: 'Preselección',
    items: ['Filtrado de candidatos.', 'Entrevistas iniciales.', 'Evaluación de encaje.'],
  },
  {
    title: 'Short list de candidatos',
    items: ['Presentación de candidatos preseleccionados con alto encaje profesional y cultural.'],
  },
  {
    title: 'Acompañamiento en el proceso final',
    items: ['Coordinación de entrevistas.', 'Seguimiento del proceso.', 'Apoyo en la decisión final y posible asesoramiento laboral.'],
  },
  {
    title: 'Beneficios para la empresa',
    items: ['Reducir tiempos de selección.', 'Acceder a talento cualificado y evaluado.', 'Liberar tiempo del equipo de RRHH.', 'Optimizar la contratación e impulsar el crecimiento.'],
  },
];

const WHY_MIGRIA = [
  'Conocimiento de sectores operativos.',
  'Procesos ágiles.',
  'Reclutamiento personalizado.',
  'Orientación a resultados.',
  'Trabajo alineado con la marca del cliente.',
];

const PLANS = [
  {
    name: 'Success Fee',
    subtitle: 'Reclutamiento por proceso',
    price: 'Consultar',
    priceNote: 'Honorario calculado sobre el salario bruto anual del candidato contratado.',
    description: 'El modelo más habitual para empresas con necesidades puntuales de contratación. El honorario se aplica solo en caso de contratación: trabajo a éxito.',
    features: [
      'Definición del perfil.',
      'Estrategia de búsqueda.',
      'Publicación de ofertas.',
      'Reclutamiento activo.',
      'Entrevistas de preselección.',
      'Presentación de short list.',
    ],
    payment: '100% tras la contratación del candidato.',
  },
  {
    name: 'Flat Fee',
    subtitle: 'Reclutamiento por tarifa fija',
    price: 'Tarifa fija',
    priceNote: 'por proceso de selección cerrado.',
    description: 'Permite conocer previamente el coste del proceso, independientemente del salario del candidato. Especialmente interesante para perfiles operativos o repetitivos.',
    features: [
      'Operarios.',
      'Camareros / Cocineros.',
      'Mozos de almacén.',
      'Conductores.',
      'Personal logístico.',
    ],
    payment: '50% al inicio del proceso · 50% tras la contratación.',
    highlight: true,
  },
  {
    name: 'Modelo Partner',
    subtitle: 'Reclutamiento recurrente',
    price: 'Consultar',
    priceNote: 'Cuota mensual según volumen, más honorario por candidato contratado.',
    description: 'Diseñado para empresas que necesitan contratar de forma continua. MIGRIA actúa como partner externo de reclutamiento.',
    features: [
      'Gestión continua de procesos.',
      'Reclutamiento activo.',
      'Entrevistas de preselección.',
      'Base de candidatos.',
      'Soporte en selección.',
    ],
    payment: 'Facturación mensual.',
  },
];

const DEADLINES = [
  { label: 'Perfiles operativos', value: '5 – 10 días' },
  { label: 'Perfiles técnicos', value: '10 – 15 días' },
  { label: 'Perfiles especializados', value: '15 – 25 días' },
];

export default function MigriaEspanaPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Badge variant="soft" className="mb-6">
            <Building2 className="mr-1 h-3 w-3" /> Migria España
          </Badge>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Partner estratégico en <em className="text-gradient-primary not-italic">reclutamiento</em> especializado.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Talento que viaja, empresas que crecen, comunidades que prosperan. Conectamos empresas con el
            talento que impulsa su crecimiento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contacto">
                Solicitar información <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#modelos">Ver modelos de colaboración</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Badge variant="outline" className="mb-4">¿Quiénes somos?</Badge>
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Consultora especializada en reclutamiento de talento estratégico.
        </h2>
        <div className="prose prose-zinc dark:prose-invert mt-6 max-w-none">
          <p>
            MIGRIA España es una consultora especializada en <strong>reclutamiento y selección de talento</strong>{' '}
            para sectores clave de la economía española.
          </p>
          <p>
            Trabajamos como <strong>partner colaborador de las empresas</strong>, integrándonos en sus procesos
            de selección para identificar, evaluar y presentar candidatos que encajen tanto en el perfil
            profesional requerido como en la cultura de la organización.
          </p>
          <p>
            Nuestro enfoque se basa en un <strong>reclutamiento personalizado</strong>, orientado a optimizar los
            tiempos de selección y garantizar la incorporación de profesionales cualificados que impulsen el
            crecimiento de nuestros clientes.
          </p>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / VALORES */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card-hover rounded-2xl border border-border bg-surface p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">Misión</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ayudar a las empresas a encontrar el talento adecuado de forma rápida, eficiente y alineada
                con su cultura corporativa.
              </p>
            </div>
            <div className="card-hover rounded-2xl border border-border bg-surface p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft text-success">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">Visión</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Convertirnos en un partner de referencia en España en reclutamiento especializado para
                sectores operativos y productivos.
              </p>
            </div>
            <div className="card-hover rounded-2xl border border-border bg-surface p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-warm/20 text-accent-warm">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">Valores</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {VALUES.map((v) => (
                  <li key={v} className="flex gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Sectores en los que operamos</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Especialistas en sectores operativos y productivos.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <div key={s.name} className="card-hover rounded-2xl border border-border bg-surface p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{s.name}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {s.roles.map((r) => (
                  <li key={r} className="flex gap-2 text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* MODELO DE TRABAJO */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4">Nuestro modelo de trabajo</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Reclutamiento integrado en la marca del cliente.
          </h2>
          <div className="prose prose-zinc dark:prose-invert mx-auto mt-6 max-w-none">
            <p>
              En MIGRIA trabajamos <strong>desde dentro del proyecto del cliente</strong>, alineando el proceso
              de selección con su identidad corporativa, valores y necesidades reales. Cada proceso refuerza la
              imagen de marca empleadora de la empresa.
            </p>
            <p>
              Nuestro objetivo es que el candidato perciba el proceso como una <strong>experiencia directa con
              la empresa</strong>, manteniendo su esencia y cultura.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESO DE RECLUTAMIENTO */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Nuestro proceso</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Un proceso claro, de principio a fin.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((step, i) => (
            <div key={step.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-2 text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROPUESTA DE VALOR / POR QUÉ ELEGIR MIGRIA */}
      <section className="border-y border-border bg-secondary py-20 text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-accent-warm text-secondary">Nuestra propuesta de valor</Badge>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Por qué elegir MIGRIA.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-secondary-foreground/80">
              Minimizar tiempos, optimizar resultados e impulsar el crecimiento empresarial con el mejor
              talento para cada puesto.
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_MIGRIA.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-secondary-foreground/5 p-4 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-warm" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPUESTA ECONÓMICA / MODELOS */}
      <section id="modelos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Propuesta económica</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Modelos de colaboración flexibles y personalizados.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                p.highlight
                  ? 'border-primary bg-gradient-to-br from-primary to-accent text-white shadow-2xl scale-[1.02] z-10'
                  : 'border-border bg-surface'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent-warm text-secondary border-0 shadow-lg">Más habitual</Badge>
                </div>
              )}
              <p className={`text-xs font-semibold uppercase tracking-wide ${p.highlight ? 'text-white/70' : 'text-primary'}`}>
                {p.subtitle}
              </p>
              <h3 className={`mt-1 text-xl font-semibold ${p.highlight ? 'text-white' : 'text-foreground'}`}>
                {p.name}
              </h3>
              <div className="mt-6 space-y-1">
                <p className={`font-display text-2xl ${p.highlight ? 'text-white' : 'text-foreground'}`}>
                  {p.price}
                </p>
                <p className={`text-sm ${p.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {p.priceNote}
                </p>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${p.highlight ? 'text-white/90' : 'text-muted-foreground'}`}>
                {p.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.highlight ? 'text-white' : 'text-success'}`} />
                    <span className={p.highlight ? 'text-white' : 'text-foreground'}>{f}</span>
                  </li>
                ))}
              </ul>
              <div className={`mt-6 rounded-xl p-3 text-xs ${p.highlight ? 'bg-white/10 text-white/90' : 'bg-surface-muted/60 text-muted-foreground'}`}>
                <span className="font-semibold">Forma de pago:</span> {p.payment}
              </div>
              <Button
                asChild
                className={`mt-6 ${p.highlight ? 'bg-white text-primary hover:bg-white/90' : ''}`}
                variant={p.highlight ? 'default' : 'outline'}
              >
                <Link href="/contacto">Solicitar información</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* GARANTÍA Y PLAZOS */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Garantía */}
            <div className="rounded-3xl border border-border bg-surface p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft text-success">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">Garantía de reposición</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Facilitamos la reposición ante bajas o desajustes, sin coste adicional. En caso de baja
                voluntaria o incompatibilidad dentro del periodo, reiniciamos el proceso sin coste.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Hasta 60 días para perfiles operativos.
                </li>
                <li className="flex gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Hasta 90 días para perfiles técnicos o especializados.
                </li>
              </ul>
            </div>
            {/* Plazos */}
            <div className="rounded-3xl border border-border bg-surface p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">Plazos medios de presentación</h3>
              <div className="mt-5 space-y-3">
                {DEADLINES.map((d) => (
                  <div key={d.label} className="flex items-center justify-between rounded-xl bg-surface-muted/60 px-4 py-3">
                    <span className="text-sm text-foreground">{d.label}</span>
                    <span className="text-sm font-semibold text-primary">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <Headphones className="mx-auto h-10 w-10" />
          <h2 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
            Hablemos de tu próxima incorporación.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Cuéntanos qué perfiles necesitas, en qué sector y para cuándo. Diseñamos una propuesta de
            reclutamiento a medida para tu empresa.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90">
            <Link href="/contacto">
              Solicitar información <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
