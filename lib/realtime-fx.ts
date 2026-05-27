'use client';

/**
 * Helpers de feedback para avisos in-app:
 *  - playBeep(): tono corto generado con Web Audio API (sin archivos externos).
 *  - vibrate(ms): pide vibración al sistema (Android lo soporta dentro del WebView).
 *  - bumpTitleBadge(): añade un contador al <title> del documento, tipo
 *    "(3) MigriaJob", que se ve en la pestaña del navegador y se resetea al
 *    volver al foco.
 */

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioCtx) return audioCtx;
  const Ctor =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    audioCtx = new Ctor();
    return audioCtx;
  } catch {
    return null;
  }
}

/** Reproduce un beep corto y agradable (tipo notificación). */
export function playBeep(): void {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, now);
    o.frequency.setValueAtTime(660, now + 0.12);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    o.start(now);
    o.stop(now + 0.4);
  } catch {
    /* noop */
  }
}

/** Vibración en Android (ignorada en iOS / desktop). */
export function vibrate(ms: number | number[] = [60, 40, 60]): void {
  if (typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* noop */
  }
}

let baseTitle: string | null = null;
let pendingCount = 0;
let focusListenerAttached = false;

function ensureBaseTitle(): string {
  if (typeof document === 'undefined') return '';
  if (baseTitle !== null) return baseTitle;
  baseTitle = document.title.replace(/^\(\d+\)\s+/, '');
  return baseTitle;
}

function attachFocusListener() {
  if (focusListenerAttached) return;
  if (typeof window === 'undefined') return;
  focusListenerAttached = true;
  window.addEventListener('focus', () => {
    pendingCount = 0;
    const base = ensureBaseTitle();
    document.title = base;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      pendingCount = 0;
      const base = ensureBaseTitle();
      document.title = base;
    }
  });
}

/** Suma 1 al contador del título si la pestaña/app NO está enfocada. */
export function bumpTitleBadge(): void {
  if (typeof document === 'undefined') return;
  attachFocusListener();
  if (document.visibilityState === 'visible' && document.hasFocus()) return;
  pendingCount += 1;
  const base = ensureBaseTitle();
  document.title = `(${pendingCount}) ${base}`;
}

/** Helper que ejecuta los 3 efectos a la vez. */
export function notifyFx(): void {
  playBeep();
  vibrate();
  bumpTitleBadge();
}
