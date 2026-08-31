import Link from 'next/link';
import { CreditCard, Receipt, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HideOnIOSApp } from '@/components/common/hide-on-ios-app';

export const metadata = { title: 'Facturación' };

export default function FacturacionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Facturación</h1>
        <p className="mt-1 text-sm text-zinc-500">Gestiona tu suscripción y facturas.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              <Sparkles className="mr-1 h-3 w-3" /> Plan actual
            </Badge>
            <h2 className="text-xl font-semibold">Starter</h2>
            <p className="mt-1 text-sm text-zinc-500">Gratis para siempre · 0 €/mes</p>
          </div>
          {/* El boton de mejorar plan no se muestra en la app de iPhone:
              lleva a contratar fuera de la compra integrada de Apple
              (directriz 3.1.1). */}
          <HideOnIOSApp>
            <Button asChild>
              <Link href="/planes-y-precios">Mejorar a Pro</Link>
            </Button>
          </HideOnIOSApp>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Búsquedas este mes" value="0 / 10" />
          <Stat label="Perfiles guardados" value="0 / 5" />
          <Stat label="Procesos activos" value="0 / 2" />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <CreditCard className="h-4 w-4 text-zinc-500" /> Método de pago
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Aún no has añadido un método de pago. Lo necesitarás cuando mejores tu plan.
        </p>
        <Button variant="outline" size="sm" className="mt-4" disabled>
          Añadir método de pago (próximamente)
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Receipt className="h-4 w-4 text-zinc-500" /> Facturas
        </h2>
        <p className="mt-2 text-sm text-zinc-500">No hay facturas todavía.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
