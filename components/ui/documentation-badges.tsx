import { Check, Clock, Globe, FileCheck2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkPermit =
  | 'eu_citizen'
  | 'permanent'
  | 'temporary'
  | 'in_application'
  | 'needs_sponsorship'
  | 'not_specified';

type Homologation = 'verified' | 'in_progress' | 'not_required' | 'not_started' | 'not_specified';

const PERMIT_CONFIG: Record<WorkPermit, { label: string; tone: string; icon: typeof Check }> = {
  eu_citizen: { label: 'Ciudadanía UE', tone: 'bg-success-soft text-success', icon: Globe },
  permanent: { label: 'Permiso permanente', tone: 'bg-success-soft text-success', icon: ShieldCheck },
  temporary: { label: 'Permiso vigente', tone: 'bg-info-soft text-info', icon: ShieldCheck },
  in_application: { label: 'Permiso en trámite', tone: 'bg-warning-soft text-warning', icon: Clock },
  needs_sponsorship: { label: 'Necesita patrocinio', tone: 'bg-muted text-muted-foreground', icon: Clock },
  not_specified: { label: '', tone: '', icon: Check },
};

const HOMOLOGATION_CONFIG: Record<Homologation, { label: string; tone: string; icon: typeof Check }> = {
  verified: { label: 'Título homologado', tone: 'bg-success-soft text-success', icon: FileCheck2 },
  in_progress: { label: 'Homologación en trámite', tone: 'bg-warning-soft text-warning', icon: Clock },
  not_required: { label: 'No requiere homologación', tone: 'bg-muted text-muted-foreground', icon: Check },
  not_started: { label: 'Sin homologar', tone: 'bg-muted text-muted-foreground', icon: Clock },
  not_specified: { label: '', tone: '', icon: Check },
};

function Pill({
  label,
  tone,
  Icon,
  className,
}: {
  label: string;
  tone: string;
  Icon: typeof Check;
  className?: string;
}) {
  if (!label) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        tone,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function WorkPermitBadge({ status, className }: { status: WorkPermit | null; className?: string }) {
  if (!status || status === 'not_specified') return null;
  const cfg = PERMIT_CONFIG[status];
  return <Pill label={cfg.label} tone={cfg.tone} Icon={cfg.icon} className={className} />;
}

export function HomologationBadge({ status, className }: { status: Homologation | null; className?: string }) {
  if (!status || status === 'not_specified') return null;
  const cfg = HOMOLOGATION_CONFIG[status];
  return <Pill label={cfg.label} tone={cfg.tone} Icon={cfg.icon} className={className} />;
}

export function NieBadge({ has, className }: { has?: boolean; className?: string }) {
  if (!has) return null;
  return <Pill label="NIE vigente" tone="bg-info-soft text-info" Icon={Check} className={className} />;
}
