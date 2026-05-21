'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  X,
  Plus,
  Trash2,
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { updateProfileAction, updateAvailabilityAction } from '@/app/dashboard/actions';
import { AvatarUpload, CvUpload } from '@/components/employee/file-uploads';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NACIONALIDADES = [
  'España', 'Perú', 'Colombia', 'Venezuela', 'Ecuador', 'Argentina', 'México',
  'Bolivia', 'Chile', 'República Dominicana', 'Cuba', 'Uruguay', 'Paraguay', 'Otra',
];
const IDIOMAS = ['Español', 'Inglés', 'Francés', 'Portugués', 'Alemán', 'Italiano', 'Catalán', 'Árabe', 'Otro'];
const NIVELES = ['basico', 'intermedio', 'avanzado', 'nativo'] as const;
const NIVEL_LABEL: Record<string, string> = {
  basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado', nativo: 'Nativo',
};
const INCORPORACION = [
  { value: 'inmediata', label: 'Inmediata' },
  { value: '15_dias', label: 'En 15 días' },
  { value: '1_mes', label: 'En 1 mes' },
  { value: '2_meses', label: 'En 2 meses' },
];

type Lang = { language: string; level: string };
type Exp = { position: string; company: string; start_date: string; end_date: string; current: boolean; description: string };

export interface CandidateDefaults {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  nationality: string;
  locationCity: string;
  locationCountry: string;
  headline: string;
  yearsExperience: string;
  skills: string;
  bio: string;
  desiredSalaryMin: string;
  desiredSalaryMax: string;
  preferredLocations: string;
  startAvailability: string;
  willingToRelocate: boolean;
  languages: Lang[];
  experiences: Exp[];
}

