import type { ReactNode } from 'react';
import { CookieBanner } from '@/components/public/cookie-banner';
import { HideInApp } from '@/components/common/hide-in-app';
import { MarketingAppBottomNav } from '@/components/public/marketing-app-bottom-nav';
import { MarketingFooter } from '@/components/public/marketing-footer';
import { MarketingHeader } from '@/components/public/marketing-header';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      {/*
        En la app (html.app-native), globals.css aplica padding inferior a este
        <main> para que el bottom nav fijo no tape el contenido. En web normal,
        no añade hueco extra porque debajo viene el footer.
      */}
      <main className="flex-1" data-app-main>
        {children}
      </main>
      {/* Footer estándar de la web — se oculta dentro de la app Capacitor. */}
      <HideInApp>
        <MarketingFooter />
      </HideInApp>
      {/* Bottom nav nativo — solo aparece dentro de la app. */}
      <MarketingAppBottomNav />
      <CookieBanner />
    </div>
  );
}
