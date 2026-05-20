import Link from 'next/link';
import {
  ArrowRight, Briefcase, ShieldCheck, GraduationCap, Plane,
  Building2, Truck, Hammer, Wrench, ChefHat, Sparkles, Wheat,
  CheckCircle2, FileText, Users, Headphones, CreditCard, Home,
  Search, ClipboardCheck, HandshakeIcon, Plug,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Migria para empresas',
  description:
    'Captación internacional de talento hispanoamericano. Procesos legales, formación previa, acompañamiento completo y garantía de retención.',
};

const REASONS_DEMAND = [
  { icon: Briefcase, title: 'Vacantes', text: 'Más del 60% de los restaurantes afirman tener dificultades para cubrir vacantes de forma sostenida.' },
  { icon: ChefHat, title: 'Personal cualificado', text: 'Falta de personal cualificado en cocina, sala y housekeeping.' },
  { icon: Users, title: 'Abandono', text: 'Alta rotación y abandono por falta de estabilidad y planes de crecimiento.' },
  { icon: ShieldCheck, title: 'Profesionalidad', text: 'Demanda de profesionales serios, motivados y con cultura de trabajo.' },
];

const REASONS_SUPPLY = [
  { icon: GraduationCap, title: 'Jóvenes cualificados', text: 'Países como Perú, Ecuador, Colombia y Rep. Dominicana cuentan con jóvenes cualificados y con ganas de trabajar.' },
  { icon: CreditCard, title: 'Diferencia salarial', text: 'Diferencias salariales que incentivan la movilidad.' },
  { icon: Sparkles, title: 'Cultura y lengua', text: 'Afinidad cultural y lingüística con España.' },
  { icon: Home, title: 'Entornos familiares', text: 'Redes de apoyo familiar ya existentes en Europa.' },
];

const SECTORS = [
  { icon: ChefHat, name: 'Hostelería y turismo' },
  { icon: Truck, name: 'Logística y transporte' },
  { icon: Hammer, name: 'Construcción y obra civil' },
  { icon: Wrench, name: 'Mantenimiento y servicios técnicos' },
  { icon: Sparkles, name: 'Limpieza y servicios auxiliares' },
  { icon: Wheat, name: 'Agricultura y agroindustria' },
  { icon: Briefcase, name: 'Industria y producción' },
  { icon: Plug, name: 'Otros sectores demandados' },
];

const SERVICES_MAIN = [
  { icon: Search, title: 'Reclutamiento especializado', desc: 'Búsqueda activa en países de origen con equipos locales.' },
  { icon: ClipboardCheck, title: 'Validación de competencias', desc: 'Pruebas técnicas y entrevistas estructuradas previas a la presentación.' },
  { icon: HandshakeIcon, title: 'Onboarding y seguimiento', desc: 'Acompañamiento durante los primeros meses para garantizar la integración.' },
  { icon: FileText, title: 'Gestión migratoria y legal', desc: 'Tramitación completa de extranjería, visado, alta SS y contrato.' },
  { icon: Users, title: 'Procesos adaptados', desc: 'Diseño a medida según perfil, sector y volumen de contratación.' },
];

const SERVICES_EXTRA = [
  { icon: Plane, title: 'Logística y viaje', text: 'Gestión de vuelos, recepción en aeropuerto, traslado a la empresa y kit de bienvenida (incluida tarjeta SIM).' },
  { icon: Home, title: 'Integración en España', text: 'Búsqueda de alojamiento, gestión de empadronamiento y programa family host.' },
  { icon: GraduationCap, title: 'Formación y certificaciones', text: 'Certificados oficiales y cursos según puesto (APPCC, manipulador de alimentos, inglés funcional…).' },
  { icon: CreditCard, title: 'Servicios financieros', text: 'Financiación del viaje, seguro médico privado y otras gestiones administrativas.' },
];

const BENEFITS = [
  'Candidatos ya evaluados',
  'Menos rotación, más estabilidad',
  'Proceso legal y seguro',
  'Minimizar tiempos y agilizar trámites',
  'Acompañamiento completo',
  'Plantilla estable = mejor servicio al cliente',
];