export function CandidatePerfil({
  defaults,
  avatarUrl,
  cvUrl,
  initials,
  availability,
  isPublic,
  initialCompletion,
}: {
  defaults: CandidateDefaults;
  avatarUrl: string | null;
  cvUrl: string | null;
  initials: string;
  availability: 'open' | 'passive' | 'closed';
  isPublic: boolean;
  initialCompletion: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialCompletion < 50); // modal semi-obligatorio
  const [form, setForm] = useState({
    fullName: defaults.fullName,
    phone: defaults.phone,
    dateOfBirth: defaults.dateOfBirth,
    nationality: defaults.nationality,
    locationCity: defaults.locationCity,
    locationCountry: defaults.locationCountry,
    headline: defaults.headline,
    yearsExperience: defaults.yearsExperience,
    skills: defaults.skills,
    bio: defaults.bio,
    desiredSalaryMin: defaults.desiredSalaryMin,
    desiredSalaryMax: defaults.desiredSalaryMax,
    preferredLocations: defaults.preferredLocations,
    startAvailability: defaults.startAvailability,
  });
  const [languages, setLanguages] = useState<Lang[]>(defaults.languages.length ? defaults.languages : []);
  const [experiences, setExperiences] = useState<Exp[]>(defaults.experiences);
  const [willingToRelocate, setWillingToRelocate] = useState(defaults.willingToRelocate);
  const [available, setAvailable] = useState(availability !== 'closed');
  const [saving, startSave] = useTransition();
  const [savingAvail, startAvail] = useTransition();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── Progreso REACTIVO ──
  const { score, items } = useMemo(() => {
    const skillsCount = form.skills.split(',').map((s) => s.trim()).filter(Boolean).length;
    const its = [
      { key: 'foto', label: 'Foto de perfil', done: !!avatarUrl, w: 8 },
      { key: 'nombre', label: 'Nombre completo', done: form.fullName.trim().length > 0, w: 8 },
      { key: 'nac', label: 'Fecha de nacimiento', done: form.dateOfBirth.trim() !== '', w: 6 },
      { key: 'nacionalidad', label: 'Nacionalidad', done: form.nationality.trim() !== '', w: 6 },
      { key: 'tel', label: 'Teléfono', done: form.phone.trim() !== '', w: 6 },
      { key: 'ubic', label: 'Ubicación actual', done: form.locationCity.trim() !== '', w: 8 },
      { key: 'titular', label: 'Titular profesional', done: form.headline.trim().length > 4, w: 10 },
      { key: 'anios', label: 'Años de experiencia', done: form.yearsExperience.trim() !== '', w: 6 },
      { key: 'hab', label: 'Habilidades', done: skillsCount > 0, w: 12 },
      { key: 'idiomas', label: 'Idiomas', done: languages.some((l) => l.language && l.level), w: 10 },
      { key: 'incorp', label: 'Disponibilidad de incorporación', done: form.startAvailability.trim() !== '', w: 6 },
      { key: 'cv', label: 'Currículum (PDF)', done: !!cvUrl, w: 14 },
      // Opcionales (bonus)
      { key: 'sobre', label: 'Sobre mí', done: form.bio.trim().length > 0, w: 4, opt: true },
      { key: 'exp', label: 'Experiencia profesional', done: experiences.some((e) => e.position && e.company), w: 4, opt: true },
    ];
    const raw = its.reduce((s, i) => s + (i.done ? i.w : 0), 0);
    return { score: Math.min(100, raw), items: its };
  }, [form, languages, experiences, avatarUrl, cvUrl]);

  const pending = items.filter((i) => !i.done && !i.opt);

  function submit() {
    startSave(async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.set(k, v));
      fd.set('willingToRelocate', String(willingToRelocate));
      fd.set('languages', JSON.stringify(languages.filter((l) => l.language && l.level)));
      fd.set('experiences', JSON.stringify(experiences.filter((e) => e.position && e.company)));
      const res = await updateProfileAction(null, fd);
      if (!res || !('error' in res)) {
        router.refresh();
        setOpen(false);
      }
    });
  }

  function toggleAvailable(v: boolean) {
    setAvailable(v);
    startAvail(async () => {
      await updateAvailabilityAction(v ? 'open' : 'closed', v);
      router.refresh();
    });
  }

  return (
    <>
      {/* ── Pantalla principal: resumen + banner + estado de secciones ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
            <AvatarFallback className="bg-primary-soft text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-foreground">
              {form.fullName || 'Tu nombre'}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {form.headline || 'Añade tu titular profesional'}
            </p>
          </div>
          <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'soft'}>{score}%</Badge>
        </div>

        {score < 100 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-soft px-5 py-3.5 text-left transition-colors hover:bg-primary-soft/70"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium text-primary">
              <AlertTriangle className="h-4 w-4" />
              Tu perfil está al {score}% — Completar perfil
            </span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </button>
        )}

        {/* Disponibilidad */}
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {available ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              Disponible para nuevas ofertas
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {available ? 'Las empresas pueden encontrarte y contactarte.' : 'Tu perfil está oculto.'}
              {savingAvail && <span className="ml-2 italic">guardando…</span>}
            </p>
          </div>
          <Switch checked={available} onCheckedChange={toggleAvailable} disabled={savingAvail} />
        </div>

        {/* Estado de secciones */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Secciones del perfil</h3>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-2 text-xs">
                {i.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />
                )}
                <span className={i.done ? 'text-muted-foreground' : 'text-foreground'}>{i.label}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 w-full rounded-xl">
            Editar perfil
          </Button>
        </div>

        <Link
          href="/dashboard/configuracion"
          className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
            <Settings className="h-4 w-4 text-muted-foreground" /> Configuración de la cuenta
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* ── Modal de completitud (pantalla casi completa, scroll vertical) ── */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Completar perfil">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 animate-in fade-in-0"
          />
          <div className="absolute inset-x-0 bottom-0 top-[5%] flex flex-col overflow-hidden rounded-t-3xl bg-background animate-in slide-in-from-bottom duration-300">
            <header
              className="flex items-center justify-between border-b border-border px-5 py-3"
              style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Completar perfil</p>
                <p className="text-xs text-muted-foreground">{score}% completado</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Barra de progreso */}
            <div className="h-1.5 w-full bg-muted">
              <div
                className={cn('h-full transition-all duration-500', score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-primary')}
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
              {/* Sección 1 */}
              <Section title="Datos personales">
                <AvatarUpload currentUrl={avatarUrl} initials={initials} />
                <Grid>
                  <FieldEl label="Nombre completo"><Input value={form.fullName} onChange={set('fullName')} /></FieldEl>
                  <FieldEl label="Fecha de nacimiento"><Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} /></FieldEl>
                  <FieldEl label="Nacionalidad">
                    <SelectEl value={form.nationality} onChange={set('nationality')}>
                      <option value="">Selecciona…</option>
                      {NACIONALIDADES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </SelectEl>
                  </FieldEl>
                  <FieldEl label="Teléfono"><Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+34 600 000 000" /></FieldEl>
                  <FieldEl label="Email"><Input value={defaults.email} disabled /></FieldEl>
                  <FieldEl label="Ciudad actual"><Input value={form.locationCity} onChange={set('locationCity')} placeholder="Madrid" /></FieldEl>
                  <FieldEl label="País actual"><Input value={form.locationCountry} onChange={set('locationCountry')} placeholder="España" /></FieldEl>
                </Grid>
              </Section>

              <Separator />

              {/* Sección 2 */}
              <Section title="Perfil profesional">
                <Grid>
                  <FieldEl label="Titular profesional" full><Input value={form.headline} onChange={set('headline')} placeholder="Ej: Cocinero con 5 años de experiencia" /></FieldEl>
                  <FieldEl label="Años de experiencia">
                    <SelectEl value={form.yearsExperience} onChange={set('yearsExperience')}>
                      <option value="">Selecciona…</option>
                      {Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i)}>{i === 30 ? '30+' : i}</option>)}
                    </SelectEl>
                  </FieldEl>
                  <FieldEl label="Habilidades (separadas por comas)" full><Input value={form.skills} onChange={set('skills')} placeholder="Cocina española, APPCC, repostería" /></FieldEl>
                </Grid>
                {/* Idiomas dinámicos */}
                <div className="mt-4">
                  <Label>Idiomas</Label>
                  <div className="mt-2 space-y-2">
                    {languages.map((l, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <SelectEl value={l.language} onChange={(e) => setLanguages((arr) => arr.map((x, i) => i === idx ? { ...x, language: e.target.value } : x))}>
                          <option value="">Idioma…</option>
                          {IDIOMAS.map((i) => <option key={i} value={i}>{i}</option>)}
                        </SelectEl>
                        <SelectEl value={l.level} onChange={(e) => setLanguages((arr) => arr.map((x, i) => i === idx ? { ...x, level: e.target.value } : x))}>
                          <option value="">Nivel…</option>
                          {NIVELES.map((n) => <option key={n} value={n}>{NIVEL_LABEL[n]}</option>)}
                        </SelectEl>
                        <button type="button" aria-label="Quitar idioma" onClick={() => setLanguages((arr) => arr.filter((_, i) => i !== idx))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2 rounded-lg" onClick={() => setLanguages((arr) => [...arr, { language: '', level: '' }])}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Añadir idioma
                  </Button>
                </div>
              </Section>

              <Separator />

              {/* Sección 3 */}
              <Section title="Sobre mí">
                <FieldEl label="Descripción personal" full>
                  <textarea value={form.bio} onChange={set('bio')} rows={4} maxLength={500} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Cuenta tu trayectoria e intereses." />
                  <p className="text-right text-[11px] text-muted-foreground">{form.bio.length}/500</p>
                </FieldEl>
              </Section>

              <Separator />

              {/* Sección 4 */}
              <Section title="Experiencia profesional">
                <div className="space-y-3">
                  {experiences.map((ex, idx) => (
                    <div key={idx} className="rounded-xl border border-border p-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input placeholder="Puesto" value={ex.position} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, position: e.target.value } : x))} />
                        <Input placeholder="Empresa" value={ex.company} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, company: e.target.value } : x))} />
                        <Input type="month" value={ex.start_date} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, start_date: e.target.value } : x))} />
                        <Input type="month" value={ex.end_date} disabled={ex.current} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, end_date: e.target.value } : x))} />
                      </div>
                      <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <input type="checkbox" checked={ex.current} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, current: e.target.checked } : x))} className="h-3.5 w-3.5 accent-primary" />
                        Actualmente
                      </label>
                      <textarea placeholder="Descripción breve" value={ex.description} onChange={(e) => setExperiences((a) => a.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} rows={2} className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                      <button type="button" onClick={() => setExperiences((a) => a.filter((_, i) => i !== idx))} className="mt-2 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                        <Trash2 className="h-3 w-3" /> Eliminar
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2 rounded-lg" onClick={() => setExperiences((a) => [...a, { position: '', company: '', start_date: '', end_date: '', current: false, description: '' }])}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Añadir experiencia
                </Button>
              </Section>

              <Separator />

              {/* Sección 5 */}
              <Section title="Preferencias laborales">
                <Grid>
                  <FieldEl label="Salario esperado mínimo (€/mes)"><Input type="number" min={0} step={100} value={form.desiredSalaryMin} onChange={set('desiredSalaryMin')} /></FieldEl>
                  <FieldEl label="Salario esperado máximo (€/mes)"><Input type="number" min={0} step={100} value={form.desiredSalaryMax} onChange={set('desiredSalaryMax')} /></FieldEl>
                  <FieldEl label="Ubicaciones deseadas (separadas por comas)" full><Input value={form.preferredLocations} onChange={set('preferredLocations')} placeholder="Madrid, Barcelona, Valencia" /></FieldEl>
                  <FieldEl label="Disponibilidad de incorporación">
                    <SelectEl value={form.startAvailability} onChange={set('startAvailability')}>
                      <option value="">Selecciona…</option>
                      {INCORPORACION.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </SelectEl>
                  </FieldEl>
                  <FieldEl label="¿Dispuesto a trasladarte?">
                    <div className="flex h-9 items-center">
                      <Switch checked={willingToRelocate} onCheckedChange={setWillingToRelocate} />
                      <span className="ml-2 text-sm text-muted-foreground">{willingToRelocate ? 'Sí' : 'No'}</span>
                    </div>
                  </FieldEl>
                </Grid>
              </Section>

              <Separator />

              {/* Sección 6 */}
              <Section title="Documentación">
                <CvUpload currentUrl={cvUrl} />
              </Section>

              {pending.length > 0 && (
                <p className="text-center text-xs text-muted-foreground">
                  Te faltan {pending.length} campos obligatorios para el 100%.
                </p>
              )}
            </div>

            <div className="border-t border-border p-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}>
              <Button onClick={submit} disabled={saving} className="h-11 w-full rounded-xl text-sm font-semibold">
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function FieldEl({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('space-y-1.5', full && 'sm:col-span-2')}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function SelectEl({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={onChange} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </select>
  );
}
