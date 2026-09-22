import Link from 'next/link';
import { HideOnIOSApp } from '@/components/common/hide-on-ios-app';
import { Logo } from '@/components/ui/logo';

const SECTIONS = [
  {
    title: 'Talnet',
    items: [
      { href: '/empleos', label: 'Empleos' },
      { href: '/perfiles', label: 'Perfiles' },
      { href: '/empresas', label: 'Para empresas' },
      { href: '/empleados', label: 'Para empleados' },
      { href: '/migria-espana', label: 'Talnet España' },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { href: '/noticias', label: 'Noticias' },
      { href: '/planes-y-precios', label: 'Planes y precios' },
      { href: '/como-funciona', label: 'Cómo funciona' },
      { href: '/contacto', label: 'Contacto' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { href: '/privacy', label: 'Política de privacidad' },
      { href: '/terms', label: 'Términos de uso' },
      { href: '/cookies', label: 'Política de cookies' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo height={34} />
            <p className="mt-4 max-w-xs text-sm italic text-muted-foreground">
              "Talento que viaja, empresas que crecen, comunidades que prosperan."
            </p>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => {
                  const enlace = (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                  // El pie es la unica puerta que quedaba a la pagina de
                  // precios desde dentro de la app de iPhone, donde no puede
                  // haber ninguna ruta a contratar fuera de Apple (3.1.1).
                  // En la web y en Android el enlace sigue igual.
                  return item.href === '/planes-y-precios' ? (
                    <HideOnIOSApp key={item.href}>{enlace}</HideOnIOSApp>
                  ) : (
                    enlace
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          Copyright © {new Date().getFullYear()} <strong>MIGRIAJOB S.L.</strong> Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
