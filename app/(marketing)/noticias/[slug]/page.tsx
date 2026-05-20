import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { ShareButton } from '@/components/public/share-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { ARTICLES, getArticleBySlug, getRelatedArticles, type Block } from '@/lib/content/articles';

export const revalidate = 3600;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Artículo no encontrado' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(slug, 3);

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className={`border-b border-border bg-gradient-to-br ${article.hero}`}>
        <Container size="md" className="py-12 lg:py-16">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Todos los artículos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="soft">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.readingMinutes} min de lectura
            </span>
          </div>
          <h1 className="font-display mt-5 text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{article.excerpt}</p>
        </Container>
      </section>

      {/* BODY */}
      <Container size="md" className="py-12">
        <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-xl prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          {article.body.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>

        {/* SHARE */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Logo height={40} />
          <div className="flex gap-2">
            <ShareButton title={article.title} text={article.excerpt} />
          </div>
        </div>
      </Container>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface-muted/40 py-16">
          <Container size="xl">
            <h2 className="font-display text-3xl text-foreground">Sigue leyendo</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/noticias/${a.slug}`}
                  className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <div className={`h-24 bg-gradient-to-br ${a.hero}`} />
                  <div className="flex flex-1 flex-col p-5">
                    <Badge variant="outline" className="self-start text-xs">{a.category}</Badge>
                    <h3 className="font-display mt-3 text-lg leading-tight text-foreground line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      Leer <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <Container size="md" className="py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-white sm:p-14">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            ¿Hablamos de tu próximo paso?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Si tienes dudas sobre permisos, contratación o trámites, escríbenos.
            Respondemos en menos de 48h.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/contacto">
                Contactar <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link href="/empleos">Ver ofertas</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'p':
      return <p>{block.text}</p>;
    case 'ul':
      return (
        <ul>
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      );
    case 'quote':
      return (
        <blockquote>
          {block.text}
          {block.author && <footer>— {block.author}</footer>}
        </blockquote>
      );
    case 'callout':
      return (
        <aside className="my-6 rounded-2xl border-l-4 border-primary bg-primary-soft/40 p-5 not-prose">
          <p className="text-sm font-semibold text-primary">{block.title}</p>
          <p className="mt-1 text-sm text-foreground">{block.text}</p>
        </aside>
      );
  }
}
