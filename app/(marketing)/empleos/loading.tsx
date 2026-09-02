import { Skeleton } from '@/components/ui/skeleton';

/**
 * Esqueleto del listado de ofertas. Ver app/dashboard/loading.tsx para el
 * porqué: sin esto, tocar "Empleos" dejaba la pantalla quieta hasta que el
 * servidor respondía con la lista entera.
 */
export default function EmpleosLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
