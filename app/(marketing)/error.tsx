'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function MarketingError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={AlertTriangle}
        title="No hemos podido cargar esta sección"
        description="Es un error temporal. Inténtalo de nuevo y, si persiste, vuelve más tarde."
        action={<Button onClick={reset}>Reintentar</Button>}
      />
    </div>
  );
}
