'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { updateProfileAction, updateAvailabilityAction } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfilePanelProps {
  defaults: {
    fullName: string;
    phone: string;
    headline: string;
    currentRole: string;
    bio: string;
    yearsExperience: string;
    desiredSalaryMin: string;
    skills: string;
    locationCity: string;
    locationCountry: string;
    languages: string;
  };
  availability: 'open' | 'passive' | 'closed';
  isPublic: boolean;
  hasAvatar: boolean;
  hasCv: boolean;
  hasExperience: boolean;
}

export function ProfilePanel({
  defaults,
  availability: initialAvailability,
  isPublic: initialIsPublic,
  hasAvatar,
  hasCv,
  hasExperience,
}: ProfilePanelProps) {
  const router = useRouter();
  const [form, setForm] = useState(defaults);
  const [available, setAvailable] = useState(initialAvailability !== 'closed');
  const [savingAvail, startAvailTransition] = useTransition();
  const [saving, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── Progreso REACTIVO (se recalcula al escribir cualquier campo) ──
  const { score, items } = useMemo(() => {
    const skillsCount = form.skills.split(',').map((s) => s.trim()).filter(Boolean).length;
    const langCount = form.languages.split(',').map((s) => s.trim()).filter(Boolean).length;
    const its = [
      { label: 'Foto de perfil', done: hasAvatar, weight: 10 },
      { label: 'Titular profesional', done: form.headline.trim().length > 5, weight: 10 },
      { label: 'Sobre mí (>50 caracteres)', done: form.bio.trim().length > 50, weight: 15 },
      { label: 'Al menos 1 habilidad', done: skillsCount > 0, weight: 15 },
      { label: 'Experiencia profesional', done: hasExperience, weight: 10 },
      { label: 'Idiomas', done: langCount > 0, weight: 10 },
      { label: 'Años de experiencia', done: form.yearsExperience.trim() !== '', weight: 5 },
      { label: 'Salario esperado', done: form.desiredSalaryMin.trim() !== '', weight: 5 },
      { label: 'Ubicación (ciudad)', done: form.locationCity.trim() !== '', weight: 5 },
      { label: 'CV en PDF', done: hasCv, weight: 15 },
    ];
    return { score: its.reduce((s, i) => s + (i.done ? i.weight : 0), 0), items: its };
  }, [form, hasAvatar, hasCv, hasExperience]);

  const next = items.find((i) => !i.done);

  const submit = () => {
    startTransition(async () => {
      const fd = new FormData();
      for (const [k, v] of Object.entries(form)) fd.set(k, v);
      const res = await updateProfileAction(null, fd);
      if (!res || !('error' in res)) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };

  const toggleAvailability = (checked: boolean) => {
    setAvailable(checked);
    startAvailTransition(async () => {
      await updateAvailabilityAction(checked ? 'open' : 'closed', checked);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Progreso reactivo */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-foreground">Progreso del perfil</h2>
          <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'soft'}>{score}%</Badge>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-primary'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        {next ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Siguiente paso: <span className="font-medium text-foreground">{next.label}</span>
          </p>
        ) : (
          <p className="mt-3 text-xs font-medium text-success">¡Perfil completo! 🎉</p>
        )}
        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
          {items.map((i) => (
            <li key={i.label} className="flex items-center gap-2 text-xs">
              {i.done ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              )}
              <span className={i.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
                {i.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disponibilidad (sustituye al tab) */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {available ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              Disponible para nuevas ofertas
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {available
                ? 'Tu perfil es visible y las empresas pueden contactarte.'
                : 'Tu perfil está oculto. No recibirás propuestas.'}
              {savingAvail && <span className="ml-2 italic">guardando…</span>}
            </p>
          </div>
          <Switch checked={available} onCheckedChange={toggleAvailability} disabled={savingAvail} />
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        {saved && (
          <div className="rounded-xl border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
            Perfil actualizado.
          </div>
        )}

        <Section title="Datos personales">
          <Field label="Nombre completo">
            <Input value={form.fullName} onChange={set('fullName')} required />
          </Field>
          <Field label="Teléfono (opcional)">
            <Input value={form.phone} onChange={set('phone')} type="tel" />
          </Field>
        </Section>

        <Separator />

        <Section title="Perfil profesional">
          <Field label="Titular (headline)">
            <Input value={form.headline} onChange={set('headline')} placeholder="Cocinero | 5 años de experiencia" />
          </Field>
          <Field label="Rol actual">
            <Input value={form.currentRole} onChange={set('currentRole')} placeholder="Cocinero en Restaurante X" />
          </Field>
          <Field label="Sobre mí" full>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Cuenta tu trayectoria, especialidad e intereses."
            />
          </Field>
        </Section>

        <Separator />

        <Section title="Experiencia y expectativas">
          <Field label="Años de experiencia">
            <Input value={form.yearsExperience} onChange={set('yearsExperience')} type="number" min={0} max={50} />
          </Field>
          <Field label="Salario esperado (€/año, mínimo)">
            <Input value={form.desiredSalaryMin} onChange={set('desiredSalaryMin')} type="number" min={0} step={1000} />
          </Field>
          <Field label="Habilidades (separadas por comas)" full>
            <Input value={form.skills} onChange={set('skills')} placeholder="Cocina española, APPCC, repostería" />
          </Field>
          <Field label="Idiomas (separados por comas)" full>
            <Input
              value={form.languages}
              onChange={set('languages')}
              placeholder="Español (nativo), Inglés (B2), Catalán (básico)"
            />
          </Field>
        </Section>

        <Separator />

        <Section title="Ubicación y disponibilidad geográfica">
          <Field label="Ciudad">
            <Input value={form.locationCity} onChange={set('locationCity')} placeholder="Madrid" />
          </Field>
          <Field label="País">
            <Input value={form.locationCountry} onChange={set('locationCountry')} placeholder="España" />
          </Field>
        </Section>

        <div className="flex justify-end">
          <Button onClick={submit} disabled={saving} className="rounded-xl">
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* Acceso a Configuración (sustituye al tab "Más") */}
      <Link
        href="/dashboard/configuracion"
        className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-foreground">
          <Settings className="h-4 w-4 text-muted-foreground" />
          Configuración de la cuenta
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'space-y-1.5 sm:col-span-2' : 'space-y-1.5'}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
