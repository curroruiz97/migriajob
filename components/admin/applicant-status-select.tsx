'use client';

import { useTransition } from 'react';
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

  return (
    <select
      defaultValue={OPTIONS.some((o) => o.value === status) ? status : 'submitted'}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          await updateApplicationStatusAction(applicationId, e.target.value as Status);
          router.refresh();
        })
      }
      className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Estado de la candidatura"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
