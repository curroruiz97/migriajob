import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Alta y baja del dispositivo del usuario para notificaciones push.
 *
 * POST guarda el token que devuelve APNs. DELETE lo retira; conviene llamarlo
 * al cerrar sesion, o el siguiente que entre en ese telefono recibiria los
 * avisos del anterior.
 */

interface Body {
  token?: unknown;
  platform?: unknown;
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Cuerpo invalido' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const platform = body.platform === 'ios' || body.platform === 'android' ? body.platform : null;

  if (!token || !platform) {
    return NextResponse.json({ error: 'Faltan token o platform' }, { status: 400 });
  }

  // onConflict en `token`: el mismo telefono puede cambiar de dueño (movil
  // prestado, o alguien que cierra sesion y entra con otra cuenta). Reasignamos
  // la fila en lugar de duplicarla, para que los avisos no sigan yendo al
  // usuario anterior.
  const { error } = await supabase
    .from('device_tokens')
    .upsert(
      { user_id: user.id, token, platform, updated_at: new Date().toISOString() },
      { onConflict: 'token' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  let token = '';
  try {
    const body = (await request.json()) as Body;
    token = typeof body.token === 'string' ? body.token.trim() : '';
  } catch {
    /* sin cuerpo: borramos todos los del usuario */
  }

  const query = supabase.from('device_tokens').delete().eq('user_id', user.id);
  const { error } = token ? await query.eq('token', token) : await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
