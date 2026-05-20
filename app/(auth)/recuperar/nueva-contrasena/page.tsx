import { NuevaContrasenaForm } from './nueva-contrasena-form';

export const metadata = { title: 'Nueva contraseña' };

export default function NuevaContrasenaPage() {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Define tu nueva contraseña
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mínimo 8 caracteres. Tras guardarla iniciarás sesión automáticamente.
        </p>
      </div>
      <NuevaContrasenaForm />
    </div>
  );
}
