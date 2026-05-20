import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * RGPD art. 17 — derecho al olvido.
 * Borra al usuario autenticado (cascada elimina profile, candidate y todo lo asociado).
 *
 * Requiere SUPABASE_SERVICE_ROLE_KEY porque deleteUser() es admin-only.
 */
export async function DELETE() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json(
      { error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' },
      { status: 500 }
    );
  }

  // Llamada directa a Auth Admin API
  const res = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: 'DELETE',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `No se pudo borrar: ${text}` }, { status: 500 });
  }

  // Cerrar sesión local
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
