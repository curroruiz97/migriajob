'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DangerZone() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const exportData = () => {
    window.location.href = '/api/me/export';
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
        <Button variant="outline" size="sm" onClick={exportData}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Exportar mis datos
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
    </div>
  );
}
