import { EnchargeProvider } from './providers/encharge';
import type { EmailProvider } from './types';

// Instancia perezosa: no construir el provider al importar el módulo, para que
// `next build` (que evalúa los módulos al recolectar page data) no falle si
// faltan env vars. Se crea en la primera llamada real, ya en runtime.
let instance: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (!instance) {
    instance = new EnchargeProvider();
  }
  return instance;
}

// Export types for convenience
export * from './types';
