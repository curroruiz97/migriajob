import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Candidate } from '@/lib/db/schema';

interface CompletenessProps {
  candidate: Candidate | null;
  hasSkills?: boolean;
  hasLanguages?: boolean;
}

export function CompletenessWidget({ candidate, hasSkills, hasLanguages }: CompletenessProps) {
  const items = [
    { key: 'avatar', label: 'Foto de perfil', done: !!candidate?.avatarUrl, weight: 10 },
    { key: 'headline', label: 'Headline (titular)', done: !!candidate?.headline && candidate.headline.length > 5, weight: 10 },
    { key: 'bio', label: 'Resumen "Sobre mí" (>50 chars)', done: !!candidate?.bio && candidate.bio.length > 50, weight: 15 },
    { key: 'skills', label: 'Al menos 1 skill', done: !!hasSkills, weight: 15 },
    { key: 'experience', label: 'Experiencia profesional', done: Array.isArray(candidate?.experience) && (candidate?.experience as unknown[]).length > 0, weight: 10 },
    { key: 'languages', label: 'Idiomas con nivel MCER', done: !!hasLanguages, weight: 10 },
    { key: 'years', label: 'Años de experiencia', done: candidate?.yearsExperience != null, weight: 5 },
    { key: 'salary', label: 'Salario esperado', done: candidate?.desiredSalaryMin != null, weight: 5 },
    { key: 'location', label: 'Ubicación (ciudad)', done: !!candidate?.locationCity, weight: 5 },
    { key: 'cv', label: 'CV en PDF', done: !!candidate?.cvUrl, weight: 15 },
  ];
  const score = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  const next = items.find((i) => !i.done);

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Completa tu perfil</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Las empresas contactan más a los perfiles completos.
          </p>
        </div>
        <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'soft'}>{score}%</Badge>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist */}
      <ul className="mt-5 space-y-2">
        {items.map((i) => (
          <li key={i.key} className="flex items-start gap-2 text-sm">
            {i.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
            )}
            <span className={i.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
              {i.label}
            </span>
          </li>
        ))}
      </ul>

      {next && (
        <Link
          href="#perfil"
          className="mt-5 block rounded-md bg-primary-soft px-3 py-2 text-center text-xs font-medium text-primary transition-colors hover:bg-primary-soft/80"
        >
          Siguiente paso: {next.label} →
        </Link>
      )}
    </div>
  );
}
