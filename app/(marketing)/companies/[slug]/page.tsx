import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, Globe, MapPin, Building2, Briefcase, Users, BadgeCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from('companies').select('name, description').eq('slug', slug).maybeSingle();
  if (!company) return { title: 'Empresa no encontrada' };
  return {
    title: company.name,
    description: company.description ?? `Conoce ${company.name} en Migria.`,
  };
}

export default async function CompanyPublicPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (!company) notFound();

  // Reseñas públicas
  const { data: reviews } = await supabase
    .from('company_reviews')
    .select('id, score, body, created_at')
    .eq('company_id', company.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20);

  const initials = (company.name ?? 'C').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const avgScore =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
      : null;

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-hero-gradient">
        <Container size="md" className="py-12 lg:py-16">
          <Link
            href="/empresas"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </Link>
          <div className="mt-6 flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg sm:h-24 sm:w-24">
              {company.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={company.logo_url} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                  {company.name}
                </h1>
                {company.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-info-soft px-2 py-1 text-xs font-medium text-info">
                    <BadgeCheck className="h-3 w-3" fill="currentColor" stroke="white" />
                    Verificada
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {company.industry && (
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="h-3 w-3" /> {company.industry}
                  </Badge>
                )}
                {company.size && (
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" /> {company.size}
                  </Badge>
                )}
                {company.location && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" /> {company.location}
                  </Badge>
                )}
                {avgScore != null && (
                  <Badge variant="soft">
                    ★ {avgScore.toFixed(1)} ({reviews?.length})
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container size="md" className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-8">
            {company.description && (
              <section>
                <h2 className="font-display text-2xl text-foreground">Sobre la empresa</h2>
                <p className="mt-3 whitespace-pre-line text-foreground leading-relaxed">
                  {company.description}
                </p>
              </section>
            )}

            {/* Reseñas */}
            <section>
              <h2 className="font-display text-2xl text-foreground">Reseñas de profesionales</h2>
              {!reviews || reviews.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Esta empresa todavía no tiene reseñas públicas.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl border border-border bg-surface p-5">
                      <div className="flex gap-1 text-accent-warm" aria-label={`${r.score} estrellas`}>
                        {Array.from({ length: r.score }).map((_, i) => <span key={i}>★</span>)}
                      </div>
                      {r.body && <p className="mt-2 text-sm text-foreground">{r.body}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-foreground">Información rápida</h3>
              <dl className="mt-3 space-y-2 text-sm">
                {company.website && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Web</dt>
                    <dd>
                      <a
                        href={company.website}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-3 w-3" /> Visitar
                      </a>
                    </dd>
                  </div>
                )}
                {company.industry && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Sector</dt>
                    <dd className="font-medium text-foreground">{company.industry}</dd>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Tamaño</dt>
                    <dd className="font-medium text-foreground">{company.size}</dd>
                  </div>
                )}
              </dl>

              <Button asChild className="mt-5 w-full">
                <Link href="/contacto">Contactar</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-surface-muted/40 p-5 text-sm">
              <Building2 className="h-5 w-5 text-primary" />
              <p className="mt-2 text-foreground">¿Trabajaste aquí?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Deja una reseña y ayuda a otros profesionales a tomar mejores decisiones.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
