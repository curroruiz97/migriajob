import 'server-only';

/**
 * Wrapper para server actions: convierte cualquier excepción en
 * `{ error: string }` excepto los redirect/notFound de Next, que se re-lanzan.
 */
export async function safeAction<T>(
  fn: () => Promise<T>
): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (e: unknown) {
    // Re-lanzar redirects/notFound de Next
    if (
      e instanceof Error &&
      ('digest' in e || e.message === 'NEXT_REDIRECT' || e.message === 'NEXT_NOT_FOUND')
    ) {
      throw e;
    }
    const message =
      e instanceof Error ? e.message : 'Algo ha ido mal. Inténtalo de nuevo.';
    return { error: message };
  }
}
