/**
 * Reduce una imagen en el navegador antes de subirla.
 *
 * POR QUE EXISTE. Una foto hecha con la camara del movil pesa entre 2 y 5 MB.
 * Las server actions de Next aceptan 1 MB por defecto, asi que la peticion se
 * rechazaba antes de llegar al servidor: la comprobacion amable de "maximo
 * 2 MB" nunca llegaba a ejecutarse y al usuario le salia la pantalla de
 * "Algo ha ido mal", que no dice nada. Es lo que le paso al revisor de Apple
 * y a cualquiera que intentara ponerse una foto desde el telefono.
 *
 * Subir el limite del servidor sola no arregla lo importante: nadie necesita
 * mandar 4 MB para un avatar de 64 pixeles, y con datos moviles esa subida
 * tarda y falla. Aqui la imagen se reduce a 1024 px de lado mayor y se
 * reencoda a JPEG: una foto de camara queda en 100-200 KB.
 *
 * De paso resuelve el HEIC. El iPhone puede entregar la foto en ese formato,
 * que el servidor no admite y que fuera de Safari no se ve; el lienzo lo
 * decodifica (Safari sabe) y lo devuelve como JPEG.
 *
 * Si algo falla —formato que el navegador no sabe leer, canvas bloqueado— se
 * devuelve el archivo original y que decida el servidor. Nunca lanza.
 */

const TIPOS_QUE_ACEPTA_EL_SERVIDOR = new Set(['image/png', 'image/jpeg', 'image/webp']);

export async function comprimirImagen(
  file: File,
  { maxLado = 1024, calidad = 0.85 }: { maxLado?: number; calidad?: number } = {}
): Promise<File> {
  if (typeof document === 'undefined') return file;

  let fuente: ImageBitmap | HTMLImageElement | null = null;
  let url: string | null = null;

  try {
    try {
      fuente = await createImageBitmap(file);
    } catch {
      // Safari viejo, o un formato que createImageBitmap no traga: probamos
      // con un <img>, que pasa por el decodificador del sistema.
      url = URL.createObjectURL(file);
      const img = new Image();
      img.decoding = 'async';
      await new Promise<void>((ok, ko) => {
        img.onload = () => ok();
        img.onerror = () => ko(new Error('imagen ilegible'));
        img.src = url as string;
      });
      fuente = img;
    }

    const anchoOriginal = fuente.width;
    const altoOriginal = fuente.height;
    if (!anchoOriginal || !altoOriginal) return file;

    // Solo se reduce, nunca se agranda.
    const escala = Math.min(1, maxLado / Math.max(anchoOriginal, altoOriginal));
    const ancho = Math.max(1, Math.round(anchoOriginal * escala));
    const alto = Math.max(1, Math.round(altoOriginal * escala));

    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext('2d');
    if (!ctx) return file;

    // Fondo blanco antes de pintar: JPEG no tiene transparencia y un PNG con
    // canal alfa saldria con los huecos en negro.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ancho, alto);
    ctx.drawImage(fuente as CanvasImageSource, 0, 0, ancho, alto);

    const blob = await new Promise<Blob | null>((resolver) => {
      lienzo.toBlob(resolver, 'image/jpeg', calidad);
    });
    if (!blob || blob.size === 0) return file;

    // Un JPEG ya pequeno puede salir mas grande al reencodarlo. En ese caso nos
    // quedamos el original, pero solo si el servidor lo admite: un HEIC de
    // 300 KB hay que convertirlo aunque el resultado pese mas.
    if (blob.size >= file.size && TIPOS_QUE_ACEPTA_EL_SERVIDOR.has(file.type)) {
      return file;
    }

    const nombre = file.name.replace(/\.[^.]+$/, '') || 'imagen';
    return new File([blob], `${nombre}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    if (fuente && 'close' in fuente) fuente.close();
    if (url) URL.revokeObjectURL(url);
  }
}
