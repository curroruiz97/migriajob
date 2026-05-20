export const metadata = {
  title: 'Política de cookies',
  description: 'Cómo Migria usa cookies y tecnologías similares.',
};

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 prose prose-zinc dark:prose-invert">
      <h1>Política de cookies</h1>
      <p className="lead">Última actualización: 10 de mayo de 2026</p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador para recordar
        información entre visitas (sesión iniciada, preferencias, etc.).
      </p>

      <h2>Cookies que usa Migria</h2>
      <table>
        <thead>
          <tr><th>Categoría</th><th>Uso</th><th>Duración</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Necesarias</strong></td>
            <td>Sesión Supabase (`sb-*`), CSRF token, preferencia de tema.</td>
            <td>Sesión / 1 año</td>
          </tr>
          <tr>
            <td><strong>Analítica</strong></td>
            <td>Métricas anónimas de uso (solo si aceptas).</td>
            <td>30 días</td>
          </tr>
        </tbody>
      </table>

      <h2>Tu control</h2>
      <p>
        Puedes aceptar o rechazar las cookies analíticas desde el banner que aparece en tu
        primera visita, o cambiar tu elección desde la configuración de tu cuenta.
      </p>
      <p>
        Las cookies necesarias no pueden desactivarse: sin ellas la app no funciona.
      </p>
    </article>
  );
}
