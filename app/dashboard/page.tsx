import { redirect } from 'next/navigation';

export default function DashboardIndex() {
  // Pantalla de inicio del candidato: Ofertas.
  redirect('/dashboard/ofertas');
}
