'use client';

import { useTransition, useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FavoriteButton({
  candidateId,
  initial = false,
}: {
  candidateId: string;
  initial?: boolean;
}) {
  const [favorited, setFavorited] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={favorited ? 'default' : 'outline'}
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const r = await toggleFavoriteAction(candidateId);
          if (r.ok) setFavorited(r.favorited);
        })
      }
    >
      <Heart className={cn('mr-1.5 h-4 w-4', favorited && 'fill-current')} />
      {favorited ? 'Guardado' : 'Guardar'}
    </Button>
  );
}
