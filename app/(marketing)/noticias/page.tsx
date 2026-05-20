import Link from 'next/link';
import { Newspaper, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { ARTICLES } from '@/lib/content/articles';

export const metadata = {
  title: 'Noticias',
  description:
    'Actualidad sobre movilidad laboral, permisos de trabajo en España, contratación en origen y sectores con mayor demanda.',
};

export default function NoticiasPage() {
  const [featured, ...rest] = ARTICLES;

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-hero-gradient">
        <Container size="xl" as="section" className="py-16 lg:py-20">
          <Badge variant="soft" className="mb-4">
            <Newspaper className="mr-1 h-3 w-3" /> Blog Migria
          </Badge>
          <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
            Movilidad laboral, sin <em className="text-gradient-primary not-italic">tonterías</em>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Guías prácticas, análisis del mercado español y casos reales para profesionales latinos y empresas
            que apuestan por contratar bien.
          </p>
        </Container>
      </section>

      {/* DESTACADO */}
      <Container size="xl" className="py-12">
        <Link
          href={`/noticias/${featured.slug}`}
          className={`card-hover block overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${featured.hero} p-1`}
        >
          <div className="rounded-[1.4rem] bg-surface p-8 sm:p-14">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">{featured.category}</Badge>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {featured.readingMinutes} min de lectura
              </span>
            </div>
            <h2 className="font-display mt-4 text-3xl leading-tight text-foreground sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{featured.excerpt}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Leer artículo <ArrowRight className="h-4 w-4" />
            </p>
          </div>
        </Link>
      </Container>

      {/* GRID */}
      <Container size="xl" className="pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/noticias/${a.slug}`}
              className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className={`h-32 bg-gradient-to-br ${a.hero}`} />
              <div className="flex flex-1 flex-col p-5">
                <Badge variant="outline" className="self-start text-xs">{a.category}</Badge>
                <h3 className="font-display mt-3 text-xl leading-tight text-foreground line-clamp-2">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <time className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {a.readingMinutes} min
                  </time>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Leer <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* SUSCRIBIRSE */}
      <Container size="sm" className="pb-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface p-10 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-primary" />
          <h2 className="font-display mt-4 text-2xl text-foreground sm:text-3xl">
            Suscríbete al boletín mensual
          </h2>
          <p className="mt-2 text-muted-foreground">
            Una vez al mes. Guías, oportunidades reales y casos de éxito.
          </p>
          <form action="/contacto" className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button type="submit" className="rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Suscribirme
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
