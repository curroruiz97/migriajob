'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';
import { REPORT_REASON_VALUES, REPORT_TARGETS } from './reasons';

/**
 * Denunciar contenido y bloquear usuarios.
 *
 * La directriz 1.2 de Apple pide cuatro cosas a las apps con contenido escrito
 * por usuarios: poder denunciar, poder bloquear, que alguien atienda las
 * denuncias y un contacto publicado. Esto cubre las dos primeras; la tercera
 * vive en /admin/moderacion y la cuarta en la pantalla de ajustes.
 *
 * El bloqueo se aplica ademas en las politicas de la base de datos (migracion
 * 0016). Aqui se comprueba antes solo para poder dar un mensaje entendible en
 * lugar del error crudo de Postgres.
 */

export async function reportContentAction(_prev: unknown, formData: FormData) {
  return safeAction(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Inicia sesión para poder denunciar.' };

    const targetType = String(formData.get('targetType') ?? '');
    const targetId = String(formData.get('targetId') ?? '');
    const reason = String(formData.get('reason') ?? '');
    const details = String(formData.get('details') ?? '').trim();

    if (!REPORT_TARGETS.includes(targetType as never)) {
      return { error: 'Tipo de contenido no válido' };
    }
    if (!targetId) return { error: 'Falta el contenido denunciado' };
    if (!REPORT_REASON_VALUES.includes(reason)) {
      return { error: 'Elige un motivo' };
    }

    // Una denuncia por persona y contenido: repetirla no acelera nada y llena
    // la bandeja de moderacion de ruido.
    const { data: previa } = await supabase
      .from('content_reports')
      .select('id')
      .eq('reporter_id', user.id)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle();

    if (previa) {
      return { ok: true as const, yaDenunciado: true };
    }

    const { error } = await supabase.from('content_reports').insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reason,
      details: details || null,
    });
    if (error) return { error: error.message };

    revalidatePath('/admin/moderacion');
    return { ok: true as const, yaDenunciado: false };
  });
}

const ESTADOS = ['abierta', 'en_revision', 'resuelta', 'descartada'] as const;

/**
 * Cambiar el estado de una denuncia. Solo admins: la política de la tabla lo
 * exige, esto solo evita el error feo.
 */
export async function resolveReportAction(reportId: string, status: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };
    if (!ESTADOS.includes(status as never)) return { error: 'Estado no válido' };

    const { error } = await supabase
      .from('content_reports')
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId);
    if (error) return { error: error.message };

    revalidatePath('/admin/moderacion');
    return { ok: true as const };
  });
}

export async function blockUserAction(targetUserId: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Inicia sesión para poder bloquear.' };
    if (!targetUserId) return { error: 'Usuario no válido' };
    if (targetUserId === user.id) return { error: 'No puedes bloquearte a ti mismo' };

    const { error } = await supabase
      .from('blocked_users')
      .upsert(
        { blocker_id: user.id, blocked_id: targetUserId },
        { onConflict: 'blocker_id,blocked_id' }
      );
    if (error) return { error: error.message };

    revalidatePath('/dashboard/mensajes');
    revalidatePath('/admin/mensajes');
    revalidatePath('/dashboard/configuracion');
    return { ok: true as const };
  });
}

export async function unblockUserAction(targetUserId: string) {
  return safeAction(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', targetUserId);
    if (error) return { error: error.message };

    revalidatePath('/dashboard/mensajes');
    revalidatePath('/admin/mensajes');
    revalidatePath('/dashboard/configuracion');
    return { ok: true as const };
  });
}
