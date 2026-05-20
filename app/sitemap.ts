import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/perfiles`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/planes-y-precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/como-funciona`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/registro`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.5 },
  ];

  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('candidates')
      .select('slug, updated_at')
      .eq('is_public', true)
      .not('slug', 'is', null)
      .limit(5000);

    profileRoutes = (data ?? [])
      .filter((r) => r.slug)
      .map((r) => ({
        url: `${baseUrl}/perfiles/${r.slug}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // BD no configurada todavía
  }

  return [...staticRoutes, ...profileRoutes];
}
