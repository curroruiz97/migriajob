import './globals.css';
import type { Metadata, Viewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { NativeBootstrap } from '@/components/native/native-bootstrap';
import { Medicion } from '@/components/public/medicion';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { fontVariables } from '@/lib/utils/fonts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Talnet — Talento latino, listo para trabajar en España',
    template: '%s · Talnet',
  },
  description:
    'Conectamos a profesionales de Latinoamérica con empresas españolas que necesitan personas verificadas, con permiso de trabajo y experiencia europea.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Talnet',
    title: 'Talnet — Talento latino para empresas españolas',
    description:
      'El escaparate de profesionales latinos verificados, con permiso de trabajo y disponibles para empresas en España.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // necesario para env(safe-area-inset-*) en notch/gestos
  // El azul marino de la marca (#100E51), el fondo oscuro del manual.
  themeColor: '#100E51',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={fontVariables} lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NativeBootstrap />
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
          {/* El nombre va sin NEXT_PUBLIC_ a propósito, así que hay que
              leerlo aquí, en servidor, y bajarlo. Se acepta el otro nombre por
              si alguien lo configura con el prefijo. */}
          <Medicion
            measurementId={
              process.env.GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
            }
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
