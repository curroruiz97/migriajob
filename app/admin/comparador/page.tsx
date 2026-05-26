import Link from 'next/link';
import { GitCompare, Users, MousePointer2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

export const metadata = { title: 'Comparador' };

export default async function ComparadorPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const ids = (params.ids ?? '').split(',').filter(Boolean).slice(0, 4);

  let profiles: Candidate[] = [];
  if (ids.length > 0) {
    const supabase = await createClient();
    const { data } = await supabase.from('candidates').select('*').in('id', ids);
    profiles = (data ?? []) as Candidate[];
  }

  if (profiles.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Comparador de candidatos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compara hasta 4 candidatos en paralelo.</p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <GitCompare className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-display text-2xl text-foreground">
            Aún no has elegido candidatos
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Para comparar dos o más perfiles en paralelo, sigue estos pasos:
          </p>

          <ol className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm">
            <Step
              n={1}
              icon={Users}
              title="Entra en Buscar candidatos"
              description="Desde el menú lateral o el botón de aquí abajo."
            />
            <Step
              n={2}
              icon={MousePointer2}
              title="Marca los candidatos a comparar"
              description="Usa el botón de comparar de cada tarjeta (icono ⇆). Puedes elegir hasta 4."
            />
            <Step
              n={3}
              icon={GitCompare}
              title="Pulsa 'Comparar' en la barra inferior"
              description="Aparece automáticamente al seleccionar 2 o más candidatos."
            />
          </ol>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button asChild className="rounded-xl">
              <Link href="/admin/candidatos">
                <Users className="mr-1.5 h-4 w-4" />
                Ir a Buscar candidatos
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const rows = [
    { label: 'Headline', get: (p: Candidate) => p.headline ?? '—' },
    { label: 'Rol actual', get: (p: Candidate) => p.current_role ?? '—' },
    { label: 'Experiencia', get: (p: Candidate) => `${p.years_experience ?? '—'} años` },
    {
      label: 'Ubicación',
      get: (p: Candidate) => [p.location_city, p.location_country].filter(Boolean).join(', ') || '—',
    },
    {
      label: 'Disponibilidad',
      get: (p: Candidate) =>
        p.availability === 'open' ? 'Disponible'
          : p.availability === 'passive' ? 'Abierto a ofertas'
          : 'No disponible',
    },
    {
      label: 'Salario esperado',
      get: (p: Candidate) =>
        p.desired_salary_min
          ? `${p.desired_salary_min.toLocaleString('es-ES')} €${
              p.desired_salary_max ? ` – ${p.desired_salary_max.toLocaleString('es-ES')} €` : ''
            }`
          : '—',
    },
    {
      label: 'Skills',
      get: (p: Candidate) => (p.skills?.length ? p.skills.slice(0, 6).join(', ') : '—'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Comparador de candidatos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comparando {profiles.length} perfiles.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-44 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Atributo
              </th>
              {profiles.map((p) => {
                const initials = (p.headline ?? 'M')
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                return (
                  <th key={p.id} className="px-4 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {p.avatar_url && <AvatarImage src={p.avatar_url} alt="" />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {p.headline ?? p.current_role ?? 'Candidato'}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs font-normal">
                          {p.years_experience ?? '?'} años
                        </Badge>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
                {profiles.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-foreground">{row.get(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  description,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted/30 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}
