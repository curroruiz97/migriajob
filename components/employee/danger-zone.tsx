'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DangerZone() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [exporting, startExport] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  /**
   * Descarga del JSON con todos los datos del usuario.
   * Antes usaba `window.location.href = '/api/me/export'`, que en el WebView
   * de la app Capacitor no dispara descarga (intenta "navegar" al archivo y
   * el WebView se queda mirándolo). Ahora hacemos fetch + Blob + anchor
   * download, que funciona tanto en navegadores como en WebView Android.
   */
  const exportData = () => {
    setError(null);
    setInfo(null);
    startExport(async () => {
      try {
        const res = await fetch('/api/me/export', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? 'No se pudo exportar tus datos. Inténtalo más tarde.');
          return;
        }
        const blob = await res.blob();
        const filename = parseFilename(res.headers.get('content-disposition')) ?? 'migria-export.json';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Liberar memoria del Blob URL tras un tick para no romper la descarga.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setInfo('Descarga iniciada. Revisa tu carpeta de descargas.');
      } catch {
        setError('No se pudo exportar tus datos. Comprueba tu conexión.');
      }
    });
  };

  const deleteAccount = () => {
    if (!confirm('¿Seguro? Esto eliminará toda tu información permanentemente.')) return;
    if (!confirm('Última confirmación. NO se puede deshacer.')) return;

    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/me/delete', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'No se pudo eliminar la cuenta. Inténtalo más tarde.');
        return;
      }
      router.push('/');
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={exportData} disabled={exporting}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {exporting ? 'Generando…' : 'Exportar mis datos'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={deleteAccount}
          disabled={pending}
          className="border-destructive/40 text-destructive hover:bg-destructive-soft hover:text-destructive"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          {pending ? 'Eliminando…' : 'Eliminar cuenta'}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {info && !error && <p className="text-sm text-muted-foreground">{info}</p>}
    </div>
  );
}

/** Extrae el filename del header Content-Disposition: attachment; filename="x.json" */
function parseFilename(header: string | null): string | null {
  if (!header) return null;
  const match = /filename="?([^";]+)"?/i.exec(header);
  return match ? match[1] : null;
}
