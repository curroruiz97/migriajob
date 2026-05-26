'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateApplicationStatusAction } from '@/app/admin/ofertas/actions';

type Status = 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

const OPTIONS: { value: Status; label: string }[] = [
  { value: 'submitted', label: 'Enviada' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'shortlisted', label: 'Preseleccionado' },
  { value: 'rejected', label: 'Descartado' },
  { value: 'hired', label: 'Contratado' },
];

export function ApplicantStatusSelect({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Status>(
    (OPTIONS.some((o) => o.value === status) ? status : 'submitted') as Status
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Status;
          const prev = current;
          setCurrent(next); // optimistic
          setError(null);
          startTransition(async () => {
            const res = await updateApplicationStatusAction(applicationId, next);
            if (res && 'error' in res && res.error) {
              setCurrent(prev); // revert
              setError(res.error);
              return;
            }
            router.refresh();
          });
        }}
        className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        aria-label="Estado de la candidatura"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-destructive">No se pudo guardar: {error}</p>}
    </div>
  );
}
