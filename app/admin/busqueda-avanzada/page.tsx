import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Búsqueda avanzada' };

const ROLE_PRESETS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Diseñador UX/UI',
  'Product Manager',
  'Data Engineer',
  'DevOps / SRE',
  'Mobile (iOS/Android)',
];

const INDUSTRIES = ['SaaS', 'Fintech', 'E-commerce', 'Healthtech', 'Edtech', 'Marketplaces'];

export default function BusquedaAvanzadaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Badge variant="outline" className="mb-2">
          <Sparkles className="mr-1 h-3 w-3" /> Beta
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">Búsqueda avanzada</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Construye consultas precisas combinando múltiples criterios.
        </p>
      </div>

      <form action="/admin/candidatos" className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2">
          <Label htmlFor="q">Texto libre</Label>
          <Input id="q" name="q" placeholder="Ej: React Native, PostgreSQL, AWS…" />
          <p className="text-xs text-zinc-500">
            Búsqueda full-text en español sobre el resumen, rol actual y skills.
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Roles más buscados</Label>
          <div className="flex flex-wrap gap-2">
            {ROLE_PRESETS.map((r) => (
              <Button key={r} variant="outline" size="sm" type="button" asChild>
                <Link href={`/admin/candidatos?q=${encodeURIComponent(r)}`}>{r}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sector</Label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <Button key={i} variant="outline" size="sm" type="button" asChild>
                <Link href={`/admin/candidatos?q=${encodeURIComponent(i)}`}>{i}</Link>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input id="city" name="city" placeholder="Madrid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expMin">Experiencia mínima (años)</Label>
            <Input id="expMin" name="expMin" type="number" min={0} max={40} placeholder="3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salario mínimo (€)</Label>
            <Input id="salaryMin" name="salaryMin" type="number" step={1000} placeholder="35000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilidad</Label>
            <select
              id="availability"
              name="availability"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Cualquiera</option>
              <option value="open">Disponible</option>
              <option value="passive">Abierto a oportunidades</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="reset" variant="ghost">
            Limpiar
          </Button>
          <Button type="submit">Buscar candidatos</Button>
        </div>
      </form>
    </div>
  );
}
