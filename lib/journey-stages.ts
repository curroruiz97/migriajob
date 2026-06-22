/**
 * Definición centralizada de las 11 etapas del proceso migratorio.
 * Compartida entre la vista candidato y el panel admin.
 */

export const JOURNEY_STAGES = [
  {
    key: 'seleccionado',
    number: 1,
    title: '¡Felicitaciones! Has sido seleccionado',
    subtitle: 'La empresa ha decidido avanzar contigo.',
    description: 'Tu perfil ha sido seleccionado por una empresa española. A partir de ahora nuestro equipo trabajará para preparar todo lo necesario para tu incorporación.',
    icon: 'Trophy',
  },
  {
    key: 'inicio_proceso',
    number: 2,
    title: 'Inicio del proceso migratorio',
    subtitle: 'Estamos preparando toda la documentación necesaria.',
    description: 'Hemos comenzado a recopilar y preparar la documentación requerida para tu expediente migratorio. Te iremos solicitando los documentos que necesitemos.',
    icon: 'FileText',
  },
  {
    key: 'expediente_presentado',
    number: 3,
    title: 'Expediente presentado',
    subtitle: 'La solicitud ya fue presentada ante las autoridades.',
    description: 'Tu expediente ha sido presentado oficialmente ante la oficina de Extranjería. A partir de este momento comienza el periodo de evaluación por parte de las autoridades.',
    icon: 'Send',
  },
  {
    key: 'revision_administrativa',
    number: 4,
    title: 'Revisión administrativa',
    subtitle: 'Las autoridades están verificando la documentación.',
    description: 'Las autoridades de Extranjería están revisando que toda la documentación presentada esté completa y cumpla con los requisitos establecidos.',
    icon: 'ClipboardCheck',
  },
  {
    key: 'evaluacion_expediente',
    number: 5,
    title: 'Evaluación del expediente',
    subtitle: 'El expediente continúa su proceso normal de evaluación.',
    description: 'Tu expediente se encuentra en la fase de evaluación. Este es un proceso estándar que puede tomar varias semanas. Estamos atentos a cualquier requerimiento adicional.',
    icon: 'Search',
  },
  {
    key: 'coordinacion_incorporacion',
    number: 6,
    title: 'Coordinación de incorporación',
    subtitle: 'Seguimos trabajando junto a la empresa para tu futura incorporación.',
    description: 'Mientras el expediente avanza, estamos coordinando con la empresa los detalles de tu futura incorporación laboral.',
    icon: 'Handshake',
  },
  {
    key: 'esperando_resolucion',
    number: 7,
    title: 'Esperando resolución oficial',
    subtitle: 'Tu expediente se encuentra en la etapa final del proceso administrativo.',
    description: 'El expediente está en las últimas fases de evaluación. La resolución oficial debería emitirse próximamente.',
    icon: 'Clock',
  },
  {
    key: 'resolucion_favorable',
    number: 8,
    title: '¡Resolución favorable!',
    subtitle: 'Excelentes noticias. Tu solicitud ha sido aprobada.',
    description: '¡Enhorabuena! La resolución de tu expediente ha sido favorable. Ahora procederemos con los trámites consulares necesarios para obtener tu visado.',
    icon: 'CheckCircle',
  },
  {
    key: 'gestion_consular',
    number: 9,
    title: 'Gestión consular',
    subtitle: 'Preparación de cita y trámites consulares.',
    description: 'Estamos gestionando tu cita en el consulado y preparando toda la documentación necesaria para la obtención de tu visado.',
    icon: 'Building',
  },
  {
    key: 'preparando_viaje',
    number: 10,
    title: 'Preparando tu viaje',
    subtitle: 'Estamos coordinando los últimos detalles de tu incorporación.',
    description: 'Ya casi estamos. Estamos coordinando los detalles finales: vuelo, alojamiento inicial y todo lo necesario para tu llegada a España.',
    icon: 'Plane',
  },
  {
    key: 'bienvenido',
    number: 11,
    title: '¡Bienvenido a España!',
    subtitle: 'Tu proceso migratorio ha concluido exitosamente.',
    description: '¡Felicidades! Has completado todo el proceso migratorio. Bienvenido a España y a tu nueva etapa profesional. El equipo de Migria te desea todo el éxito.',
    icon: 'PartyPopper',
  },
] as const;

export type JourneyStageKey = (typeof JOURNEY_STAGES)[number]['key'];

/** Devuelve el índice (0-based) de una etapa dada su key */
export function getStageIndex(key: string): number {
  return JOURNEY_STAGES.findIndex((s) => s.key === key);
}

/** Devuelve la definición de una etapa por su key */
export function getStageByKey(key: string) {
  return JOURNEY_STAGES.find((s) => s.key === key);
}

/** Calcula el porcentaje de progreso (0-100) */
export function getStageProgress(key: string): number {
  const idx = getStageIndex(key);
  if (idx < 0) return 0;
  return Math.round((idx / (JOURNEY_STAGES.length - 1)) * 100);
}
