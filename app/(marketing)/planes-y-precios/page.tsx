import Link from 'next/link';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Planes y precios',
  description: 'Sin permanencia. 14 días gratis del plan Pro. Cancela cuando quieras.',
};

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    cadence: 'gratis siempre',
    description: 'Para validar la plataforma y probar tu primera contratación.',
    cta: 'Crear cuenta gratis',
    href: '/registro?role=employer',
    highlight: false,
    features: [
      'Hasta 10 búsquedas/mes',
      '5 perfiles guardados',
      '2 procesos activos',
      'Mensajería básica',
      'Filtros básicos',
    ],
  },
  {
    name: 'Pro',
    price: 99,
    cadence: '€/mes por empresa',
    description: 'Para equipos de RRHH que contratan continuamente.',
    cta: '14 días gratis',
    href: '/registro?role=employer&plan=pro',
    highlight: true,
    features: [
      'Búsquedas y mensajes ilimitados',
      'Pipeline kanban con etapas custom',
      'Notas y etiquetas privadas',
      'Comparador de candidatos',
      'Equipo: hasta 5 reclutadores',
      'Filtros premium (NIE, homologación, MCER)',
      'Búsquedas guardadas con alertas',
      'Exportar listados a CSV',
      'Plantillas de mensaje',
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    cadence: 'a medida',
    description: 'Para empresas con grandes volúmenes y compliance.',
    cta: 'Hablar con ventas',
    href: '/contacto',
    highlight: false,
    features: [
      'Todo lo de Pro',
      'SSO (SAML, Okta, Azure AD)',
      'Reclutadores ilimitados',
      'API y webhooks',
      'SLA 99.9% y soporte dedicado',
      'DPA y RGPD a medida',
      'Onboarding asistido',
    ],
  },
];

const FAQ = [
  {
    q: '¿Hay permanencia o contrato anual?',
    a: 'No. El plan Pro es mensual y puedes cancelarlo en cualquier momento desde tu panel. Si quieres anual con descuento, contáctanos.',
  },
  {
    q: '¿Qué incluye la prueba gratuita de Pro?',
    a: '14 días con todas las funcionalidades Pro desbloqueadas. Sin tarjeta. Si no actualizas al acabar, tu cuenta vuelve automáticamente al plan Starter.',
  },
  {
    q: '¿Cuántos candidatos puedo contactar al mes?',
    a: 'Ilimitados con Pro. En Starter, 5 contactos al mes. La mensajería incluye plantillas, programación de envío y notificaciones in-app.',
  },
  {
    q: '¿Puedo invitar a más reclutadores a mi equipo?',
    a: 'Sí. Pro incluye hasta 5 personas en tu equipo, todas con acceso al mismo pipeline y candidatos guardados. Enterprise es ilimitado.',
  },
  {
    q: '¿Cómo se factura?',
    a: 'Cargamos el día que activas Pro. Renovación mensual automática. Recibes factura PDF en tu email y el panel de Facturación.',
  },
];

export default function PlanesPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Badge variant="soft" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" /> Precios transparentes
          </Badge>
          <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
            Planes que <em className="text-gradient-primary not-italic">escalan</em> contigo.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sin permanencia. Cancela cuando quieras. <strong className="text-foreground">14 días gratis</strong> del plan Pro.
          </p>
        </div>
      </section>

      {/* PLANES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'card-hover relative flex flex-col rounded-2xl border p-8',
                plan.highlight
                  ? 'border-primary bg-gradient-to-br from-primary to-accent text-white shadow-2xl scale-[1.02] z-10'
                  : 'border-border bg-surface'
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent-warm text-secondary border-0 shadow-lg">
                    <Zap className="mr-1 h-3 w-3" /> Más popular
                  </Badge>
                </div>
              )}

              <h3 className={cn('text-xl font-semibold', plan.highlight ? 'text-white' : 'text-foreground')}>
                {plan.name}
              </h3>
              <p className={cn('mt-1 text-sm', plan.highlight ? 'text-white/80' : 'text-muted-foreground')}>
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                {plan.price !== null ? (
                  <>
                    <span className={cn('font-display text-6xl', plan.highlight ? 'text-white' : 'text-foreground')}>
                      {plan.price}
                    </span>
                    <span className={cn('text-sm', plan.highlight ? 'text-white/80' : 'text-muted-foreground')}>
                      {plan.cadence}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-4xl text-foreground">A medida</span>
                )}
              </div>

              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        plan.highlight ? 'text-white' : 'text-success'
                      )}
                    />
                    <span className={plan.highlight ? 'text-white' : 'text-foreground'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  'mt-8',
                  plan.highlight && 'bg-white text-primary hover:bg-white/90'
                )}
                variant={plan.highlight ? 'default' : 'outline'}
                size="lg"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Garantía */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          🛡️ <strong className="text-foreground">Garantía de 30 días:</strong> si no contactas a ningún
          candidato adecuado, te devolvemos el dinero del primer mes.
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl text-center text-foreground sm:text-5xl">
          Preguntas frecuentes
        </h2>
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
    </div>
  );
}
