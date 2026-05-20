import './globals.css';
import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import {
  geistMono,
  getBodyClass,
  getFontClass,
  ibmPlexSerif,
  inter,
} from '@/lib/utils/fonts';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Migria — Talento latino, listo para trabajar en España',
    template: '%s · Migria',
  },
  description:
    'Conectamos a profesionales de Latinoamérica con empresas españolas que necesitan personas verificadas, con permiso de trabajo y experiencia europea.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Migria',
    title: 'Migria — Talento latino para empresas españolas',
    description:
      'El escaparate de profesionales latinos verificados, con permiso de trabajo y disponibles para empresas en España.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontFamily = 'geist';
  const fontClass = getFontClass(fontFamily);
  const bodyClass = getBodyClass(fontFamily);
  const fontClasses = [
    fontClass,
    geistMono.variable,
    inter.variable,
    ibmPlexSerif.variable,
    instrumentSerif.variable,
  ];

  return (
    <html
      className={fontClasses.join(' ')}
      data-font={fontFamily}
      lang="es"
      suppressHydrationWarning
    >
      <body className={bodyClass} style={{ '--font-display': `var(--font-instrument-serif), Georgia, serif` } as React.CSSProperties}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
