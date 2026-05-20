import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const STAGE_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  interview: 'Entrevista',
  offer: 'Oferta',
  hired: 'Contratado',
  rejected: 'Descartado',
};

function csvEscape(v: unknown): string {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * Exporta el pipeline del empleador autenticado a CSV.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data } = await supabase
    .from('selection_processes')
    .select(`
      stage, notes, created_at, updated_at,
      candidate:candidates(headline, current_role, location_city, location_country, country_of_origin, slug)
    `)
    .eq('employer_id', user.id)
    .order('updated_at', { ascending: false });

  const headers = [
    'Etapa',
    'Candidato',
    'Rol',
    'País origen',
    'Ubicación',
    'Notas',
    'Creado',
    'Última actualización',
  ];

  const rows = (data ?? []).map((r) => {
    const c = r.candidate as {
      headline?: string | null; current_role?: string | null;
      location_city?: string | null; location_country?: string | null;
      country_of_origin?: string | null;
    } | null;
    return [
      STAGE_LABELS[r.stage] ?? r.stage,
      c?.headline ?? '',
      c?.current_role ?? '',
      c?.country_of_origin ?? '',
      [c?.location_city, c?.location_country].filter(Boolean).join(', '),
      r.notes ?? '',
      new Date(r.created_at).toISOString(),
      new Date(r.updated_at).toISOString(),
    ];
  });

  const bom = '﻿'; // BOM UTF-8 para Excel
  const csv = bom + [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const filename = `migria-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
