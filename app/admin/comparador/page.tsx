import { GitCompare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
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
        <EmptyState
          icon={GitCompare}
          title="Sin candidatos para comparar"
          description="Selecciona candidatos y pásalos por la URL: ?ids=id1,id2,id3"
        />
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
