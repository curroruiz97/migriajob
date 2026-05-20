import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Permite que `next build` termine aunque haya errores de TS.
    // Útil mientras se completa la migración Bordful → marketplace.
    ignoreBuildErrors: true,
  },
  eslint: {
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
