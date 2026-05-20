import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * RGPD art. 20 — portabilidad.
 * Devuelve un JSON con todos los datos del usuario autenticado.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const [profile, candidate, applications, savedSearches, favorites, notifications, conversations] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('candidates').select('*').eq('profile_id', user.id).maybeSingle(),
      supabase.from('applications').select('*'),
      supabase.from('saved_searches').select('*').eq('user_id', user.id),
      supabase.from('favorites').select('*').eq('employer_id', user.id),
      supabase.from('notifications').select('*').eq('user_id', user.id),
      supabase
        .from('conversations')
        .select('*')
        .or(`employer_id.eq.${user.id},candidate_id.eq.${user.id}`),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user: { id: user.id, email: user.email, createdAt: user.created_at },
    profile: profile.data,
    candidate: candidate.data,
    applications: applications.data,
    savedSearches: savedSearches.data,
    favorites: favorites.data,
    notifications: notifications.data,
    conversations: conversations.data,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="migria-export-${user.id}.json"`,
    },
  });
}
