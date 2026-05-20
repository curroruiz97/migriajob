'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-12">
      <EmptyState
        icon={AlertTriangle}
        title="Algo ha ido mal"
        description="No hemos podido cargar esta sección. Inténtalo de nuevo."
        action={<Button onClick={reset}>Reintentar</Button>}
      />
    </div>
  );
}
