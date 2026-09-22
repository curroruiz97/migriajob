'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createNotification } from '@/lib/notifications/create';

/**
 * Recogida de las consultas de /contacto.
 *
 * Sustituye al `action="mailto:"` que tenía el formulario, que no enviaba nada
 * a ningún sitio: abría el cliente de correo del visitante, y Chrome avisaba
 * antes de "formulario no seguro". Ver la migración 0021.
 *
 * Se escribe con la clave de servicio, no con la del visitante: quien rellena
 * el formulario no tiene sesión, y dejar la tabla abierta a la clave pública
 * sería invitar a que la llenen por API sin pasar por esta validación.
 */

const CORREO_EQUIPO = 'hola@migriajob.com';

const esquema = z.object({
  name: z.string().trim().min(2, 'Dinos tu nombre.').max(120),
  email: z.string().trim().email('Ese correo no parece válido.').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  role: z.enum(['company', 'candidate', 'partner', 'other'], {
    message: 'Dinos si escribes como empresa o como candidato.',
  }),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  sector: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Cuéntanos un poco más, con una línea no podemos ayudarte.').max(4000),
});

export type EstadoContacto = { ok?: true; error?: string };

function clienteServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function enviarConsultaAction(
  _prev: EstadoContacto,
  formData: FormData
): Promise<EstadoContacto> {
  // Trampa para robots: un campo que un humano no ve y por tanto no rellena.
  // Si viene con algo, se responde que todo ha ido bien y no se guarda nada;
  // decirle a un bot que ha fallado solo le enseña a intentarlo mejor.
  if ((formData.get('website') as string)?.length) return { ok: true };

  const parsed = esquema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    role: formData.get('role'),
    company: formData.get('company') ?? '',
    sector: formData.get('sector') ?? '',
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos del formulario.' };
  }

  const supabase = clienteServidor();
  if (!supabase) {
    console.error('[contacto] falta SUPABASE_SERVICE_ROLE_KEY');
    return { error: `No hemos podido registrar tu consulta. Escríbenos a ${CORREO_EQUIPO} y la atendemos igual.` };
  }

  const { data: consulta, error } = await supabase
    .from('contact_requests')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
      company: parsed.data.company || null,
      sector: parsed.data.sector || null,
      message: parsed.data.message,
      source_path: '/contacto',
    })
    .select('id')
    .single<{ id: string }>();

  if (error) {
    // El caso más probable aquí es que la migración 0021 no se haya ejecutado
    // todavía. No dejamos al visitante sin salida: le damos el correo.
    console.error('[contacto] no se pudo guardar la consulta:', error.message);
    return { error: `No hemos podido registrar tu consulta. Escríbenos a ${CORREO_EQUIPO} y la atendemos igual.` };
  }

  // El aviso al equipo es cortesía, no la fuente de verdad: la consulta ya está
  // guardada. Si esto falla, el lead no se pierde.
  try {
    const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
    const quien = parsed.data.company ? `${parsed.data.name} (${parsed.data.company})` : parsed.data.name;
    const resumen = parsed.data.message.slice(0, 140);

    await Promise.all(
      (admins ?? []).map((a: { id: string }) =>
        createNotification({
          supabase,
          userId: a.id,
          type: 'system',
          payload: {
            message: `Nueva consulta de ${quien}: ${resumen}`,
            contact_request_id: consulta.id,
            email: parsed.data.email,
            role: parsed.data.role,
          },
          push: {
            title: 'Nueva consulta en MigriaJob',
            body: `${quien} — ${resumen}`,
            link: '/admin/notificaciones',
          },
        })
      )
    );
  } catch (err) {
    console.warn('[contacto] consulta guardada, aviso al equipo fallido:', err);
  }

  return { ok: true };
}
