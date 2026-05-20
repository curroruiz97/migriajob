export const metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Migria recopila, usa y protege tus datos personales.',
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 prose prose-zinc dark:prose-invert">
      <h1>Política de privacidad</h1>
      <p className="lead">Última actualización: 10 de mayo de 2026</p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Migria SaaS — en adelante "Migria" o "nosotros" — es el responsable del tratamiento
        de los datos personales que se recogen a través de esta plataforma. Puedes contactarnos
        en <a href="mailto:privacidad@migria.app">privacidad@migria.app</a>.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <ul>
        <li><strong>Datos de cuenta:</strong> email, nombre, contraseña cifrada.</li>
        <li><strong>Perfil profesional (candidatos):</strong> headline, biografía, experiencia, formación,
          habilidades, idiomas, salario esperado, ubicación, CV, foto, redes profesionales.</li>
        <li><strong>Datos de empresa (empleadores):</strong> nombre, sector, tamaño, ubicación, web.</li>
        <li><strong>Datos de uso:</strong> búsquedas, candidatos guardados, mensajes intercambiados,
          procesos de selección.</li>
        <li><strong>Datos técnicos:</strong> dirección IP (anonimizada), navegador, sistema operativo.</li>
      </ul>

      <h2>3. Finalidad y base legal</h2>
      <ul>
        <li><strong>Prestación del servicio</strong> (ejecución de contrato): gestión de cuenta,
          búsqueda de talento, mensajería, procesos de selección.</li>
        <li><strong>Notificaciones por email</strong> (interés legítimo): nuevos mensajes,
          alertas de búsquedas guardadas, cambios de estado en procesos.</li>
        <li><strong>Mejora del producto</strong> (interés legítimo): métricas agregadas y anonimizadas.</li>
        <li><strong>Cumplimiento legal:</strong> facturación, atender requerimientos administrativos.</li>
      </ul>

      <h2>4. Plazos de conservación</h2>
      <p>
        Conservamos tus datos mientras tu cuenta esté activa. Si la eliminas, los datos se borran
        en un plazo máximo de 30 días, salvo aquellos que estemos obligados a conservar por ley
        (facturación, 6 años).
      </p>

      <h2>5. Compartimos datos con</h2>
      <ul>
        <li><strong>Supabase Inc.</strong> (hosting BD y auth, región Irlanda).</li>
        <li><strong>Vercel Inc.</strong> (hosting de la aplicación).</li>
        <li><strong>Resend</strong> (envío de emails transaccionales).</li>
        <li><strong>Stripe</strong> (procesamiento de pagos cuando proceda).</li>
      </ul>
      <p>
        Todos los proveedores son DPA-compliant y la mayoría de los datos no abandonan la UE.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Como titular de los datos, tienes derecho a acceso, rectificación, supresión, oposición,
        limitación y portabilidad. Para ejercerlos:
      </p>
      <ul>
        <li>Acceso y rectificación: directamente desde <code>/dashboard/configuracion</code>.</li>
        <li>Portabilidad: botón "Exportar mis datos" en <code>/dashboard/configuracion</code>.</li>
        <li>Supresión: botón "Eliminar cuenta" en <code>/dashboard/configuracion</code>.</li>
        <li>Cualquier otra solicitud: <a href="mailto:privacidad@migria.app">privacidad@migria.app</a>.</li>
      </ul>
      <p>
        Si crees que hemos infringido tus derechos puedes presentar reclamación ante la Agencia
        Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos Row Level Security a nivel de base de datos, cifrado en tránsito (TLS 1.3) y
        en reposo (AES-256). Las contraseñas se almacenan con hash bcrypt.
      </p>

      <h2>8. Menores</h2>
      <p>
        Migria no está dirigido a menores de 16 años. Si detectas que un menor ha creado cuenta,
        contáctanos para eliminarla.
      </p>

      <h2>9. Cambios</h2>
      <p>
        Te notificaremos por email cualquier cambio sustancial en esta política con al menos
        30 días de antelación.
      </p>
    </article>
  );
}
