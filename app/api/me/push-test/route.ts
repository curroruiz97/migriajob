import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { pushToUser } from '@/lib/push/send';
import { pushConfigured } from '@/lib/push/apns';

/**
 * Envia una notificacion de prueba al propio usuario.
 *
 * Por que existe y por que se queda: sin esto, comprobar que las push llegan
 * obliga a montar el evento real que las dispara (una busqueda guardada, su
 * alerta activada y el proceso programado ejecutado a mano). Demasiado rodeo
 * para responder a "no me llegan los avisos", que es una incidencia que se
 * repetira.
 *
 * Es segura en produccion: exige sesion y solo puede enviarse a uno mismo. No
 * acepta destinatario, asi que no sirve para molestar a nadie.
 */
export async function POST() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  if (!pushConfigured()) {
    return NextResponse.json(
      { error: 'Faltan las variables APNS_* en el servidor' },
      { status: 500 }
    );
  }

  const { data: dispositivos } = await supabase
    .from('device_tokens')
    .select('id')
    .eq('user_id', user.id);

  const cuantos = dispositivos?.length ?? 0;
  if (cuantos === 0) {
    return NextResponse.json(
      { error: 'No tienes ningun dispositivo registrado' },
      { status: 404 }
    );
  }

  await pushToUser(user.id, {
    title: 'MigriaJob',
    body: 'Notificación de prueba. Si la estás viendo, todo funciona.',
    link: '/dashboard',
  });

  // pushToUser nunca lanza: los fallos de envio quedan en los registros del
  // servidor. Devolvemos a cuantos dispositivos se ha intentado.
  return NextResponse.json({ ok: true, dispositivos: cuantos });
}