const PLANS = [
  {
    name: 'Básico',
    range: '2 a 5 puestos',
    guarantee: '3 meses',
    description: 'Para empresas que dan el primer paso con incorporaciones puntuales.',
    features: [
      'Captación y validación técnica',
      'Gestión migratoria estándar',
      'Onboarding básico',
      'Garantía de retención 3 meses',
    ],
  },
  {
    name: 'Estándar',
    range: '6 a 15 puestos',
    guarantee: '4 meses',
    description: 'Para empresas con planes de crecimiento estructurados.',
    features: [
      'Todo lo de Básico',
      'Formación previa específica',
      'Gestión documental ampliada',
      'Logística y viaje incluidos',
      'Garantía de retención 4 meses',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    range: 'hasta ~30 puestos',
    guarantee: '6 meses',
    description: 'Para grandes operaciones con acompañamiento integral.',
    features: [
      'Todo lo de Estándar',
      'Equipo dedicado',
      'Family host y alojamiento',
      'Seguimiento intensivo 6 meses',
      'Garantía de retención 6 meses',
    ],
  },
];

export default function EmpresasPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Badge variant="soft" className="mb-6">
            <Building2 className="mr-1 h-3 w-3" /> Migria para empresas
          </Badge>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Tu <em className="text-gradient-primary not-italic">partner</em> de reclutamiento internacional.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Acompañamos a empresas de toda España en la captación y contratación de talento hispanoamericano,
            gestionando cada proceso de forma profesional, legal y estructurada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contacto">
                Solicitar presupuesto <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#planes">Ver niveles de servicio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Badge variant="outline" className="mb-4">¿Quiénes somos?</Badge>
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Simplificar, profesionalizar y humanizar.
        </h2>
        <div className="prose prose-zinc dark:prose-invert mt-6 max-w-none">
          <p>
            MIGRIA es una plataforma integral de captación internacional, especializada en conectar talento
            hispanoamericano con oportunidades reales de empleo en España en múltiples sectores.
          </p>
          <p>
            Trabajamos con equipos locales de selección y una estructura legal y operativa consolidada,
            garantizando contrataciones <strong>seguras, eficientes y alineadas</strong> con las necesidades
            reales de cada empresa.
          </p>
        </div>
      </section>

      {/* ¿POR QUÉ MIGRIA? - DEMANDA */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">¿Por qué Migria?</Badge>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              El problema que resolvemos.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS_DEMAND.map((r) => (
              <div key={r.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-2xl text-center">
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Por qué Latinoamérica funciona.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS_SUPPLY.map((r) => (
              <div key={r.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Sectores de operación</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Cubrimos los sectores con mayor demanda.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s) => (
            <div key={s.name} className="card-hover rounded-2xl border border-border bg-surface p-5 text-center">
              <s.icon className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-3 text-sm font-medium text-foreground">{s.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS PRINCIPALES */}
      <section className="border-y border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">Servicios principales</Badge>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Cubrimos todo el proceso.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {SERVICES_MAIN.map((s, i) => (
              <div key={s.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold text-primary">0{i + 1}</span>
                <h3 className="mt-1 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS ADICIONALES */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Servicios adicionales</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Llevamos al candidato hasta la puerta de la empresa.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SERVICES_EXTRA.map((s) => (
            <div key={s.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-warm/20 text-accent-warm">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-y border-border bg-secondary py-20 text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-accent-warm text-secondary">Beneficios</Badge>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Lo que tu empresa gana.
            </h2>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl bg-secondary-foreground/5 p-4 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-warm" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Niveles de servicio</Badge>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Tres niveles, una garantía clara.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Si el candidato no completa el periodo de garantía por causas justificadas,{' '}
            <strong className="text-foreground">reposición gratuita</strong> o descuento proporcional.
          </p>
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
                  <Badge className="bg-accent-warm text-secondary border-0 shadow-lg">Más solicitado</Badge>
                </div>
              )}
              <h3 className={`text-xl font-semibold ${p.highlight ? 'text-white' : 'text-foreground'}`}>
                {p.name}
              </h3>
              <p className={`mt-1 text-sm ${p.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                {p.description}
              </p>
              <div className="mt-6 space-y-1">
                <p className={`font-display text-2xl ${p.highlight ? 'text-white' : 'text-foreground'}`}>
                  {p.range}
                </p>
                <p className={`text-sm ${p.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                  Garantía de retención: <strong>{p.guarantee}</strong>
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.highlight ? 'text-white' : 'text-success'}`} />
                    <span className={p.highlight ? 'text-white' : 'text-foreground'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 ${p.highlight ? 'bg-white text-primary hover:bg-white/90' : ''}`}
                variant={p.highlight ? 'default' : 'outline'}
              >
                <Link href="/contacto">Solicitar presupuesto</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <Headphones className="mx-auto h-10 w-10" />
          <h2 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
            Hablemos de tu próxima incorporación.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Cuéntanos cuántos puestos necesitas, en qué sector y para cuándo. Te respondemos en menos de
            48 horas con una propuesta a medida.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90">
            <Link href="/contacto">
              Solicitar presupuesto <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
