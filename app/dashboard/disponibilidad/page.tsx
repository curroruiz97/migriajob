import { redirect } from 'next/navigation';

// El toggle de disponibilidad ahora vive dentro de "Mi perfil".
export default function DisponibilidadRedirect() {
  redirect('/dashboard/mi-perfil');
}
