import Link from 'next/link';
import {
  GitCompare, Users, MousePointer2, ArrowRight, User, Briefcase,
  Heart, FolderOpen, Info, Sparkles, FileText, ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];

export const metadata = { title: 'Comparador de candidatos' };

interface ExperienceItem { company?: string; position?: string; role?: string; }
interface LanguageItem { language?: string; code?: string; level?: string; }

const AVAIL_LABEL: Record<string, string> = {
  open: 'Disponible', passive: 'Abierto a ofertas', closed: 'No disponible',
};
const AVAIL_STYLE: Record<string, string> = {
  open: 'bg-success-soft text-success',
  passive: 'bg-warning-soft text-warning',
  closed: 'bg-muted text-muted-foreground',
};

function show(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined || v === '') return '–';
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  return String(v);
}

function computeAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 && age <= 120 ? age : null;
}

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
          <h2 className="mt-5 font-display text-2xl text-foreground">Aún no has elegido candidatos</h2>
          <p className="mt-2 text-sm text-muted-foreground">Para comparar dos o más perfiles en paralelo, sigue estos pasos:</p>
          <ol className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm">
            <Step n={1} icon={Users} title="Entra en Buscar candidatos" description="Desde el menú lateral o el botón de aquí abajo." />
            <Step n={2} icon={MousePointer2} title="Marca los candidatos a comparar" description="Usa el botón de comparar de cada tarjeta (icono ⇆). Puedes elegir hasta 4." />
            <Step n={3} icon={GitCompare} title="Pulsa 'Comparar' en la barra inferior" description="Aparece automáticamente al seleccionar 2 o más candidatos." />
          </ol>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button asChild className="rounded-xl">
              <Link href="/admin/candidatos">
                <Users className="mr-1.5 h-4 w-4" /> Ir a Buscar candidatos <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-compute data
  const data = profiles.map((p) => {
    const age = computeAge(p.date_of_birth);
    const exps = (Array.isArray(p.experience) ? p.experience : []) as ExperienceItem[];
    const langs = (Array.isArray(p.languages) ? p.languages : []) as LanguageItem[];
    const skills = p.skills ?? [];
    const locs = p.preferred_locations ?? [];
    return { p, age, exps, langs, skills, locs };
  });

  const sections: { title: string; icon: React.ComponentType<{ className?: string }>; rows: { label: string; cells: (string | React.ReactNode)[] }[] }[] = [
    {
      title: 'Datos personales',
      icon: User,
      rows: [
        { label: 'Nombre completo', cells: data.map((d) => show(d.p.full_name)) },
        { label: 'Edad', cells: data.map((d) => d.age != null ? `${d.age} años` : '–') },
        { label: 'Nacionalidad', cells: data.map((d) => show(d.p.country_of_origin)) },
        { label: 'Teléfono', cells: data.map((d) => show(d.p.phone)) },
        { label: 'Email', cells: data.map((d) => show(d.p.email)) },
        { label: 'Ciudad actual', cells: data.map((d) => show(d.p.location_city)) },
        { label: 'País actual', cells: data.map((d) => show(d.p.location_country)) },
      ],
    },
    {
      title: 'Perfil profesional',
      icon: Briefcase,
      rows: [
        { label: 'Titular', cells: data.map((d) => show(d.p.headline)) },
        {
          label: 'Años experiencia',
          cells: data.map((d) => {
            const v = d.p.years_experience;
            if (v == null) return '–';
            const isMax = data.every((o) => (o.p.years_experience ?? 0) <= v);
            return isMax && data.length > 1
              ? <span className="font-semibold text-primary">{v} años ★</span>
              : `${v} años`;
          }),
        },
        {
          label: 'Habilidades',
          cells: data.map((d) =>
            d.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {d.skills.slice(0, 5).map((s) => (
                  <span key={s} className="inline-block rounded-full border border-border px-2 py-0.5 text-xs">{s}</span>
                ))}
              </div>
            ) : '–'
          ),
        },
        {
          label: 'Idiomas',
          cells: data.map((d) =>
            d.langs.length > 0
              ? d.langs.map((l) => `${l.language ?? l.code ?? '?'} (${l.level ?? '?'})`).join(', ')
              : '–'
          ),
        },
        {
          label: 'Descripción',
          cells: data.map((d) => d.p.bio ? (d.p.bio.length > 100 ? d.p.bio.slice(0, 100) + '…' : d.p.bio) : '–'),
        },
      ],
    },
    {
      title: 'Experiencia laboral',
      icon: Sparkles,
      rows: [
        {
          label: 'Último puesto',
          cells: data.map((d) => {
            if (d.exps.length === 0) return '–';
            const e = d.exps[0];
            return `${e.position || e.role || '–'}${e.company ? ` en ${e.company}` : ''}`;
          }),
        },
        { label: 'Total experiencias', cells: data.map((d) => d.exps.length > 0 ? `${d.exps.length}` : '–') },
      ],
    },
    {
      title: 'Preferencias laborales',
      icon: Heart,
      rows: [
        {
          label: 'Salario mínimo',
          cells: data.map((d) => {
            const v = d.p.desired_salary_min;
            if (v == null) return '–';
            const isMin = data.every((o) => (o.p.desired_salary_min ?? Infinity) >= v);
            return isMin && data.length > 1
              ? <span className="font-semibold text-success">{v.toLocaleString('es-ES')} € ★</span>
              : `${v.toLocaleString('es-ES')} €`;
          }),
        },
        {
          label: 'Salario máximo',
          cells: data.map((d) => d.p.desired_salary_max != null ? `${d.p.desired_salary_max.toLocaleString('es-ES')} €` : '–'),
        },
        { label: 'Ubicaciones deseadas', cells: data.map((d) => d.locs.length > 0 ? d.locs.join(', ') : '–') },
        { label: 'Disponibilidad incorporación', cells: data.map((d) => show(d.p.start_availability)) },
        { label: 'Dispuesto a trasladarse', cells: data.map((d) => d.p.willing_to_relocate != null ? (d.p.willing_to_relocate ? 'Sí' : 'No') : '–') },
      ],
    },
    {
      title: 'Documentación',
      icon: FolderOpen,
      rows: [
        {
          label: 'Curriculum (PDF)',
          cells: data.map((d) =>
            d.p.cv_url ? (
              <a href={d.p.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                <FileText className="h-3.5 w-3.5" /> Ver CV <ExternalLink className="h-3 w-3" />
              </a>
            ) : '–'
          ),
        },
      ],
    },
    {
      title: 'Información adicional',
      icon: Info,
      rows: [
        { label: 'Fuente de reclutamiento', cells: data.map((d) => show(d.p.recruitment_source)) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Comparador de candidatos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comparando {profiles.length} perfiles lado a lado.</p>
      </div>

      {/* ── Desktop: tabla horizontal ── */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[600px]">
          {/* Cabeceras: avatar + nombre + badge */}
          <thead>
            <tr className="border-b-2 border-border">
              <th className="w-48 px-4 py-4 text-left" />
              {data.map(({ p }) => {
                const name = p.full_name || p.headline || 'Candidato';
                const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <th key={p.id} className="px-4 py-4 text-left align-top">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 shrink-0 ring-2 ring-background">
                        {p.avatar_url && <AvatarImage src={p.avatar_url} alt="" />}
                        <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={p.slug ? `/admin/candidatos/${p.slug}` : '#'} className="text-sm font-bold text-foreground hover:text-primary hover:underline">
                          {name}
                        </Link>
                        {p.headline && p.full_name && (
                          <p className="truncate text-xs text-muted-foreground">{p.headline}</p>
                        )}
                        <Badge className={`mt-1 text-xs ${AVAIL_STYLE[p.availability]}`}>
                          {AVAIL_LABEL[p.availability]}
                        </Badge>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <SectionGroup key={section.title} section={section} count={data.length} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: cards apiladas ── */}
      <div className="space-y-6 sm:hidden">
        {data.map(({ p, age, exps, langs, skills, locs }) => {
          const name = p.full_name || p.headline || 'Candidato';
          const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border bg-surface-muted/30 p-4">
                <Avatar className="h-12 w-12 shrink-0">
                  {p.avatar_url && <AvatarImage src={p.avatar_url} alt="" />}
                  <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Link href={p.slug ? `/admin/candidatos/${p.slug}` : '#'} className="text-sm font-bold text-foreground hover:text-primary">
                    {name}
                  </Link>
                  {p.headline && p.full_name && (
                    <p className="truncate text-xs text-muted-foreground">{p.headline}</p>
                  )}
                </div>
                <Badge className={`shrink-0 text-xs ${AVAIL_STYLE[p.availability]}`}>
                  {AVAIL_LABEL[p.availability]}
                </Badge>
              </div>
              {/* Fields */}
              <div className="divide-y divide-border/50 px-4">
                <MobileField label="Edad" value={age != null ? `${age} años` : '–'} />
                <MobileField label="Nacionalidad" value={show(p.country_of_origin)} />
                <MobileField label="Teléfono" value={show(p.phone)} />
                <MobileField label="Email" value={show(p.email)} />
                <MobileField label="Ciudad / País" value={[p.location_city, p.location_country].filter(Boolean).join(', ') || '–'} />
                <MobileField label="Titular" value={show(p.headline)} />
                <MobileField label="Experiencia" value={p.years_experience != null ? `${p.years_experience} años` : '–'} />
                <MobileField label="Habilidades" value={skills.length > 0 ? skills.slice(0, 4).join(', ') : '–'} />
                <MobileField label="Idiomas" value={langs.length > 0 ? langs.map((l) => l.language ?? l.code ?? '?').join(', ') : '–'} />
                <MobileField label="Último puesto" value={exps.length > 0 ? `${exps[0].position || exps[0].role || '–'}${exps[0].company ? ` en ${exps[0].company}` : ''}` : '–'} />
                <MobileField label="Salario mín" value={p.desired_salary_min != null ? `${p.desired_salary_min.toLocaleString('es-ES')} €` : '–'} />
                <MobileField label="Salario máx" value={p.desired_salary_max != null ? `${p.desired_salary_max.toLocaleString('es-ES')} €` : '–'} />
                <MobileField label="Ubicaciones" value={locs.length > 0 ? locs.join(', ') : '–'} />
                <MobileField label="Disponibilidad" value={show(p.start_availability)} />
                <MobileField label="Trasladarse" value={p.willing_to_relocate != null ? (p.willing_to_relocate ? 'Sí' : 'No') : '–'} />
                <MobileField label="CV" value={p.cv_url ? '📄 Disponible' : '–'} />
                <MobileField label="Fuente" value={show(p.recruitment_source)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Subcomponents ─── */

function SectionGroup({
  section,
  count,
}: {
  section: { title: string; icon: React.ComponentType<{ className?: string }>; rows: { label: string; cells: (string | React.ReactNode)[] }[] };
  count: number;
}) {
  const Icon = section.icon;
  return (
    <>
      <tr>
        <td colSpan={count + 1} className="bg-surface-muted/40 px-4 py-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Icon className="h-3.5 w-3.5" /> {section.title}
          </span>
        </td>
      </tr>
      {section.rows.map((row, i) => (
        <tr key={row.label} className={i % 2 === 0 ? '' : 'bg-surface-muted/20'}>
          <td className="px-4 py-2.5 text-sm font-medium text-muted-foreground">{row.label}</td>
          {row.cells.map((cell, j) => (
            <td key={j} className="px-4 py-2.5 text-sm text-foreground">
              {typeof cell === 'string' ? cell : cell}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function MobileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}

function Step({
  n, icon: Icon, title, description,
}: {
  n: number; icon: React.ComponentType<{ className?: string }>; title: string; description: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted/30 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" /> {title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}
