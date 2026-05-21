import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OfferForm } from '@/components/admin/offer-form';

export const metadata = { title: 'Nueva oferta' };

export default function NuevaOfertaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/admin/ofertas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Mis ofertas
      </Link>
      <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground">
        Nueva oferta
      </h1>
      <OfferForm />
    </div>
  );
}
