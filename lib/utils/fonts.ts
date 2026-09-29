import { GeistMono } from 'geist/font/mono';
import { Inter, Sora } from 'next/font/google';

/**
 * Tipografías de Talnet, las del manual de marca (2026):
 *
 * - Sora, la principal: titulares, cifras y todo lo que lleve `font-display`.
 *   Es la misma que el manual pone junto al logotipo en las submarcas.
 * - Inter, la secundaria: el texto corrido y la interfaz. Es la que mejor
 *   aguanta tamaños pequeños en el panel, que es donde más texto hay.
 *
 * Sora no tiene cursiva. Si alguna vez hace falta enfatizar dentro de un
 * titular, con color, nunca con `italic`: el navegador la inclinaría a la
 * fuerza y se ve mal.
 *
 * Geist Mono se queda solo para lo monoespaciado (referencias, códigos).
 */
export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // La cursiva real, para los pocos textos en `italic` («guardando…», notas).
  // Solo se descarga si alguna vista la usa.
  style: ['normal', 'italic'],
});

export const geistMono = GeistMono;

/** Clases con las variables de las tres fuentes, para el <html> del layout raíz. */
export const fontVariables = [sora.variable, inter.variable, geistMono.variable].join(' ');
