import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Building2, Users, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContactoForm } from './contacto-form';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Contacto',
  description: 'Solicita presupuesto o resuelve dudas. Te respondemos en menos de 48 horas.',
};

export default async function ContactoPage() {
  // Igual que en home: si hay sesión, ocultamos la tarjeta del rol contrario.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let role: 'candidate' | 'employer' | 'admin' | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'candidate' | 'employer' | 'admin' }>();
    role = profile?.role ?? 'candidate';
  }
  const showEmpresa = !role || role === 'employer' || role === 'admin';
  const showCandidato = !role || role === 'candidate';

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="bg-dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Badge variant="soft" className="mb-4">
            <MessageCircle className="mr-1 h-3 w-3" /> Hablemos
          </Badge>
          <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
            ¿En qué podemos <em className="text-gradient-primary not-italic">ayudarte</em>?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Cuéntanos quién eres y qué necesitas. Respondemos en menos de 48 horas.
          </p>
        </div>
      </section>

      {/* DOS BLOQUES: empresa / candidato — filtramos por rol cuando hay sesión */}
      {(showEmpresa || showCandidato) && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div
            className={
              'grid gap-6 ' +
              (showEmpresa && showCandidato ? 'md:grid-cols-2' : 'mx-auto max-w-xl')
            }
          >
            {showEmpresa && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <Building2 className="h-8 w-8 text-primary" />
                <h2 className="font-display mt-4 text-2xl text-foreground">Soy empresa</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Necesito incorporar profesionales hispanoamericanos a mi plantilla.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href="#form">Solicitar presupuesto ↓</a>
                </Button>
              </div>
            )}
            {showCandidato && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="font-display mt-4 text-2xl text-foreground">Soy candidato</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Quiero información sobre cómo trabajar en España con MIGRIA.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href="#form">Escribirnos ↓</a>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* INFO CONTACTO */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactInfoCard
            icon={Mail}
            title="Email"
            value="hola@migriajob.com"
            href="mailto:hola@migriajob.com"
          />
          <ContactInfoCard
            icon={Phone}
            title="Teléfono"
            value="+34 600 000 000"
            href="tel:+34600000000"
          />
          <ContactInfoCard
            icon={MapPin}
            title="Oficina"
            value="Almuñécar, Granada · España"
          />
          <ContactInfoCard
            icon={Clock}
            title="Horario"
            value="L-V · 09:00 – 18:00 (CET)"
          />
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="form" className="border-t border-border bg-surface-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Formulario de contacto</Badge>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              Cuéntanos lo que necesitas.
            </h2>
          </div>

          <ContactoForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            También puedes escribirnos directamente a{' '}
            <a href="mailto:hola@migriajob.com" className="text-primary underline-offset-2 hover:underline">
              hola@migriajob.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

function ContactInfoCard({
  icon: Icon, title, value, href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="card-hover rounded-2xl border border-border bg-surface p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
