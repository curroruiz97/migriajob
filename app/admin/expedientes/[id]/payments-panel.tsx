'use client';

import { useState, useTransition } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createPaymentAction, updatePaymentStatusAction, deletePaymentAction } from '../actions';

const CONCEPT_LABELS: Record<string, string> = {
  tasa_extranjeria: 'Tasa de Extranjería',
  honorarios_migria: 'Honorarios Migria',
  tasa_consular: 'Tasa consular',
  seguro_medico: 'Seguro médico',
  vuelo: 'Vuelo',
  alojamiento: 'Alojamiento',
  otros: 'Otros',
};

const STATUS_BADGE: Record<string, { variant: 'success' | 'warning' | 'soft' | 'destructive'; icon: typeof CheckCircle2 }> = {
  completado: { variant: 'success', icon: CheckCircle2 },
  parcial: { variant: 'warning', icon: AlertCircle },
  pendiente: { variant: 'soft', icon: Clock },
  reembolsado: { variant: 'destructive', icon: AlertCircle },
};

type Payment = {
  id: string;
  concept: string;
  description: string | null;
  amount: number;
  currency: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  reference_number: string | null;
  created_at: string;
};

type ReceiptRow = {
  id: string;
  payment_id: string | null;
  file_name: string;
  file_url: string;
  description: string | null;
  created_at: string;
};

export function PaymentsPanel({
  journeyId,
  payments,
  receipts,
}: {
  journeyId: string;
  payments: Payment[];
  receipts: ReceiptRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === 'completado')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'pendiente' || p.status === 'parcial')
    .reduce((sum, p) => sum + p.amount, 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createPaymentAction({
        journey_id: journeyId,
        concept: fd.get('concept') as any,
        description: (fd.get('description') as string) || undefined,
        amount: Number(fd.get('amount')),
        currency: (fd.get('currency') as string) || 'EUR',
        status: (fd.get('status') as any) || 'pendiente',
        due_date: (fd.get('due_date') as string) || undefined,
        payment_method: (fd.get('payment_method') as string) || undefined,
        reference_number: (fd.get('reference_number') as string) || undefined,
      });
      setShowForm(false);
    });
  }

  function markAs(paymentId: string, status: 'completado' | 'pendiente' | 'parcial' | 'reembolsado') {
    startTransition(async () => {
      await updatePaymentStatusAction(paymentId, status);
    });
  }

  function removePayment(paymentId: string) {
    if (!confirm('¿Eliminar este pago?')) return;
    startTransition(async () => {
      await deletePaymentAction(paymentId);
    });
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Wallet className="h-4 w-4" />
          Pagos y depósitos
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? 'Cancelar' : 'Nuevo pago'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: totalAmount, color: 'text-foreground' },
          { label: 'Pagado', value: paidAmount, color: 'text-success' },
          { label: 'Pendiente', value: pendingAmount, color: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface-muted/30 p-3 text-center">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
            <dd className={cn('mt-0.5 text-lg font-bold', s.color)}>
              {s.value.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </dd>
          </div>
        ))}
      </div>

      {/* New payment form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-primary/20 bg-primary-soft/10 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Concepto *</label>
              <select name="concept" required className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                {Object.entries(CONCEPT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Importe (€) *</label>
              <input name="amount" type="number" step="0.01" min="0" required className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Estado</label>
              <select name="status" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                <option value="pendiente">Pendiente</option>
                <option value="parcial">Parcial</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Fecha límite</label>
              <input name="due_date" type="date" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Método de pago</label>
              <input name="payment_method" type="text" placeholder="Transferencia, efectivo..." className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Ref. bancaria</label>
              <input name="reference_number" type="text" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Descripción</label>
            <input name="description" type="text" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          </div>
          <input type="hidden" name="currency" value="EUR" />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Registrar pago'}
          </button>
        </form>
      )}

      {/* Payments list */}
      {payments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-4">
          No hay pagos registrados.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {payments.map((p) => {
            const badge = STATUS_BADGE[p.status] ?? STATUS_BADGE.pendiente;
            const BadgeIcon = badge.icon;
            const paymentReceipts = receipts.filter((r) => r.payment_id === p.id);

            return (
              <li key={p.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {CONCEPT_LABELS[p.concept] ?? p.concept}
                      </span>
                      <Badge variant={badge.variant} className="text-[10px]">
                        <BadgeIcon className="mr-1 h-3 w-3" />
                        {p.status}
                      </Badge>
                    </div>
                    {p.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      {p.due_date && <span>Vence: {new Date(p.due_date).toLocaleDateString('es-ES')}</span>}
                      {p.paid_at && <span>Pagado: {new Date(p.paid_at).toLocaleDateString('es-ES')}</span>}
                      {p.payment_method && <span>Método: {p.payment_method}</span>}
                      {p.reference_number && <span>Ref: {p.reference_number}</span>}
                    </div>
                    {paymentReceipts.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {paymentReceipts.map((r) => (
                          <a
                            key={r.id}
                            href={r.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded border border-border bg-surface-muted/30 px-2 py-0.5 text-[10px] text-primary hover:underline"
                          >
                            <Receipt className="h-3 w-3" />
                            {r.file_name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-base font-bold text-foreground whitespace-nowrap">
                      {p.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {p.currency}
                    </span>
                    <div className="flex gap-1">
                      {p.status !== 'completado' && (
                        <button
                          type="button"
                          onClick={() => markAs(p.id, 'completado')}
                          disabled={isPending}
                          className="rounded px-2 py-0.5 text-[10px] font-medium text-success border border-success/30 hover:bg-success-soft transition-colors disabled:opacity-50"
                        >
                          Marcar pagado
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePayment(p.id)}
                        disabled={isPending}
                        className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
