import { createClient } from '@/lib/supabase/server';
import { BlockButton } from '@/components/moderation/block-button';
import { MODERATION_EMAIL } from '@/lib/moderation/reasons';

/**
 * Lista de personas y empresas que has bloqueado, con la opción de deshacerlo.
 *
 * Vive en Ajustes porque bloquear se hace en caliente, dentro de una
 * conversación, y desbloquear se hace en frío, días después, cuando esa
 * conversación ya no se encuentra.
 */
export async function BlockedList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: bloqueos } = await supabase
    .from('blocked_users')
    .select('blocked_id, created_at')
    .eq('blocker_id', user.id)
    .order('created_at', { ascending: false });

  const ids = (bloqueos ?? []).map((b: { blocked_id: string }) => b.blocked_id);

  let nombres: Record<string, string> = {};
  if (ids.length > 0) {
    const { data: perfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', ids);
    nombres = Object.fromEntries(
      (perfiles ?? []).map((p: { id: string; full_name: string | null }) => [
        p.id,
        p.full_name ?? 'Usuario',
      ])
    );
  }

  return (
    <div className="space-y-4">
      {ids.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No has bloqueado a nadie. Puedes bloquear a alguien desde su conversación.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {ids.map((id) => (
            <li key={id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="truncate text-sm text-foreground">
                {nombres[id] ?? 'Usuario'}
              </span>
              <BlockButton userId={id} nombre={nombres[id]} bloqueado />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Si alguien te está acosando o has visto contenido que no debería estar
        aquí, denúncialo desde el perfil, la oferta o la conversación, o
        escríbenos a{' '}
        <a className="underline" href={`mailto:${MODERATION_EMAIL}`}>
          {MODERATION_EMAIL}
        </a>
        . Revisamos todos los avisos.
      </p>
    </div>
  );
}
