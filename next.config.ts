import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
