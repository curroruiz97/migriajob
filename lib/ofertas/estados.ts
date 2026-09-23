/**
 * Los estados que admite una oferta, que son los del enum `job_status` de la
 * base. Viven aquí y no dentro de la server action para poder comprobarlos en
 * una prueba: un fichero 'use server' solo puede exportar funciones.
 *
 * Faltaban 'draft' y 'expired', y la consecuencia era fea. El formulario manda
 * el estado actual en un campo oculto; al guardar un borrador, la validación no
 * reconocía 'draft' y lo tiraba al valor por defecto, que era 'published'.
 * Editar una oferta en borrador la publicaba, sin avisar.
 */
export const ESTADOS_DE_OFERTA = ['draft', 'published', 'paused', 'expired', 'archived'] as const;

export type JobStatus = (typeof ESTADOS_DE_OFERTA)[number];

/**
 * Ante un valor que no se reconoce, borrador. Publicar algo que nadie ha pedido
 * publicar es el peor desenlace posible, así que el valor de reserva es el
 * inocuo, no el visible.
 */
export function normalizarEstado(valor: unknown): JobStatus {
  return ESTADOS_DE_OFERTA.includes(valor as JobStatus) ? (valor as JobStatus) : 'draft';
}
