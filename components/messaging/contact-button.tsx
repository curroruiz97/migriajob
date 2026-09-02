'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { abrirConversacionAction } from '@/lib/messaging/actions';

/**
 * Boton "Contactar" de los perfiles y las ofertas.
 *
 * Abre la conversacion con esa persona y lleva al hilo. Si no hay sesion manda
 * a iniciarla y vuelve al mismo sitio, en vez de dejar al usuario en el panel
 * sin saber que ha pasado.
 *
 * Antes esto era un `<Button>` sin nada dentro. Ver lib/messaging/actions.ts.
 */
export function ContactButton({
  usuarioId,
  label = 'Contactar',
  className,
  size = 'lg',
  variant = 'default',
}: {
  usuarioId: string;
  label?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const abrir = () => {
    startTransition(async () => {
      const r = await abrirConversacionAction(usuarioId);

      if ('ok' in r) {
        router.push(`/dashboard/mensajes/${r.id}`);
        return;
      }

      if (r.necesitaSesion) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      toast({
        title: 'No se ha podido abrir la conversación',
        description: r.error,
        variant: 'destructive',
      });
    });
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={abrir}
      disabled={pending}
    >
      <MessageSquare className="mr-1.5 h-4 w-4" aria-hidden />
      {pending ? 'Abriendo…' : label}
    </Button>
  );
}

export default ContactButton;
