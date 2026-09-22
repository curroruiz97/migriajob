import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountryFlag, countryName } from '@/components/ui/country-flag';

/**
 * El catálogo, visto desde fuera.
 *
 * Enseña QUÉ hay —profesión, experiencia, país, ciudad, disponibilidad— y
 * esconde QUIÉN es: ni nombre, ni foto, ni enlace a la ficha. Un escaparate
 * que vende el fondo de talento sin publicar a mil personas que nunca
 * abrieron una cuenta.
 *
 * Es además la puerta de captación: para ver una ficha hay que registrarse
 * como empresa, y ahí es donde Talnet consigue el contacto.
 */

export interface PerfilAnonimo {
  id: string;
  headline?: string | null;
  current_role?: string | null;
  years_experience?: number | null;
  country_of_origin?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  availability?: string | null;
  has_nie?: boolean | null;
  verified?: boolean | null;
}

/**
 * Deja fuera todo lo que identifica antes de que el objeto llegue al
 * componente. Hoy PerfilTeaser se renderiza en el servidor y el nombre no
 * viajaría igualmente, pero basta con que alguien le ponga 'use client' un día
 * para que el perfil entero acabe en el HTML. Mejor que no esté.
 */
export function aPerfilAnonimo(p: PerfilAnonimo & Record<string, unknown>): PerfilAnonimo {
  return {
    id: p.id,
    headline: p.headline ?? null,
    current_role: p.current_role ?? null,
    years_experience: p.years_experience ?? null,
    country_of_origin: p.country_of_origin ?? null,
    location_city: p.location_city ?? null,
    location_country: p.location_country ?? null,
    availability: p.availability ?? null,
    has_nie: p.has_nie ?? null,
    verified: p.verified ?? null,
  };
}

const DISPONIBILIDAD: Record<string, string> = {
  open: 'Disponible ya',
  passive: 'Abierto a ofertas',
  closed: 'No disponible',
};

export function PerfilTeaser({ perfil }: { perfil: PerfilAnonimo }) {
  const puesto = perfil.headline ?? perfil.current_role ?? 'Perfil profesional';
  const donde = [perfil.location_city, perfil.location_country].filter(Boolean).join(', ');
  const origen = perfil.country_of_origin;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium leading-snug text-foreground">{puesto}</p>
        {perfil.verified && (
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verificado" />
        )}
      </div>

      <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {typeof perfil.years_experience === 'number' && perfil.years_experience > 0 && (
          <div>
            <dt className="sr-only">Experiencia</dt>
            <dd>{perfil.years_experience} años de experiencia</dd>
          </div>
        )}
        {origen && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">País de origen</dt>
            <dd className="flex items-center gap-1.5">
              <CountryFlag code={origen} size="xs" />
              {countryName(origen)}
            </dd>
          </div>
        )}
        {donde && (
          <div>
            <dt className="sr-only">Ubicación</dt>
            <dd>{donde}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
        {perfil.availability && DISPONIBILIDAD[perfil.availability] && (
          <Badge variant="soft" className="text-[11px]">
            {DISPONIBILIDAD[perfil.availability]}
          </Badge>
        )}
        {perfil.has_nie && (
          <Badge variant="outline" className="text-[11px]">
            NIE
          </Badge>
        )}
      </div>
    </div>
  );
}

export function CatalogoBloqueado({
  total,
  muestra,
  compacto = false,
}: {
  total: number;
  muestra: PerfilAnonimo[];
  /** En la portada la sección ya tiene su propio titular; aquí no repetimos. */
  compacto?: boolean;
}) {
  return (
    <div className="space-y-8">
      {!compacto && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <Badge variant="soft" className="mb-4">
            <Lock className="mr-1 h-3 w-3" />
            Catálogo reservado a empresas
          </Badge>
          <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {total.toLocaleString('es-ES')} profesionales, uno a uno, cuando te registras.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Protegemos los datos de las personas que confían su candidatura a Talnet: las fichas
            completas —nombre, trayectoria, documentación y contacto— se abren al crear una cuenta
            de empresa. Es gratis y se tarda un minuto.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/registro?role=employer">
                Crear cuenta de empresa <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            ¿Prefieres que busquemos nosotros?{' '}
            <Link href="/contacto" className="text-primary underline-offset-2 hover:underline">
              Cuéntanos qué perfil necesitas
            </Link>{' '}
            y te presentamos una short list.
          </p>
        </div>
      )}

      {muestra.length > 0 && (
        <div>
          <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            Una muestra de lo que hay dentro, sin datos personales:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {muestra.map((p) => (
              <PerfilTeaser key={p.id} perfil={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
