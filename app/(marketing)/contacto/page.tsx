import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Building2, Users, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

          <form
            className="mt-10 space-y-5 rounded-2xl border border-border bg-surface p-8"
            action="mailto:hola@migriajob.com"
            method="post"
            encType="text/plain"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+34 600 000 000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Soy *</Label>
                <select
                  id="role"
                  name="role"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="" disabled>Selecciona…</option>
                  <option value="company">Empresa que busca empleados</option>
                  <option value="candidate">Candidato que busca empleo</option>
                  <option value="partner">Partner / colaborador</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa (si aplica)</Label>
              <Input id="company" name="company" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector de interés</Label>
              <select
                id="sector"
                name="sector"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="">—</option>
                <option value="hosteleria">Hostelería y turismo</option>
                <option value="logistica">Logística y transporte</option>
                <option value="construccion">Construcción y obra civil</option>
                <option value="mantenimiento">Mantenimiento y servicios técnicos</option>
                <option value="limpieza">Limpieza y servicios auxiliares</option>
                <option value="agricultura">Agricultura y agroindustria</option>
                <option value="industria">Industria y producción</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Cuéntanos *</Label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Si eres empresa: cuántos puestos, qué perfiles, para cuándo. Si eres candidato: tu profesión, experiencia y desde qué país escribes."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5" />
              <span>
                Acepto la{' '}
                <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
                  Política de privacidad
                </Link>{' '}
                y el tratamiento de mis datos para responderme.
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full">
              Enviar mensaje
            </Button>
          </form>

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
