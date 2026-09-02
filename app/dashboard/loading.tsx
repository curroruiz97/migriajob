import { Skeleton } from '@/components/ui/skeleton';

/**
 * Esqueleto de las secciones del panel del candidato.
 *
 * POR QUE. Sin un `loading.tsx`, al tocar una sección no pasaba NADA hasta que
 * el servidor devolvía la página entera: el dedo levantado, la pantalla igual y
 * la sensación de que la app se había quedado colgada. Con esto la respuesta es
 * inmediata aunque los datos tarden lo mismo, que es de lo que se queja la
 * gente cuando dice que una app "no va fluida".
 *
 * Cubre todo /dashboard/*: cualquier sección que no tenga su propio loading usa
 * este.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
