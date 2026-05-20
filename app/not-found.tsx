import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Página no encontrada' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-2 text-lg font-semibold text-foreground">Página no encontrada</p>
        <p className="mt-2 text-sm text-muted-foreground">
          La ruta que buscas no existe o se ha movido. Vuelve al inicio o explora perfiles.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild>
            <Link href="/perfiles">Explorar perfiles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
