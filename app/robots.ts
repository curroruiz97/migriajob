import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/perfiles/*'],
        // /revision/* son materiales para la revision de Apple (grabaciones de
        // pantalla que se enlazan en App Store Connect). No son contenido del
        // sitio y no pintan nada en un buscador.
        disallow: ['/admin/*', '/dashboard/*', '/api/*', '/login', '/registro', '/recuperar/*', '/revision/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
