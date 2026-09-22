import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        // OJO: `/perfiles/*` sigue permitido A PROPÓSITO aunque las fichas
        // lleven `noindex` mientras el catálogo esté cerrado. Un `Disallow`
        // aquí impediría a Google entrar, y sin entrar no puede leer el
        // noindex: las URLs que ya tiene indexadas se quedarían para siempre.
        // Primero se desindexan, y solo después tendría sentido bloquear.
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
