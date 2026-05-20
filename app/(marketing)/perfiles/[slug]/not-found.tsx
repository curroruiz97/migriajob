import Link from 'next/link';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function ProfileNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={Users}
        title="Perfil no encontrado"
        description="El perfil que buscas no existe o ya no está disponible públicamente."
        action={
          <Button asChild>
            <Link href="/perfiles">Ver todos los perfiles</Link>
          </Button>
        }
      />
    </div>
  );
}
