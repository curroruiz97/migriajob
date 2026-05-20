'use client';

import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900">500</h1>
            <p className="mt-2 text-lg font-semibold text-zinc-900">Error inesperado</p>
            <p className="mt-2 text-sm text-zinc-500">
              Estamos investigando. Vuelve a intentarlo en unos segundos.
            </p>
            {error.digest && (
              <p className="mt-3 text-xs text-zinc-400">Ref: {error.digest}</p>
            )}
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Reintentar
              </button>
              <a
                href="/"
                className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
