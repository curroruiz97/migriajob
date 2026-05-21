import { redirect } from 'next/navigation';

// Pantalla de inicio del empleador: gestión de ofertas.
export default function AdminIndex() {
  redirect('/admin/ofertas');
}
