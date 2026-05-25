'use client';

/**
 * DateWheelPicker — selector de fecha estilo iOS con ruedas táctiles.
 *
 * Render como botón ("dd MMM yyyy" o "—") que abre un bottom-sheet con
 * 2 o 3 ruedas (día/mes/año) con scroll-snap. El valor expuesto es un
 * string ISO sin horas: "YYYY-MM-DD" para mode='date', "YYYY-MM" para mode='month'.
 *
 * Incluye:
 * - <input type="hidden" name=...> para que se envíe con `<form action={...}>`.
 * - Banda central destacada que indica el valor seleccionado.
 * - Click en cualquier ítem para centrarlo (alternativa al scroll).
 *
 * Decisión: implementación sin dependencias externas usando scroll-snap nativo
 * (mejor en WebView Android, sin gestos custom). El "haptic" se simula con
 * navigator.vibrate(5) en cada cambio si el dispositivo lo soporta.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Mode = 'date' | 'month';

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MONTHS_ABBR = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const ITEM_H = 40;     // alto de cada item en px
const VISIBLE = 5;     // items visibles en la rueda (impar para tener centro)
const HALF = Math.floor(VISIBLE / 2);

export interface DateWheelPickerProps {
  /** ISO: "YYYY-MM-DD" (date) o "YYYY-MM" (month). Vacío = sin valor. */
  value: string;
  onChange: (next: string) => void;
  /** name para inyectar input hidden y poder usarse en forms. */
  name?: string;
  mode?: Mode;
  /** Año mínimo permitido. Por defecto: 1925 (date) o currentYear-50 (month). */
  minYear?: number;
  /** Año máximo. Por defecto: currentYear (date) o currentYear+5 (month). */
  maxYear?: number;
  placeholder?: string;
  /** Deshabilitar interacción. */
  disabled?: boolean;
  className?: string;
  /** Etiqueta visible si quieres usarlo standalone (usualmente lo provee el FieldEl padre). */
  label?: string;
}

