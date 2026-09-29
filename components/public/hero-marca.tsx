import Image from 'next/image';
import { BrandDot, BrandPattern } from '@/components/ui/brand-pattern';
import { Isotipo } from '@/components/ui/logo';

/**
 * Composición de la portada según el manual de marca: personas reales sobre un
 * bloque de azul plano con el patrón de la «t» (como sus piezas de redes y la
 * portada de «Presentación LATAM»).
 *
 * Sustituye a la maqueta del panel que había antes, que vendía un software
 * cuando Talnet vende un servicio.
 *
 * La foto es de la página «Fotografía» del manual (retratos recortados). Si
 * Talnet manda las suyas, basta con cambiar el fichero: el recorte tiene que
 * ser PNG o WebP con transparencia y la gente apoyada en el borde inferior.
 */
export function HeroMarca() {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-[34rem] sm:h-[32rem] lg:h-[36rem]">
      {/* Bloque de color con el patrón. Deja arriba aire para que las cabezas
          sobresalgan del bloque. */}
      <div className="absolute inset-x-0 bottom-0 top-14 overflow-hidden rounded-xl bg-primary">
        <BrandPattern
          pieza="ancho"
          ajuste="meet"
          ancla="xMidYMax"
          className="absolute inset-x-0 bottom-0 h-full w-full text-accent"
        />
        <BrandDot className="absolute right-6 top-6 w-5 text-accent-warm" />
      </div>

      <Image
        src="/marca/foto-equipo.webp"
        alt="Dos profesionales con ropa de trabajo, sonrientes"
        width={789}
        height={1200}
        priority
        sizes="(min-width: 1024px) 380px, 70vw"
        className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-contain object-bottom"
      />

      <div className="absolute bottom-5 left-4 flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-lg sm:left-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Isotipo variante="secundario" height={20} className="text-white dark:text-secondary-foreground" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm text-foreground">Captamos, formamos y acompañamos</p>
          <p className="text-xs text-muted-foreground">De la entrevista a tu primer día en España</p>
        </div>
      </div>
    </div>
  );
}
