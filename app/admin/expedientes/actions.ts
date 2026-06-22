'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { safeAction } from '@/lib/actions/safe';
import type { Database } from '@/lib/supabase/types';

type JourneyStage = Database['public']['Enums']['journey_stage'];
type PaymentStatus = Database['public']['Enums']['payment_status'];
type PaymentConcept = Database['public']['Enums']['payment_concept'];
type ObservationCategory = Database['public']['Enums']['observation_category'];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') throw new Error('Acceso denegado');

  return { user, supabase };
}

// ============ JOURNEY STAGE ============

export async function updateJourneyStageAction(
  journeyId: string,
  stage: JourneyStage,
  message?: string
) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('candidate_journey')
      .update({
        current_stage: stage,
        ...(message !== undefined ? { stage_message: message } : {}),
      })
      .eq('id', journeyId);

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    revalidatePath('/dashboard/mi-proceso');
    return { ok: true as const };
  });
}

export async function updateJourneyInfoAction(
  journeyId: string,
  data: {
    position?: string;
    employer_company?: string;
    salary?: number | null;
    destination_city?: string;
    start_date?: string | null;
    notes?: string;
  }
) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('candidate_journey')
      .update(data)
      .eq('id', journeyId);

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    revalidatePath('/dashboard/mi-proceso');
    return { ok: true as const };
  });
}

export async function createJourneyAction(candidateId: string) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('candidate_journey')
      .insert({ candidate_id: candidateId });

    if (error) {
      if (error.message.includes('duplicate')) return { error: 'Este candidato ya tiene un expediente' };
      return { error: error.message };
    }

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

// ============ PAYMENTS ============

export async function createPaymentAction(data: {
  journey_id: string;
  concept: PaymentConcept;
  description?: string;
  amount: number;
  currency?: string;
  status?: PaymentStatus;
  due_date?: string | null;
  payment_method?: string;
  reference_number?: string;
}) {
  return safeAction(async () => {
    const { user, supabase } = await requireAdmin();

    const { error } = await supabase
      .from('expediente_payments')
      .insert({ ...data, created_by: user.id });

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

export async function updatePaymentStatusAction(
  paymentId: string,
  status: PaymentStatus,
  paidAt?: string
) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();

    const paidAtValue = status === 'completado' && !paidAt
      ? new Date().toISOString()
      : paidAt ?? undefined;

    const { error } = await supabase
      .from('expediente_payments')
      .update({
        status,
        ...(paidAtValue ? { paid_at: paidAtValue } : {}),
      })
      .eq('id', paymentId);

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

export async function deletePaymentAction(paymentId: string) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from('expediente_payments')
      .delete()
      .eq('id', paymentId);
    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

// ============ OBSERVATIONS ============

export async function createObservationAction(data: {
  journey_id: string;
  category: ObservationCategory;
  body: string;
  is_pinned?: boolean;
}) {
  return safeAction(async () => {
    const { user, supabase } = await requireAdmin();

    const { error } = await supabase
      .from('expediente_observations')
      .insert({ ...data, created_by: user.id });

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

export async function deleteObservationAction(observationId: string) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from('expediente_observations')
      .delete()
      .eq('id', observationId);
    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

export async function toggleObservationPinAction(observationId: string, isPinned: boolean) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from('expediente_observations')
      .update({ is_pinned: isPinned })
      .eq('id', observationId);
    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

// ============ RECEIPTS ============

export async function createReceiptAction(data: {
  journey_id: string;
  payment_id?: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  description?: string;
}) {
  return safeAction(async () => {
    const { user, supabase } = await requireAdmin();

    const { error } = await supabase
      .from('expediente_receipts')
      .insert({ ...data, uploaded_by: user.id });

    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}

export async function deleteReceiptAction(receiptId: string) {
  return safeAction(async () => {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from('expediente_receipts')
      .delete()
      .eq('id', receiptId);
    if (error) return { error: error.message };

    revalidatePath('/admin/expedientes');
    return { ok: true as const };
  });
}
