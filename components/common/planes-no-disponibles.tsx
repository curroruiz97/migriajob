import { Building2 } from 'lucide-react';

/**
 * Lo que ve la app de iPhone en lugar de la página de planes.
 *
 * No dice "no disponible en iOS" ni menciona a Apple: eso deja al usuario
 * pensando que la app está capada. Dice lo único que necesita saber, que es
 * cómo seguir, y lo hace sin precios, sin planes y sin enlaces que lleven a
 * contratar, que es lo que exige la directriz 3.1.1.
 */
export function PlanesNoDisponibles() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Building2 className="size-7" />
      </div>
      <h1 className="font-display text-3xl tracking-tight text-foreground">
        Cuentas de empresa
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Si quieres publicar ofertas y contactar con profesionales, escríbenos y
        te damos de alta la cuenta de tu empresa.
      </p>
      <a
        href="mailto:hola@migriajob.com?subject=Cuenta%20de%20empresa"
        className="mt-8 text-base font-medium text-primary underline underline-offset-4"
      >
        hola@migriajob.com
      </a>
    </div>
  );
}
