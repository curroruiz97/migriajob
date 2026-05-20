import Link from 'next/link';
import { Bell, Lock, Mail, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DangerZone } from '@/components/employee/danger-zone';

export const metadata = { title: 'Configuración' };

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-500">Tu cuenta, seguridad y notificaciones.</p>
      </div>

      <Card icon={Mail} title="Email de la cuenta">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{user?.email}</p>
        <Button variant="outline" size="sm" className="mt-4" disabled>
          Cambiar email (próximamente)
        </Button>
      </Card>

      <Card icon={Lock} title="Contraseña">
        <p className="text-sm text-zinc-500">Recibirás un email para cambiar tu contraseña.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/recuperar">Cambiar contraseña</Link>
        </Button>
      </Card>

      <Card icon={Bell} title="Notificaciones">
        <p className="text-sm text-zinc-500">
          Personalizable próximamente. Por defecto recibirás un email cuando un empleador te
          contacte o muevas un proceso.
        </p>
      </Card>

      <Card icon={Shield} title="Cuenta y privacidad">
        <p className="mb-4 text-sm text-muted-foreground">
          Cumplimos con RGPD. Puedes exportar todos tus datos en JSON o eliminar tu cuenta
          permanentemente.
        </p>
        <DangerZone />
      </Card>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Icon className="h-4 w-4 text-zinc-500" /> {title}
      </h2>
      <Separator className="my-4" />
      {children}
    </div>
  );
}
