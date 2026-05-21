import { redirect } from 'next/navigation';

// Ruta antigua → nueva pantalla "Solicitudes" (acceso directo, con tabs).
export default function MisAplicacionesRedirect() {
  redirect('/dashboard/solicitudes');
}
