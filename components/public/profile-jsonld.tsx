import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

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
    | 'current_role'
    | 'bio'
    | 'avatar_url'
    | 'location_city'
    | 'location_country'
    | 'linkedin_url'
    | 'github_url'
    | 'portfolio_url'
    | 'website_url'
    | 'skills'
  >;
  baseUrl: string;
}) {
  const url = `${baseUrl}/perfiles/${profile.slug}`;
  const sameAs = [
    profile.linkedin_url,
    profile.github_url,
    profile.portfolio_url,
    profile.website_url,
  ].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.headline ?? 'Profesional Migria',
    jobTitle: profile.current_role,
    description: profile.bio,
    image: profile.avatar_url,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location_city,
      addressCountry: profile.location_country,
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
