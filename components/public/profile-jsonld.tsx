import type { Candidate } from '@/lib/db/schema';

/**
 * Schema.org Person JSON-LD para perfiles públicos.
 * Mejora SEO y rich snippets en buscadores.
 */
export function ProfileJsonLd({
  profile,
  baseUrl,
}: {
  profile: Pick<
    Candidate,
    | 'slug'
    | 'headline'
    | 'currentRole'
    | 'bio'
    | 'avatarUrl'
    | 'locationCity'
    | 'locationCountry'
    | 'linkedinUrl'
    | 'githubUrl'
    | 'portfolioUrl'
    | 'websiteUrl'
    | 'skills'
  >;
  baseUrl: string;
}) {
  const url = `${baseUrl}/perfiles/${profile.slug}`;
  const sameAs = [
    profile.linkedinUrl,
    profile.githubUrl,
    profile.portfolioUrl,
    profile.websiteUrl,
  ].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.headline ?? 'Profesional Migria',
    jobTitle: profile.currentRole,
    description: profile.bio,
    image: profile.avatarUrl,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.locationCity,
      addressCountry: profile.locationCountry,
    },
    knowsAbout: profile.skills,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: necesario para JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
