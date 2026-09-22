/**
 * Cómo puede acabar un expediente, y por qué.
 *
 * Vive aparte de lib/db/metricas.ts porque esto lo necesitan también los
 * componentes del navegador —el desplegable donde se elige el motivo—, y aquel
 * fichero es de servidor. Aquí no hay consultas: solo las etiquetas.
 *
 * Los motivos son una lista cerrada a propósito. En texto libre cada uno
 * escribe lo suyo y luego no hay nada que contar; el matiz va en la nota.
 * Si se añade uno, hay que añadirlo también al tipo `journey_close_reason` de
 * la base de datos, o el guardado falla.
 */

export type Desenlace = 'en_curso' | 'incorporado' | 'cerrado';

export const MOTIVOS_DE_CIERRE: Record<string, string> = {
  renuncia_candidato: 'El candidato renuncia',
  denegacion_extranjeria: 'Extranjería deniega',
  denegacion_visado: 'Visado denegado',
  empresa_retira: 'La empresa se retira',
  documentacion_incompleta: 'Documentación incompleta',
  no_supera_medico: 'No supera el reconocimiento médico',
  perdida_contacto: 'Se pierde el contacto',
  no_incorporacion: 'Llega y no se incorpora',
  baja_temprana: 'Baja dentro de la garantía',
  otro: 'Otro',
};
