export const metadata = {
  title: 'Términos y condiciones',
  description: 'Términos y condiciones de uso de Migria.',
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 prose prose-zinc dark:prose-invert">
      <h1>Términos y condiciones</h1>
      <p className="lead">Última actualización: 10 de mayo de 2026</p>

      <h2>1. Aceptación</h2>
      <p>
        Al crear una cuenta en Migria aceptas estos términos. Si no estás de acuerdo, no uses
        el servicio.
      </p>

      <h2>2. Tipos de cuenta</h2>
      <ul>
        <li><strong>Candidato:</strong> profesional que crea un perfil para ser descubierto por empresas.</li>
        <li><strong>Empleador:</strong> empresa o reclutador que busca y contacta candidatos.</li>
      </ul>

      <h2>3. Tu contenido</h2>
      <p>
        Conservas la propiedad de la información que publicas. Al publicarla nos otorgas una
        licencia mundial, no exclusiva y gratuita para mostrarla en Migria con la finalidad
        del servicio. Eres responsable de la veracidad de tu perfil.
      </p>

      <h2>4. Conducta prohibida</h2>
      <ul>
        <li>Suplantar identidad o falsear información.</li>
        <li>Discriminar candidatos por motivos protegidos por la ley.</li>
        <li>Hacer scraping masivo o uso automatizado no autorizado del servicio.</li>
        <li>Enviar mensajes no solicitados (spam) o contenido ilegal.</li>
        <li>Cualquier intento de saltarse las medidas de seguridad o RLS.</li>
      </ul>

      <h2>5. Tarifas</h2>
      <p>
        Migria ofrece un plan gratuito y planes de pago (Pro y Enterprise). Las tarifas y
        condiciones se publican en <a href="/planes-y-precios">Planes y precios</a>. Las
        suscripciones se renuevan automáticamente salvo cancelación con 7 días de antelación.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        Migria es una plataforma de conexión. NO somos parte de la relación laboral entre
        candidatos y empresas. No garantizamos contrataciones ni el comportamiento de los
        usuarios. Nuestra responsabilidad máxima se limita al importe pagado por el cliente
        en los 12 meses previos.
      </p>

      <h2>7. Cancelación de cuenta</h2>
      <p>
        Puedes eliminar tu cuenta en cualquier momento desde <code>/dashboard/configuracion</code>.
        Migria puede suspender cuentas que infrinjan estos términos.
      </p>

      <h2>8. Ley aplicable</h2>
      <p>
        Estos términos se rigen por la legislación española. Cualquier conflicto se someterá
        a los juzgados de Madrid, salvo que la ley aplicable al consumidor exija otra
        jurisdicción.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para dudas sobre estos términos: <a href="mailto:legal@migria.app">legal@migria.app</a>.
      </p>
    </article>
  );
}