export function DateWheelPicker({
  value,
  onChange,
  name,
  mode = 'date',
  minYear,
  maxYear,
  placeholder = 'Seleccionar fecha',
  disabled = false,
  className,
  label,
}: DateWheelPickerProps) {
  const today = new Date();
  const yMax = maxYear ?? (mode === 'date' ? today.getFullYear() : today.getFullYear() + 5);
  const yMin = minYear ?? (mode === 'date' ? 1925 : today.getFullYear() - 50);

  const [open, setOpen] = useState(false);
  const parsed = parseValue(value, mode);
  // Valores temporales en el modal (no se aplican hasta pulsar "Aceptar").
  const [tmpYear, setTmpYear] = useState<number>(parsed.year ?? today.getFullYear());
  const [tmpMonth, setTmpMonth] = useState<number>(parsed.month ?? today.getMonth() + 1);
  const [tmpDay, setTmpDay] = useState<number>(parsed.day ?? today.getDate());

  // Cuando se abre, sincronizar con el value actual.
  useEffect(() => {
    if (open) {
      const p = parseValue(value, mode);
      setTmpYear(p.year ?? today.getFullYear());
      setTmpMonth(p.month ?? today.getMonth() + 1);
      setTmpDay(p.day ?? today.getDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const years = useMemo(() => range(yMin, yMax), [yMin, yMax]);
  const months = useMemo(() => range(1, 12), []);
  const daysInMonth = useMemo(() => new Date(tmpYear, tmpMonth, 0).getDate(), [tmpYear, tmpMonth]);
  const days = useMemo(() => range(1, daysInMonth), [daysInMonth]);

  // Si el día actual no existe en el nuevo mes (p.ej. 31 → febrero), recortar.
  useEffect(() => {
    if (tmpDay > daysInMonth) setTmpDay(daysInMonth);
  }, [daysInMonth, tmpDay]);

  const accept = () => {
    const yyyy = String(tmpYear).padStart(4, '0');
    const mm = String(tmpMonth).padStart(2, '0');
    if (mode === 'date') {
      const dd = String(tmpDay).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    } else {
      onChange(`${yyyy}-${mm}`);
    }
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setOpen(false);
  };

  const labelText = formatValue(value, mode, placeholder);

  return (
    <>
      {/* Input oculto para integrarse en formularios estándar (action={...}) */}
      {name && <input type="hidden" name={name} value={value} />}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-label={label ?? 'Seleccionar fecha'}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          !value && 'text-muted-foreground',
          className
        )}
      >
        <span className="truncate">{labelText}</span>
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label ?? 'Seleccionar fecha'}
          className="fixed inset-0 z-[60]"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 animate-in fade-in-0"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-3xl border-t border-border bg-background pb-[max(env(safe-area-inset-bottom),12px)] shadow-2xl animate-in slide-in-from-bottom duration-200">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="text-sm font-semibold text-foreground">
                {label ?? (mode === 'date' ? 'Fecha' : 'Mes y año')}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/*
              Contenedor sin padding interno arriba: la banda central se posiciona
              respecto al wrapper de ruedas (no respecto a un padre con padding),
              así queda perfectamente alineada con la fila central de cada wheel
              (que está a HALF * ITEM_H del top por su propio padding).
            */}
            <div className="px-4 py-4">
              <div className="relative">
                {/* Banda central que marca la selección */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 z-0 rounded-xl bg-primary-soft/60 ring-1 ring-primary/20"
                  style={{ top: ITEM_H * HALF, height: ITEM_H }}
                />
                <div className="relative z-10 flex gap-2">
                  {mode === 'date' && (
                    <Wheel
                      items={days}
                      value={tmpDay}
                      onChange={setTmpDay}
                      format={(n) => String(n)}
                      ariaLabel="Día"
                    />
                  )}
                  <Wheel
                    items={months}
                    value={tmpMonth}
                    onChange={setTmpMonth}
                    format={(n) => (mode === 'date' ? MONTHS_ABBR[n - 1] : MONTHS_ES[n - 1])}
                    ariaLabel="Mes"
                    flexGrow={mode === 'month' ? 2 : 1.5}
                  />
                  <Wheel
                    items={years}
                    value={tmpYear}
                    onChange={setTmpYear}
                    format={(n) => String(n)}
                    ariaLabel="Año"
                    flexGrow={1.4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2 border-t border-border px-4 pt-3">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl text-muted-foreground"
                  onClick={clear}
                >
                  Borrar
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="ml-auto rounded-xl"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" className="rounded-xl" onClick={accept}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────────────────── helpers ───────────────────────── */

function Wheel<T extends number>({
  items,
  value,
  onChange,
  format,
  ariaLabel,
  flexGrow = 1,
}: {
  items: T[];
  value: T;
  onChange: (next: T) => void;
  format: (item: T) => string;
  ariaLabel: string;
  flexGrow?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);
  const lastValue = useRef<T>(value);

  // Centra el item correspondiente al value al montar / cuando cambia.
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx >= 0 && ref.current) {
      // No usar smooth aquí, evita "saltos" cuando otros wheels cambian items.
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, [value, items]);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      if (!ref.current) return;
      const i = Math.round(ref.current.scrollTop / ITEM_H);
      const next = items[i];
      if (next != null && next !== lastValue.current) {
        lastValue.current = next;
        // Vibración suave (Android). En iOS WebView no hace nada, no es crítico.
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(5); } catch { /* noop */ }
        }
        onChange(next);
      }
    }, 80);
  }, [items, onChange]);

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={handleScroll}
      className="hide-scrollbar relative overflow-y-scroll"
      style={{
        flexGrow,
        flexBasis: 0,
        height: ITEM_H * VISIBLE,
        scrollSnapType: 'y mandatory',
        // Mejora la inercia táctil en iOS/Android WebView
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Padding superior e inferior para que primer/último item se centren */}
      <div style={{ height: ITEM_H * HALF }} aria-hidden />
      {items.map((it) => (
        <button
          key={String(it)}
          type="button"
          role="option"
          aria-selected={it === value}
          onClick={() => {
            const idx = items.indexOf(it);
            ref.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
            // setState se dispara via onScroll cuando se asienta.
          }}
          style={{
            height: ITEM_H,
            scrollSnapAlign: 'center',
            scrollSnapStop: 'always',
          }}
          className={cn(
            'flex w-full items-center justify-center text-base transition-all',
            it === value
              ? 'font-semibold text-foreground'
              : 'text-muted-foreground/60'
          )}
        >
          {format(it)}
        </button>
      ))}
      <div style={{ height: ITEM_H * HALF }} aria-hidden />
    </div>
  );
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  if (start <= end) for (let i = start; i <= end; i++) out.push(i);
  else for (let i = start; i >= end; i--) out.push(i);
  return out;
}

function parseValue(v: string, mode: Mode): { year: number | null; month: number | null; day: number | null } {
  if (!v) return { year: null, month: null, day: null };
  const m = mode === 'date'
    ? /^(\d{4})-(\d{2})-(\d{2})/.exec(v)
    : /^(\d{4})-(\d{2})/.exec(v);
  if (!m) return { year: null, month: null, day: null };
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: mode === 'date' ? Number(m[3]) : null,
  };
}

function formatValue(v: string, mode: Mode, placeholder: string): string {
  const p = parseValue(v, mode);
  if (p.year == null || p.month == null) return placeholder;
  if (mode === 'date' && p.day != null) {
    return `${p.day} ${MONTHS_ES[p.month - 1]} ${p.year}`;
  }
  return `${MONTHS_ES[p.month - 1]} ${p.year}`;
}
