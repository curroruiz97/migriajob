/**
 * Motivos de denuncia y tipos de contenido denunciable.
 *
 * Vive fuera de `actions.ts` porque en un fichero marcado con 'use server'
 * Next solo admite exportar funciones asíncronas: una constante ahí rompe la
 * compilación.
 */

export const REPORT_TARGETS = [
  'candidate_profile',
  'job',
  'company',
  'message',
  'conversation',
] as const;

export type ReportTarget = (typeof REPORT_TARGETS)[number];

export const REPORT_REASONS = [
  { value: 'fraude', label: 'Oferta falsa, estafa o petición de dinero' },
  { value: 'acoso', label: 'Acoso o amenazas' },
  { value: 'contenido_ofensivo', label: 'Contenido ofensivo o discriminatorio' },
  { value: 'datos_falsos', label: 'Información falsa o engañosa' },
  { value: 'suplantacion', label: 'Suplantación de identidad' },
  { value: 'spam', label: 'Spam o publicidad' },
  { value: 'otro', label: 'Otro motivo' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

export const REPORT_REASON_VALUES = REPORT_REASONS.map((r) => r.value) as readonly string[];

/** Cómo se llama cada tipo de contenido cuando se lo enseñamos a una persona. */
export const TARGET_LABEL: Record<ReportTarget, string> = {
  candidate_profile: 'este perfil',
  job: 'esta oferta',
  company: 'esta empresa',
  message: 'este mensaje',
  conversation: 'esta conversación',
};

/**
 * Correo de moderación, publicado dentro de la app.
 *
 * Apple exige (directriz 1.2) que haya una vía de contacto visible y que
 * alguien la atienda. Usamos la dirección que ya aparece en el resto del
 * producto para no publicar un buzón que nadie mire.
 */
export const MODERATION_EMAIL = 'hola@migriajob.com';
