import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // EL LIMITE POR DEFECTO SON 1 MB Y NOS ESTABA COMIENDO SUBIDAS ENTERAS.
      // Todo lo que sube un usuario —foto de perfil, logotipo, curriculum— va
      // por una server action, y cuando el cuerpo pasa del limite Next rechaza
      // la peticion antes de ejecutar nada. El codigo de la accion comprueba
      // 2 MB para imagenes y 5 MB para el CV, mensajes claros que NUNCA se
      // llegaban a ver: saltaba el error boundary con "Algo ha ido mal".
      //
      // Una foto de camara pesa 2-5 MB, asi que ponerse una foto desde el
      // movil era imposible (rechazo 2.1a de Apple), y cualquier CV de mas de
      // 1 MB llevaba fallando en silencio desde el primer dia, aunque la
      // pantalla prometiera 5 MB.
      //
      // Las imagenes ademas se reducen ya en el navegador (lib/images/
      // comprimir.ts); esto es el margen para el CV y la red de seguridad para
      // que los mensajes de tamano vuelvan a funcionar.
      bodySizeLimit: '6mb',
    },
  },
  typescript: {
    // El typecheck vuelve a bloquear el build: `next build` falla si hay
    // errores de TS. (Reactivado tras la puesta a punto — typecheck en verde.)
    ignoreBuildErrors: false,
  },
  eslint: {
    // El linting se gestiona con Biome/ultracite (ver biome.jsonc), no con
    // ESLint, que no está instalado. Mantener ESLint fuera del build evita
    // un paso roto; ejecuta `bunx ultracite check` para lint.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Rutas legacy → estructura migriajob.com
      { source: '/jobs', destination: '/empleos', permanent: true },
      { source: '/jobs/:path*', destination: '/empleos', permanent: true },
      { source: '/job-alerts', destination: '/empleos', permanent: true },
      { source: '/about', destination: '/empresas', permanent: true },
      { source: '/contact', destination: '/contacto', permanent: true },
      { source: '/faq', destination: '/#faq', permanent: true },
    ];
  },
  async headers() {
    // Las fichas de candidato no se indexan mientras el catálogo esté cerrado.
    // La página ya manda su propio `noindex` en el <head>; esta cabecera es el
    // segundo cinturón, porque la de abajo, que aplica a TODAS las rutas, dice
    // "index" y conviene que aquí no haya ninguna duda.
    const fichasIndexables = process.env.CATALOGO_PUBLICO === 'true';

    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      // Va DESPUÉS de la regla general a propósito: con la misma clave, la
      // última que coincide es la que se aplica.
      ...(fichasIndexables
        ? []
        : [
            {
              source: '/perfiles/:slug+',
              headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
            },
          ]),
      {
        // Apply specific headers to image files
        source: '/:path*.jpg',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, max-image-preview:large',
          },
        ],
      },
      {
        // Apply specific headers to image files
        source: '/:path*.jpeg',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, max-image-preview:large',
          },
        ],
      },
      {
        // Apply specific headers to image files
        source: '/:path*.png',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, max-image-preview:large',
          },
        ],
      },
      {
        // Apply specific headers to image files
        source: '/:path*.svg',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, max-image-preview:large',
          },
        ],
      },
      {
        // Apply specific headers to PDF files
        source: '/:path*.pdf',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, nosnippet',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
